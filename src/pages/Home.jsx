import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import { fetchUsers, fetchRepos } from '../services/githubService';

const REPOS_PER_PAGE = 9;

function Home() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterLang, setFilterLang] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('repos');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setError('');
      return;
    }

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

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!selectedUser) return;

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
  }, [selectedUser]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
    setBookmarks(saved);
  }, []);

  const filteredRepos = repos.filter((repo) => {
    if (!filterLang) return true;
    return repo.language === filterLang;
  });

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
    if (sortBy === 'forks') return b.forks_count - a.forks_count;
    return 0;
  });

  const totalPages = Math.ceil(sortedRepos.length / REPOS_PER_PAGE);
  const paginatedRepos = sortedRepos.slice(
    (currentPage - 1) * REPOS_PER_PAGE,
    currentPage * REPOS_PER_PAGE
  );

  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))].sort();

  function handleUserSelect(user) {
    setSelectedUser(user);
    setActiveTab('repos');
  }

  function handleQueryChange(value) {
    setQuery(value);
    setCurrentPage(1);
  }

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

  function handleSortChange(value) {
    setSortBy(value);
    setCurrentPage(1);
  }

  function handleLangChange(value) {
    setFilterLang(value);
    setCurrentPage(1);
  }

  function handleClearBookmarks() {
    localStorage.removeItem('gh_bookmarks');
    setBookmarks([]);
  }

  function handleTabChange(tab) {
    if (tab === 'bookmarks') {
      const saved = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
      setBookmarks(saved);
    }
    setActiveTab(tab);
  }

  return (
    <main className="main-content">
      <div className="hero">
        <h1>Search <span>GitHub</span> Users</h1>
        <p>Explore repositories, discover projects, and bookmark your favourites.</p>
      </div>

      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onClear={handleClear}
      />

      {loading && <Loader message={selectedUser ? `Fetching repos for ${selectedUser.login}...` : 'Searching users...'} />}

      {error && !loading && (
        <div className="error-box">
          <span className="error-icon">
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

      {!loading && !error && !query.trim() && (
        <div className="empty-box">
          <span className="empty-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.57v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </span>
          <h3>Start by searching a GitHub username</h3>
          <p>Type above to search for users and explore their public repositories.</p>
        </div>
      )}

      {selectedUser && !loading && repos.length > 0 && (
        <div className="repo-section">
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

          {activeTab === 'repos' && (
            <>
              <FilterBar
                sortBy={sortBy}
                onSortChange={handleSortChange}
                filterLang={filterLang}
                onLangChange={handleLangChange}
                languages={languages}
                totalCount={filteredRepos.length}
              />

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

              <div className="repo-grid">
                {paginatedRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Prev
                  </button>

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

          {activeTab === 'bookmarks' && (
            <div className="bookmarks-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              {bookmarks.length === 0 ? (
                <div className="empty-box">
                  <span className="empty-icon">
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
