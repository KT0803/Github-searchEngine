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
│   ├── SearchBar.jsx   # Search input with clear button
│   ├── UserCard.jsx    # Avatar + username card
│   ├── RepoCard.jsx    # Repo details + bookmark button
│   ├── FilterBar.jsx   # Sort + language filter dropdowns
│   └── Loader.jsx      # Animated spinner
│
├── pages/
│   └── Home.jsx        # Main page — all app state lives here
│
├── services/
│   └── githubService.js  # GitHub API fetch functions
│
├── utils/
│   └── helpers.js        # formatNumber, getLanguageColor
│
├── App.jsx             # Dark mode logic, header, footer
├── App.css             # Design system (CSS variables, all styles)
└── main.jsx            # React entry point
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# Visit: http://localhost:5173
```

---

## 📖 How It Works (Key Concepts)

### Debounce with `useEffect`
Instead of calling the API on every keystroke, we use `setTimeout` inside `useEffect`:
```js
useEffect(() => {
  const timer = setTimeout(() => {
    // call API here
  }, 400);
  return () => clearTimeout(timer); // cancel if user types again
}, [query]);
```

### localStorage (no custom hook)
Reading and writing is done directly in components:
```js
// Read
const bookmarks = JSON.parse(localStorage.getItem('gh_bookmarks') || '[]');

// Write
localStorage.setItem('gh_bookmarks', JSON.stringify(updated));
```

---

## ⚠️ GitHub API Rate Limits

- Unauthenticated requests: **60 per hour**
- If you hit the limit, wait ~1 minute and try again

---

## 📄 License

MIT — free to use and modify.