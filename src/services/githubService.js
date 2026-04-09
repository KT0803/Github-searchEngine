// ============================================================
// githubService.js — All GitHub API calls are here
//
// We keep API logic separate from components so that if
// the API URL changes, we only need to update this one file.
// ============================================================

const BASE_URL = 'https://api.github.com';

/**
 * Search GitHub users by a query string.
 * @param {string} query - The search term (e.g. "gaearon")
 * @returns {Array} - Array of user objects from GitHub API
 */
export async function fetchUsers(query) {
  const response = await fetch(
    `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=20`
  );

  // If the response is not OK (e.g. 403 rate limit), throw an error
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a minute and try again.');
    }
    throw new Error(`Failed to search users. Status: ${response.status}`);
  }

  const data = await response.json();
  // The search API returns { total_count, items: [...] }
  return data.items || [];
}

/**
 * Fetch all public repositories for a given GitHub username.
 * @param {string} username - GitHub username (e.g. "gaearon")
 * @returns {Array} - Array of repository objects from GitHub API
 */
export async function fetchRepos(username) {
  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`User "${username}" not found.`);
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a minute and try again.');
    }
    throw new Error(`Failed to fetch repositories. Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
