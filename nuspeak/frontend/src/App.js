import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import MainPage from './MainPage';
import PreferenceModal from './PreferenceModal';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

  // useEffect(() => {
  //   const checkUserPreferences = async () => {
  //     if (isLoggedIn) {
  //       const token = localStorage.getItem('token');
  //       try {
  //         const response = await axios.get('http://localhost:3001/user/preferences', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         // 선호도가 비어있으면 모달 표시
  //         if (!response.data.preferences || response.data.preferences.length === 0) {
  //           setShowPreferenceModal(true);
  //         }
  //       } catch (error) {
  //         console.error('Error checking user preferences:', error);
  //         // 에러 발생 시에도 모달 표시 (네트워크 문제 등으로 선호도를 가져오지 못했을 경우)
  //         setShowPreferenceModal(true);
  //       }
  //     }
  //   };
  //   checkUserPreferences();
  // }, [isLoggedIn]); // isLoggedIn 상태가 변경될 때마다 뉴스를 다시 가져오도록 설정

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3001/user/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data.preferences || response.data.preferences.length === 0) {
        setShowPreferenceModal(true);
      }
    } catch (error) {
      console.error('Error checking user preferences after login:', error);
      setShowPreferenceModal(true);
    }
  };

  const handlePreferencesSaved = (preferences) => {
    setShowPreferenceModal(false);
    // 선호도 저장 후 필요한 추가 로직 (예: 뉴스 새로고침)
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/home" element={<Home />} /> {/* Home 컴포넌트는 현재 사용되지 않음 */}
        <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PreferenceModal
        isOpen={showPreferenceModal}
        onClose={() => setShowPreferenceModal(false)}
        onSave={handlePreferencesSaved}
      />
    </Router>
  );
}

export default App;