const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtAuth } = require('express-jwt'); // express-jwt 모듈 추가
const pool = require('./db');
const fetch = require('node-fetch').default;

const app = express();
const port = 3001;

// JWT Secret (환경 변수에서 가져오도록 변경)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // 기본값 설정 (프로덕션에서는 반드시 환경 변수 사용)

app.use(cors());
app.use(express.json());

// JWT 인증 미들웨어
const authenticateToken = jwtAuth({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false, // 토큰이 없어도 접근 가능하도록 설정 (뉴스 조회 등)
});

app.use(authenticateToken);

// 에러 핸들링 미들웨어 (JWT 인증 실패 시)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid Token' });
  } else {
    next(err);
  }
});

// User Registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid credential');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json('Invalid credential');
    }

    const token = jwt.sign({ user: user.rows[0].id }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User Preferences
app.get('/user/preferences', authenticateToken, async (req, res) => {
  if (!req.auth || !req.auth.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  try {
    const user = await pool.query('SELECT preferences FROM users WHERE id = $1', [req.auth.user]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ preferences: JSON.parse(user.rows[0].preferences || '[]') });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update User Preferences
app.post('/user/preferences', authenticateToken, async (req, res) => {
  if (!req.auth || !req.auth.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  const { preferences } = req.body; // preferences는 배열 형태를 기대

  try {
    // preferences가 유효한 JSON 배열인지 확인
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: 'Preferences must be an array.' });
    }

    const updatedUser = await pool.query(
      'UPDATE users SET preferences = $1 WHERE id = $2 RETURNING preferences',
      [JSON.stringify(preferences), req.auth.user]
    );
    res.json({ preferences: JSON.parse(updatedUser.rows[0].preferences) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// News API Endpoint
app.get('/news', authenticateToken, async (req, res) => {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) {
    return res.status(500).json({ error: 'News API key not configured.' });
  }

  let query = 'korea'; // 기본 검색어
  let language = 'ko'; // 기본 언어

  console.log('News API Request - User ID:', req.auth ? req.auth.user : 'Not logged in');

  // 로그인한 사용자이고 선호도가 있다면 쿼리에 반영
  if (req.auth && req.auth.user) {
    try {
      const user = await pool.query('SELECT preferences FROM users WHERE id = $1', [req.auth.user]);
      if (user.rows.length > 0 && user.rows[0].preferences) {
        const userPreferences = JSON.parse(user.rows[0].preferences);
        console.log('User Preferences from DB:', user.rows[0].preferences);
        if (userPreferences.length > 0) {
          query = userPreferences.join(' OR '); // 선호 장르를 OR로 연결
        }
      }
    } catch (err) {
      console.error('Error fetching user preferences for news query:', err.message);
      // 에러 발생 시 기본 쿼리 사용
    }
  }

  console.log('Final NewsAPI Query:', query);

  try {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=relevancy&apiKey=${NEWS_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
