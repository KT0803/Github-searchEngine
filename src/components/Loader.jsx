import React from 'react';

function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loader;
