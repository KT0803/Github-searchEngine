import React from 'react';

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-wrapper">
      <span className="search-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        id="github-search-input"
        type="text"
        className="search-input"
        placeholder="Search GitHub users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck="false"
      />

      {value && (
        <button className="search-clear" onClick={onClear} title="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
