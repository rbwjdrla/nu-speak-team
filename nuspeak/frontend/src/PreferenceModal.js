import React, { useState, useEffect } from 'react';
import axios from 'axios';

const genres = [
  'Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'
];

function PreferenceModal({ isOpen, onClose, onSave }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 현재 사용자 선호도 불러오기
      const fetchPreferences = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found.');
          return;
        }
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3001/user/preferences', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSelectedGenres(response.data.preferences || []);
        } catch (err) {
          console.error('Error fetching preferences:', err);
          setError('Failed to load preferences.');
        } finally {
          setLoading(false);
        }
      };
      fetchPreferences();
    }
  }, [isOpen]);

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre)
        ? prevSelected.filter((g) => g !== genre)
        : [...prevSelected, genre]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:3001/user/preferences', { preferences: selectedGenres }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave(selectedGenres); // 부모 컴포넌트에 저장된 선호도 전달
      onClose(); // 모달 닫기
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">선호하는 뉴스 장르를 선택해주세요</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">최소 하나 이상 선택해주세요.</p>
        {loading && <p className="text-center text-primary">불러오는 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`py-2 px-4 rounded-md border ${selectedGenres.includes(genre) ? 'bg-primary text-primary-foreground border-primary' : 'bg-gray-100 text-foreground border-gray-300 hover:bg-gray-200'}`}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={selectedGenres.length === 0 || loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferenceModal;
