// ============================================================
// Home.jsx — The main page. All the app state lives here.
//
// STATE (using only useState + useEffect):
//   query        - search input text
//   users        - list of users from GitHub search API
//   selectedUser - the user whose repos we're viewing
//   repos        - list of repos for the selected user
//   loading      - true while an API request is in progress
//   error        - error message string (empty = no error)
//   sortBy       - "default" | "stars" | "forks"
//   filterLang   - language string to filter repos (e.g. "JavaScript")
//   currentPage  - current page number for pagination
//   activeTab    - "repos" | "bookmarks"
//   bookmarks    - array of bookmarked repos from localStorage
// ============================================================
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import { fetchUsers, fetchRepos } from '../services/githubService';

// How many repos to show per page
const REPOS_PER_PAGE = 9;

function Home() {
  // ---- STATE DECLARATIONS ----
  const [query, setQuery] = useState('');              // text in the search input
  const [users, setUsers] = useState([]);              // search result users
  const [selectedUser, setSelectedUser] = useState(null); // clicked user object
  const [repos, setRepos] = useState([]);              // repos of selectedUser
  const [loading, setLoading] = useState(false);       // spinner on/off
  const [error, setError] = useState('');              // error message
  const [sortBy, setSortBy] = useState('default');     // repo sort preference
  const [filterLang, setFilterLang] = useState('');    // language filter
  const [currentPage, setCurrentPage] = useState(1);  // pagination
  const [activeTab, setActiveTab] = useState('repos'); // repos or bookmarks tab
  const [bookmarks, setBookmarks] = useState([]);      // bookmarked repos

  // ================================================================
  // EFFECT #1 — Search users with DEBOUNCE
  //
  // This effect runs every time `query` changes.
  // Instead of calling the API on every single keystroke, we:
  //   1. Set a 400ms timer
  //   2. When the timer fires, call the GitHub API
  //   3. If the user types again before 400ms, cancel the old timer
  //      and start a new one (this is the "debounce" pattern)
  // ================================================================
  useEffect(() => {
    // If the search box is empty, clear results and stop
    if (!query.trim()) {
      setUsers([]);
      setError('');
      return;
    }

    // Start a 400ms countdown before calling the API
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      setUsers([]);
      setSelectedUser(null);
      setRepos([]);

      try {
        const results = await fetchUsers(query);
        setUsers(results);
        if (results.length === 0) {
          setError('No users found for "' + query + '".');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    // CLEANUP: if user types again within 400ms, cancel the previous timer
    return () => clearTimeout(timer);
  }, [query]); // ← re-run this effect whenever `query` changes

  // ================================================================
  // EFFECT #2 — Fetch repositories when a user is selected
  //
  // This effect runs whenever `selectedUser` changes.
  // When the user clicks a UserCard, selectedUser is set, and this
  // effect immediately fires to fetch that user's repos.
  // ================================================================
  useEffect(() => {
    // If no user is selected, don't do anything
    if (!selectedUser) return;

    // Reset filters and pagination for the new user
    setSortBy('default');
    setFilterLang('');
    setCurrentPage(1);
    setRepos([]);
    setError('');
    setLoading(true);

    fetchRepos(selectedUser.login)
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedUser]); // ← re-run this effect whenever `selectedUser` changes

  // ================================================================
  // EFFECT #3 — Load bookmarks from localStorage on first render
  //
  // This runs once when the page first loads.
  // We read saved bookmarks so the Bookmarks tab can display them.
  // ================================================================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
    setBookmarks(saved);
  }, []); // ← empty array means "run only once, on mount"


  // ================================================================
  // DERIVED DATA — Apply sort + filter + pagination to repos
  //
  // This is NOT a useEffect — it runs on every render.
  // We compute the filtered/sorted list from the raw `repos` state.
  // ================================================================

  // Step 1: Filter by selected language
  const filteredRepos = repos.filter((repo) => {
    if (!filterLang) return true; // "All Languages" selected, show everything
    return repo.language === filterLang;
  });

  // Step 2: Sort the filtered list
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
    if (sortBy === 'forks') return b.forks_count - a.forks_count;
    return 0; // "default" keeps the original order (by updated date from API)
  });

  // Step 3: Paginate — slice the sorted list to only show current page
  const totalPages = Math.ceil(sortedRepos.length / REPOS_PER_PAGE);
  const paginatedRepos = sortedRepos.slice(
    (currentPage - 1) * REPOS_PER_PAGE,
    currentPage * REPOS_PER_PAGE
  );

  // Step 4: Get unique languages for the filter dropdown
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();

  // ================================================================
  // HANDLERS
  // ================================================================

  // When user clicks a UserCard, update selectedUser state
  function handleUserSelect(user) {
    setSelectedUser(user);
    setActiveTab('repos');
  }

  // When search input changes
  function handleQueryChange(value) {
    setQuery(value);
    setCurrentPage(1);
  }

  // Clear everything and reset to initial state
  function handleClear() {
    setQuery('');
    setUsers([]);
    setSelectedUser(null);
    setRepos([]);
    setError('');
    setSortBy('default');
    setFilterLang('');
    setCurrentPage(1);
  }

  // Sort dropdown changed
  function handleSortChange(value) {
    setSortBy(value);
    setCurrentPage(1); // reset to page 1 when sort changes
  }

  // Language filter changed
  function handleLangChange(value) {
    setFilterLang(value);
    setCurrentPage(1); // reset to page 1 when filter changes
  }

  // Remove all bookmarks
  function handleClearBookmarks() {
    localStorage.removeItem('gh_bookmarks');
    setBookmarks([]);
  }

  // Refresh bookmarks from localStorage (called after RepoCard updates them)
  function handleTabChange(tab) {
    if (tab === 'bookmarks') {
      // Re-read from localStorage so we always show the latest bookmarks
      const saved = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
      setBookmarks(saved);
    }
    setActiveTab(tab);
  }

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="main-content">

      {/* ---- HERO SECTION ---- */}
      <div className="hero">
        <h1>Search <span>GitHub</span> Users</h1>
        <p>Explore repositories, discover projects, and bookmark your favourites.</p>
      </div>

      {/* ---- SEARCH BAR ---- */}
      {/*
        SearchBar is a "dumb" component — it doesn't know about the API.
        It just shows the input and calls our handlers.
      */}
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onClear={handleClear}
      />

      {/* ---- LOADING SPINNER ---- */}
      {loading && <Loader message={selectedUser ? `Fetching repos for ${selectedUser.login}...` : 'Searching users...'} />}

      {/* ---- ERROR MESSAGE ---- */}
      {error && !loading && (
        <div className="error-box">
          <span className="error-icon">
            {/* Warning triangle SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {/* ---- USER RESULTS GRID ---- */}
      {!loading && !error && users.length > 0 && (
        <div>
          <p className="section-label">
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </p>
          <div className="user-grid">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isActive={selectedUser?.login === user.login}
                onSelect={handleUserSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* ---- EMPTY STATE: no users after search ---- */}
      {!loading && !error && query.trim() && users.length === 0 && (
        <div className="empty-box">
          <span className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <h3>No users found</h3>
          <p>Try a different search term.</p>
        </div>
      )}

      {/* ---- INITIAL EMPTY STATE: before any search ---- */}
      {!loading && !error && !query.trim() && (
        <div className="empty-box">
          <span className="empty-icon">
            {/* GitHub-style Octocat mark SVG */}
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.57v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </span>
          <h3>Start by searching a GitHub username</h3>
          <p>Type above to search for users and explore their public repositories.</p>
        </div>
      )}

      {/* ================================================================
          REPOSITORY SECTION — shown only when a user is selected
          ================================================================ */}
      {selectedUser && !loading && repos.length > 0 && (
        <div className="repo-section">

          {/* Selected user banner */}
          <div className="selected-user-banner">
            <img src={selectedUser.avatar_url} alt={selectedUser.login} />
            <div>
              <h2>@{selectedUser.login}</h2>
              <p>{repos.length} public repositories</p>
            </div>
            <a
              href={`https://github.com/${selectedUser.login}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub ↗
            </a>
          </div>

          {/* Tabs: Repos / Bookmarks */}
          <div className="tabs">
            <button
              id="tab-repos"
              className={`tab-btn ${activeTab === 'repos' ? 'active' : ''}`}
              onClick={() => handleTabChange('repos')}
            >
              Repositories
            </button>
            <button
              id="tab-bookmarks"
              className={`tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => handleTabChange('bookmarks')}
            >
              Bookmarks ({bookmarks.length})
            </button>
          </div>

          {/* ---- TAB: REPOSITORIES ---- */}
          {activeTab === 'repos' && (
            <>
              {/* Filter & Sort controls */}
              <FilterBar
                sortBy={sortBy}
                onSortChange={handleSortChange}
                filterLang={filterLang}
                onLangChange={handleLangChange}
                languages={languages}
                totalCount={filteredRepos.length}
              />

              {/* Empty state after filtering */}
              {filteredRepos.length === 0 && (
                <div className="empty-box">
                  <span className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <h3>No repositories match this filter</h3>
                  <p>Try selecting a different language.</p>
                </div>
              )}

              {/* Repo grid */}
              <div className="repo-grid">
                {paginatedRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>

                  {/* Show page number buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* ---- TAB: BOOKMARKS ---- */}
          {activeTab === 'bookmarks' && (
            <div className="bookmarks-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              {bookmarks.length === 0 ? (
                <div className="empty-box">
                  <span className="empty-icon">
                    {/* Empty star SVG */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>
                  <h3>No bookmarks yet</h3>
                  <p>Click the star icon on any repository to bookmark it.</p>
                </div>
              ) : (
                <>
                  <div className="bookmarks-header">
                    <h2>Saved Repositories</h2>
                    <button className="clear-bookmarks-btn" onClick={handleClearBookmarks}>
                      Clear All
                    </button>
                  </div>
                  <div className="repo-grid">
                    {bookmarks.map((repo) => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Home;
