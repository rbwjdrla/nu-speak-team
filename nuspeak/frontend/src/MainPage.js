import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MainPage({ isLoggedIn }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await axios.get('http://localhost:3001/news', { headers });
        setArticles(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please ensure the backend server is running and configured correctly.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [isLoggedIn]); // isLoggedIn 상태가 변경될 때마다 뉴스를 다시 가져오도록 설정

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header - Simplified based on nuspeak-homepage/components/header.tsx */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-6">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">NuSpeak</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
              로그인
            </Link>
            <Link to="/register" className="text-sm font-medium transition-colors hover:text-primary">
              회원가입
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HeroSection - Simplified based on nuspeak-homepage/components/hero-section.tsx */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mx-auto">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  NuSpeak으로 새로운 소식과 트렌드를 만나보세요
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground md:text-xl">
                  AI 기반의 맞춤형 정보 제공으로 세상의 흐름을 놓치지 마세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TrendStrip Placeholder - Simplified */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted text-center">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">주요 기능</h2>
            <p className="mx-auto max-w-[700px] text-foreground md:text-xl mt-4">
              NuSpeak이 제공하는 혁신적인 기능들을 살펴보세요.
            </p>
            <div className="grid gap-6 lg:grid-cols-3 mt-8 mx-auto">
              <div className="flex flex-col items-center space-y-2">
                <h3 className="text-xl font-bold">개인화된 뉴스 피드</h3>
                <p className="text-foreground">AI가 당신의 관심사에 맞춰 최신 뉴스를 선별하여 제공합니다.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <h3 className="text-xl font-bold">실시간 트렌드 분석</h3>
                <p className="text-foreground">현재 가장 인기 있는 토픽과 이슈를 실시간으로 파악하세요.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <h3 className="text-xl font-bold">심층 분석 리포트</h3>
                <p className="text-foreground">복잡한 이슈를 쉽게 이해할 수 있도록 심층 분석 리포트를 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Articles Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8">최신 뉴스</h2>
            {loading && <p className="text-foreground">뉴스를 불러오는 중...</p>}
            {error && <p className="text-red-500">오류: {error}</p>}
            {!loading && !error && articles.length === 0 && (
              <p className="text-foreground">표시할 뉴스가 없습니다.</p>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {!loading && !error && articles.map((article, index) => (
                <div key={index} className="rounded-lg border bg-card text-foreground shadow-sm p-4 flex flex-col">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-sm text-foreground mb-4 flex-grow">{article.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{article.source.name}</span>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">자세히 보기</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TestimonialsSection Placeholder - Simplified */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted text-center">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">사용자 후기</h2>
            <p className="mx-auto max-w-[700px] text-foreground md:text-xl mt-4">
              NuSpeak으로 성공적인 정보 습득 경험을 한 사용자들의 이야기를 들어보세요.
            </p>
            <div className="grid gap-6 lg:grid-cols-2 mt-8 mx-auto">
              <div className="rounded-lg border bg-card text-foreground shadow-sm p-6">
                <p className="text-lg font-semibold">"NuSpeak 덕분에 매일 새로운 소식을 놓치지 않아요!"</p>
                <p className="text-sm text-foreground mt-2">- 김철수</p>
              </div>
              <div className="rounded-lg border bg-card text-foreground shadow-sm p-6">
                <p className="text-lg font-semibold">"개인화된 피드가 정말 유용합니다."</p>
                <p className="text-sm text-foreground mt-2">- 이영희</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Simplified based on nuspeak-homepage/components/footer.tsx */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mx-auto">
        <p className="text-xs text-foreground">&copy; 2025 NuSpeak. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            개인정보처리방침
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            이용약관
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default MainPage;