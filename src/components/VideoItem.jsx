// components/VideoItem.jsx - Updated with remove button
import React, { useState } from "react";
import "./VideoItem.css";

const VideoItem = ({
  video,
  index,
  videoRefs,
  isCurrent,
  isLooping,
  onVideoEnd,
  onRemove,
}) => {
  const [isPlaying, setIsPlaying] = useState(isCurrent);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);

  const handleVideoTouch = () => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(console.error);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowRemoveBtn(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowRemoveBtn(false);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // Prevent triggering video play/pause
    onRemove(index);
  };

  const getVideoContainerStyle = () => {
    if (!video.aspectRatio) return {};

    const aspectRatio = video.aspectRatio;
    const isPortrait = aspectRatio < 1;

    if (isPortrait) {
      return {
        height: "100vh",
        width: `${100 * aspectRatio}vh`,
        maxWidth: "100vw",
      };
    } else {
      return {
        width: "100vw",
        height: `${100 / aspectRatio}vw`,
        maxHeight: "100vh",
      };
    }
  };

  const getVideoStyle = () => {
    if (!video.aspectRatio) return {};

    const aspectRatio = video.aspectRatio;
    const isPortrait = aspectRatio < 1;

    if (isPortrait) {
      return {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      };
    } else {
      return {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        backgroundColor: "#000",
      };
    }
  };

  return (
    <div
      id={`video-wrapper-${index}`}
      className="video-wrapper"
      style={getVideoContainerStyle()}
      onClick={handleVideoTouch}
    >
      <div className="video-container" style={getVideoContainerStyle()}>
        <video
          ref={(el) => (videoRefs.current[index] = el)}
          className="reel-video"
          style={getVideoStyle()}
          src={video.url}
          controls={false}
          playsInline
          onEnded={onVideoEnd}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          muted={!isCurrent}
          loop={!isLooping}
        />

        {/* Remove Button - Only shows when video is playing */}
        {showRemoveBtn && isPlaying && (
          <button
            className="remove-video-btn"
            onClick={handleRemoveClick}
            aria-label="Remove video"
          >
            <svg
              className="remove-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}

        {!isPlaying && (
          <div className="play-overlay">
            <div className="play-icon">▶️</div>
          </div>
        )}
      </div>

      <div className="video-info">
        <span className="video-name">{video.name}</span>
        <div className="video-indicators">
          <span className="status-indicator">{isPlaying ? "▶️" : "⏸️"}</span>
          {!isLooping && isCurrent && (
            <span className="loop-indicator">🔄</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
