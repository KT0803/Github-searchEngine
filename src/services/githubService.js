const BASE_URL = 'https://api.github.com';


export async function fetchUsers(query) {
  const response = await fetch(
  `${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=20`
);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a minute and try again.');
    }
    throw new Error(`Failed to search users. Status: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

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
