require('dotenv').config();

require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtAuth } = require('express-jwt');
const pool = require('./db');
const app = express();
const port = 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(express.json());

const authenticateToken = jwtAuth({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
});

app.use(authenticateToken);

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
  console.log('Register attempt for email:', email);

  if (!email || !password) {
    console.error('Missing email or password in registration request.');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed. Attempting to insert into database...');
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    console.log('User registered successfully:', newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Registration error - full error object:', err);
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already exists.' });
    }
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
  const { preferences } = req.body;

  try {
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

  const { category = 'domestic' } = req.query; // Default to domestic
  let params = {};
  let userQuery = '';

  // Fetch user preferences for both categories
  if (req.auth && req.auth.user) {
    try {
      const user = await pool.query('SELECT preferences FROM users WHERE id = $1', [req.auth.user]);
      if (user.rows.length > 0 && user.rows[0].preferences) {
        const userPreferences = JSON.parse(user.rows[0].preferences);
        if (userPreferences.length > 0) {
          userQuery = userPreferences.join(' OR ');
        }
      }
    } catch (err) {
      console.error('Error fetching user preferences for news query:', err.message);
    }
  }

  if (category === 'international') {
    params = {
      sources: 'bbc-news,cnn,reuters',
      language: 'en',
      sortBy: 'publishedAt',
      apiKey: NEWS_API_KEY,
      q: userQuery || 'world news OR breaking news', // Apply user preferences or default broad query
    };
  } else { // domestic
    params = {
      q: userQuery || 'korea', // Apply user preferences or default 'korea'
      language: 'ko',
      sortBy: 'relevancy',
      apiKey: NEWS_API_KEY,
    };
  }

  try {
    const baseUrl = 'https://newsapi.org/v2/everything';
    const newsApiUrl = `${baseUrl}?${new URLSearchParams(params).toString()}`;

    console.log('Constructed News API URL:', newsApiUrl);

    const response = await fetch(newsApiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

app.get('/check-db', async (req, res) => {
  try {
    await pool.query('SELECT 1 FROM users LIMIT 1');
    res.status(200).json({ message: 'Database connected and users table exists.' });
  } catch (err) {
    console.error('Database check error:', err.message);
    res.status(500).json({ message: 'Database connection or users table issue.', error: err.message });
  }
});

app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text to summarize is required.' });
  }

  const createPrompt = (minLength, maxLength, content) => {
    let lengthConstraint = `최소 ${minLength}개의 문장`;
    if (maxLength) {
      lengthConstraint = `정확히 ${maxLength}개의 문장`;
    }

    return `당신은 주어진 텍스트를 요약하는 전문가입니다.\n\n[규칙]\n- 반드시 요약문만 응답해야 합니다.\n- 서론, 부연 설명, 인사 등 어떤 추가 텍스트도 포함해서는 안 됩니다.\n- 문장의 길이에 대한 지시를 반드시 따라야 합니다.\n- 자연스럽고 유려한 한국어 문체로 요약해야 합니다. 반복적인 어미 사용을 피하고, 문장 간의 연결이 부드러워야 합니다.\n\n[예시]\n입력 텍스트: 대한민국의 수도는 서울입니다. 서울은 천만 명이 넘는 인구가 사는 대도시이며, 경제와 문화의 중심지입니다.\n요약 (3문장): 대한민국의 수도는 서울입니다. 천만 명 이상의 인구가 거주하는 대도시입니다. 경제와 문화의 중심지 역할을 합니다.\n\n[요청]\n위 규칙과 예시를 참고하여, 다음 텍스트를 ${lengthConstraint}으로 요약하세요.\n\n입력 텍스트: ${content}`;
  };

  try {
    // General summary
    const fullSummaryResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:latest',
      prompt: createPrompt(7, null, text),
      stream: false,
    });

    // 3-line summary
    const threeLineSummaryResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:latest',
      prompt: createPrompt(3, 3, text),
      stream: false,
    });

    res.json({
      fullSummary: fullSummaryResponse.data.response.trim(),
      threeLineSummary: threeLineSummaryResponse.data.response.trim()
    });

  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
