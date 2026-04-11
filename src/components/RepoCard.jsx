import React, { useState, useEffect } from 'react';
import { formatNumber, getLanguageColor } from '../utils/helpers';

function RepoCard({ repo }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
    const found = bookmarks.some((b) => b.id === repo.id);
    setIsBookmarked(found);
  }, [repo.id]);

  function handleBookmark() {
    const bookmarks = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');

    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter((b) => b.id !== repo.id);
    } else {
      updated = [...bookmarks, {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        open_issues_count: repo.open_issues_count,
        watchers_count: repo.watchers_count,
      }];
    }

    localStorage.setItem('gh_bookmarks', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  }

  const langColor = getLanguageColor(repo.language);

  return (
    <div className="repo-card">
      <div className="repo-card-header">
        <a
          className="repo-name"
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          title={repo.full_name}
        >
          {repo.name}
        </a>

        <button
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark this repo'}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this repo'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isBookmarked ? 'var(--bookmark-active)' : 'none'}
            stroke={isBookmarked ? 'var(--bookmark-active)' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <p className="repo-description">
        {repo.description || 'No description available.'}
      </p>

      {repo.language && (
        <div className="repo-language">
          <span className="lang-dot" style={{ background: langColor }}></span>
          {repo.language}
        </div>
      )}

      <div className="repo-stats">
        <span className="stat stat-star" title="Stars">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {formatNumber(repo.stargazers_count)}
        </span>
        <span className="stat stat-fork" title="Forks">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          {formatNumber(repo.forks_count)}
        </span>
        <span className="stat stat-issue" title="Open Issues">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {formatNumber(repo.open_issues_count)}
        </span>
        <span className="stat stat-watch" title="Watchers">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {formatNumber(repo.watchers_count)}
        </span>
      </div>
    </div>
  );
}

export default RepoCard;
