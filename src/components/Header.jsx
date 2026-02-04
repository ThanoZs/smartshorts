// components/Header.jsx
import React from "react";
import "./Header.css";

const Header = ({
  isLooping,
  setIsLooping,
  isTimerActive,
  timeLeft,
  setShowTimerModal,
}) => {
  const formatTime = (seconds) => {
    if (!seconds) return "";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <header className="app-header">
      <h1 className="app-title">SmartShorts</h1>
      <div className="header-controls">
        {isTimerActive && timeLeft !== null && (
          <div className="timer-display">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        )}
        <button
          className={`control-btn loop-btn ${isLooping ? "active" : ""}`}
          onClick={() => setIsLooping(!isLooping)}
          aria-label={isLooping ? "Disable loop" : "Enable loop"}
        >
          <span className="btn-icon">🔁</span>
          <span className="btn-text">{isLooping ? "On" : "Off"}</span>
        </button>
        <button
          className={`control-btn timer-btn ${isTimerActive ? "active" : ""}`}
          onClick={() => setShowTimerModal(true)}
          aria-label="Set sleep timer"
        >
          <span className="btn-icon">⏰</span>
          <span className="btn-text">Timer</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
