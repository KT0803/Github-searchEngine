# 🐙 GitHub Explorer

A clean, modern React web app to search GitHub users and explore their public repositories.

---

## ✨ Features

- 🔍 **Search GitHub users** with debounced input (400ms delay, no unnecessary API calls)
- 👤 **Click a user** to view all their public repositories
- ⭐ **Sort repos** by Stars or Forks
- 🌐 **Filter repos** by programming language
- 📄 **Pagination** — 9 repos per page
- 🔖 **Bookmark repos** saved to localStorage (persists on refresh)
- 🌙 **Dark / Light mode** toggle (preference saved to localStorage)
- 📱 **Fully responsive** — works on mobile and desktop

---

## 🛠 Tech Stack

| What | How |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Plain CSS with CSS Variables |
| State | `useState` + `useEffect` only |
| Persistence | Browser `localStorage` |
| API | GitHub REST API (unauthenticated) |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── UserCard.jsx
│   ├── RepoCard.jsx
│   ├── FilterBar.jsx
│   └── Loader.jsx
│
├── pages/
│   └── Home.jsx
│
├── services/
│   └── githubService.js
│
├── utils/
│   └── helpers.js
│
├── App.jsx
├── App.css
└── main.jsx
```

---

## 🚀 Setup & Run

```bash
npm install
npm run dev
```

---

## 📖 How It Works (Key Concepts)

### Debounce with `useEffect`
Instead of calling the API on every keystroke, we use `setTimeout` inside `useEffect`:
```js
useEffect(() => {
  const timer = setTimeout(() => {
  }, 400);
  return () => clearTimeout(timer);
}, [query]);
```

### localStorage (no custom hook)
Reading and writing is done directly in components:
```js
const bookmarks = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');
localStorage.setItem('gh_bookmarks', JSON.stringify(updated));
```

---

## ⚠️ GitHub API Rate Limits

- Unauthenticated requests: **60 per hour**
- If you hit the limit, wait ~1 minute and try again
