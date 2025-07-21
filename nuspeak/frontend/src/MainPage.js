import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SummaryModal from './SummaryModal';
import Sidebar from './Sidebar'; // Sidebar 컴포넌트 임포트

function MainPage({ isLoggedIn, onLogout }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('domestic'); // 기본 카테고리: 국내 뉴스

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axios.get(`http://localhost:3001/news?category=${activeCategory}`, { headers });
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please ensure the backend server is running and configured correctly.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [isLoggedIn, activeCategory]); // activeCategory가 변경될 때마다 뉴스 다시 불러오기

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsSummaryModalOpen(true);
  };

  const handleCloseSummaryModal = () => {
    setIsSummaryModalOpen(false);
    setSelectedArticle(null);
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex justify-end items-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className="text-foreground/80 transition-colors hover:text-primary">
                  마이페이지
                </Link>
                <button
                  onClick={onLogout}
                  className="text-foreground/80 transition-colors hover:text-primary bg-transparent border-none cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-foreground/80 transition-colors hover:text-primary">
                  로그인
                </Link>
                <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </header>

        <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">세상의 모든 뉴스, NuSpeak과 함께</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              AI가 당신의 관심사에 맞춰 개인화된 뉴스를 제공합니다. 지금 바로 최신 소식을 만나보세요.
            </p>
          </section>

          <section>
            {loading && <p className="text-center text-muted-foreground">뉴스를 불러오는 중...</p>}
            {error && <p className="text-center text-destructive">오류: {error}</p>}
            {!loading && !error && articles.length === 0 && (
              <p className="text-center text-muted-foreground">표시할 뉴스가 없습니다.</p>
            )}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {!loading && !error && articles.map((article, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer flex flex-col group"
                  onClick={() => handleArticleClick(article)}
                >
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary flex items-center justify-center rounded-t-lg">
                      <span className="text-muted-foreground">이미지 없음</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-card-foreground leading-snug">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{article.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto pt-4 border-t">
                      <span>{article.source.name}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="py-8 mt-16 bg-background">
          <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 NuSpeak. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <Link to="#" className="hover:text-primary transition-colors">개인정보처리방침</Link>
              <Link to="#" className="hover:text-primary transition-colors">이용약관</Link>
            </nav>
          </div>
        </footer>
      </div>

      {selectedArticle && (
        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={handleCloseSummaryModal}
          article={selectedArticle}
        />
      )}
    </div>
  );
}

export default MainPage;