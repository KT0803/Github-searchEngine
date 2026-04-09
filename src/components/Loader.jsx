// ============================================================
// Loader.jsx — Shown while an API request is in progress
// ============================================================
import React from 'react';

function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      {/* CSS-animated spinning circle defined in App.css */}
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;
