// ============================================================
// UserCard.jsx — Displays a single GitHub user (avatar + name)
//
// Props:
//   user       - user object from GitHub API { login, avatar_url }
//   isActive   - boolean, true when this user's repos are being shown
//   onSelect   - function called when card is clicked
// ============================================================
import React from 'react';

function UserCard({ user, isActive, onSelect }) {
  return (
    <div
      className={`user-card ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(user)}
      title={`View ${user.login}'s repositories`}
    >
      {/* GitHub profile picture */}
      <img
        className="user-avatar"
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        loading="lazy"
      />
      {/* GitHub username */}
      <span className="user-name">@{user.login}</span>
    </div>
  );
}

export default UserCard;
