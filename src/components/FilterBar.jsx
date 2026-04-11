import React from 'react';

function FilterBar({ sortBy, onSortChange, filterLang, onLangChange, languages, totalCount }) {
  return (
    <div className="filter-bar">
      <label className="filter-label" htmlFor="sort-select">Sort:</label>
      <select
        id="sort-select"
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Recently Updated</option>
        <option value="stars">Most Stars</option>
        <option value="forks">Most Forks</option>
      </select>

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
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </>
      )}

      <span className="repo-count-badge">{totalCount} repos</span>
    </div>
  );
}

export default FilterBar;
