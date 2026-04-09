// ============================================================
// SearchBar.jsx — Controlled input for searching GitHub users
//
// Props:
//   value    - current value of the input (controlled from parent)
//   onChange - function called when user types (updates parent state)
//   onClear  - function called when user clicks the X button
// ============================================================
import React from 'react';

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-wrapper">
      {/* Search icon (SVG) */}
      <span className="search-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {/* The actual text input — value and onChange controlled from Home.jsx */}
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

      {/* Show clear button only if there is text in the input */}
      {value && (
        <button className="search-clear" onClick={onClear} title="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
