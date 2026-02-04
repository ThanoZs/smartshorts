// components/SleepTimerModal.jsx
import React, { useState } from "react";
import "./SleepTimerModal.css";

const SleepTimerModal = ({
  setShowTimerModal,
  isTimerActive,
  startSleepTimer,
  cancelSleepTimer,
  timerDuration,
  setTimerDuration,
}) => {
  const [hours, setHours] = useState(timerDuration.hours);
  const [minutes, setMinutes] = useState(timerDuration.minutes);

  const handleStartTimer = () => {
    if (hours === 0 && minutes === 0) return;
    startSleepTimer(hours, minutes);
    setTimerDuration({ hours, minutes });
    setShowTimerModal(false);
  };

  const handleCancelTimer = () => {
    cancelSleepTimer();
    setShowTimerModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Sleep Timer</h2>
          <button
            className="modal-close"
            onClick={() => setShowTimerModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="timer-inputs">
          <div className="input-group">
            <label className="input-label">Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={(e) =>
                setHours(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="timer-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) =>
                setMinutes(
                  Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
                )
              }
              className="timer-input"
            />
          </div>
        </div>

        <div className="timer-preview">
          {hours > 0 || minutes > 0 ? (
            <span className="preview-text">
              Timer set for: {hours > 0 ? `${hours}h ` : ""}
              {minutes > 0 ? `${minutes}m` : ""}
            </span>
          ) : (
            <span className="preview-warning">Please set a duration</span>
          )}
        </div>

        <div className="timer-actions">
          <button
            className="timer-action-btn primary-btn"
            onClick={handleStartTimer}
            disabled={hours === 0 && minutes === 0}
          >
            {isTimerActive ? "Update Timer" : "Start Timer"}
          </button>

          {isTimerActive && (
            <button
              className="timer-action-btn cancel-btn"
              onClick={handleCancelTimer}
            >
              Stop Timer
            </button>
          )}

          <button
            className="timer-action-btn secondary-btn"
            onClick={() => setShowTimerModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepTimerModal;
