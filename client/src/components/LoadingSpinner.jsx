import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
        <p className="loading-subtext">Server is starting up, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
