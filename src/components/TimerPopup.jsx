// components/TimerPopup.jsx
import React from "react";
import "./TimerPopup.css";

const TimerPopup = ({ setTimerPopup, setShowTimerModal }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-icon">⏰</div>
        <h3 className="popup-title">Timer Complete</h3>
        <p className="popup-message">Videos have been paused</p>

        <div className="popup-actions">
          <button
            className="popup-btn primary-btn"
            onClick={() => {
              setTimerPopup(false);
              setShowTimerModal(true);
            }}
          >
            Set New Timer
          </button>

          <button
            className="popup-btn secondary-btn"
            onClick={() => setTimerPopup(false)}
          >
            Continue Watching
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerPopup;
