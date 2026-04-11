import React from 'react';

function UserCard({ user, isActive, onSelect }) {
  return (
    <div
      className={`user-card ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(user)}
      title={`View ${user.login}'s repositories`}
    >
      <img
        className="user-avatar"
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        loading="lazy"
      />
      <span className="user-name">@{user.login}</span>
    </div>
  );
}

export default UserCard;
