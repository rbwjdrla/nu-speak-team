import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SummaryModal({ isOpen, onClose, article }) {
  const [fullSummary, setFullSummary] = useState('');
  const [threeLineSummary, setThreeLineSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('full'); // 'full' or 'threeLine'

  useEffect(() => {
    if (isOpen && article) {
      const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        setFullSummary('');
        setThreeLineSummary('');
        try {
          const textToSummarize = article.content || article.description || '';
          if (!textToSummarize) {
            setError('요약할 내용이 없습니다.');
            setLoading(false);
            return;
          }
          const response = await axios.post('http://localhost:3001/summarize', { text: textToSummarize });
          setFullSummary(response.data.fullSummary);
          setThreeLineSummary(response.data.threeLineSummary);
        } catch (err) {
          console.error('Error fetching summary:', err);
          setError(err.response?.data?.error || 'Failed to fetch summary.');
        } finally {
          setLoading(false);
        }
      };
      fetchSummary();
    }
  }, [isOpen, article]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-background text-foreground rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{article.title}</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-2xl">&times;</button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex border-b border-border mb-4">
            <button
              onClick={() => setActiveTab('full')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'full' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              일반 요약
            </button>
            <button
              onClick={() => setActiveTab('threeLine')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'threeLine' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              3줄 요약
            </button>
          </div>

          <div className="prose max-w-none max-h-[50vh] overflow-y-auto text-foreground pr-4">
            {loading && <p className="text-center">요약 중...</p>}
            {error && <p className="text-destructive text-center">오류: {error}</p>}
            {!loading && !error && (
              <p className="whitespace-pre-wrap leading-relaxed">
                {activeTab === 'full' ? fullSummary : threeLineSummary}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border mt-auto text-right bg-secondary/50 rounded-b-lg">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
            원본 기사 보기 &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

export default SummaryModal;
