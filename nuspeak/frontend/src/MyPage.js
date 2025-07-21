import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const [userEmail, setUserEmail] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [editablePreferences, setEditablePreferences] = useState([]); // Now an array
  const [newPreference, setNewPreference] = useState(''); // For the new input field
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success/error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const prefResponse = await axios.get('http://localhost:3001/user/preferences', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPreferences(prefResponse.data.preferences);
        setEditablePreferences(prefResponse.data.preferences); // Set as array

        // Placeholder for user email
        setUserEmail('user@example.com'); 

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('사용자 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAddPreference = () => {
    if (newPreference.trim() !== '' && !editablePreferences.includes(newPreference.trim())) {
      setEditablePreferences([...editablePreferences, newPreference.trim()]);
      setNewPreference(''); // Clear input field
    }
  };

  const handleRemovePreference = (prefToRemove) => {
    setEditablePreferences(editablePreferences.filter(pref => pref !== prefToRemove));
  };

  const handleSavePreferences = async () => {
    setMessage(null);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/user/preferences', 
        { preferences: editablePreferences }, // Send array directly
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreferences(response.data.preferences);
      setEditablePreferences(response.data.preferences);
      setMessage('선호도가 성공적으로 저장되었습니다!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setMessage('선호도 저장에 실패했습니다. 다시 시도해주세요.');
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-foreground">
        사용자 데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-destructive">
        오류: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center py-12 px-4">
      <div className="bg-background p-8 rounded-lg shadow-lg w-full max-w-2xl border border-border">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">마이페이지</h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.includes('성공') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="mb-6">
          <p className="text-lg font-semibold mb-2">이메일:</p>
          <p className="text-foreground text-base p-3 bg-muted rounded-md">{userEmail}</p>
        </div>

        <div className="mb-6">
          <label htmlFor="newPreference" className="text-lg font-semibold mb-2 block">내 선호도:</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {editablePreferences.map((pref, index) => (
              <span 
                key={index} 
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleRemovePreference(pref)}
              >
                {pref}
                <span className="ml-2 text-xs">&#x2715;</span> {/* X icon */}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="newPreference"
              className="flex-grow p-3 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') { handleAddPreference(); } }}
              placeholder="새로운 선호도 입력"
            />
            <button
              onClick={handleAddPreference}
              className="bg-accent text-accent-foreground font-bold py-3 px-4 rounded-md hover:bg-accent/90 transition-colors focus:outline-none focus:shadow-outline"
            >
              추가
            </button>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:shadow-outline mb-4"
        >
          선호도 저장
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-destructive text-destructive-foreground font-bold py-3 px-4 rounded-md hover:bg-destructive/90 transition-colors focus:outline-none focus:shadow-outline"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;
