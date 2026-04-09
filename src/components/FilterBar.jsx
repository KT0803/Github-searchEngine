// ============================================================
// FilterBar.jsx — Sorting and language filtering for repo list
//
// Props:
//   sortBy        - current sort value ("default" | "stars" | "forks")
//   onSortChange  - called when user changes sort
//   filterLang    - current language filter value (e.g. "JavaScript")
//   onLangChange  - called when user changes language filter
//   languages     - array of unique languages from the fetched repos
//   totalCount    - total number of repos matching current filters
// ============================================================
import React from 'react';

function FilterBar({ sortBy, onSortChange, filterLang, onLangChange, languages, totalCount }) {
  return (
    <div className="filter-bar">
      {/* Sort dropdown */}
      <label className="filter-label" htmlFor="sort-select">Sort:</label>
      <select
        id="sort-select"
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Recently Updated</option>
        <option value="stars">⭐ Most Stars</option>
        <option value="forks">🍴 Most Forks</option>
      </select>

      {/* Language filter dropdown — only shows if there are languages */}
      {languages.length > 0 && (
        <>
          <label className="filter-label" htmlFor="lang-select">Language:</label>
          <select
            id="lang-select"
            className="filter-select"
            value={filterLang}
            onChange={(e) => onLangChange(e.target.value)}
          >
            <option value="">All Languages</option>
            {/* Map over unique languages from the repo list */}
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Shows how many repos are visible after filtering */}
      <span className="repo-count-badge">{totalCount} repos</span>
    </div>
  );
}

export default FilterBar;
