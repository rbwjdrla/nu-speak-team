import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ activeCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { id: 'domestic', name: '국내 뉴스' },
    { id: 'international', name: '해외 뉴스' },
    // Add more categories here if needed
  ];

  return (
    <div
      className={`h-screen sticky top-0 bg-background border-r border-border p-4 flex flex-col transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="mb-8 flex items-center justify-center">
        <Link to="/" className="flex items-center justify-center">
          <img src="/nuspeakLogo.png" alt="NuSpeak Logo" className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex flex-col space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center px-3 py-2 rounded-md text-left text-sm font-medium transition-colors duration-200
              ${activeCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            {/* Placeholder for icon if needed */}
            <span className="flex-shrink-0 mr-3">
              {/* You can replace this with actual icons later */}
              {category.id === 'domestic' ? '🇰🇷' : '🌍'}
            </span>
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {category.name}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;