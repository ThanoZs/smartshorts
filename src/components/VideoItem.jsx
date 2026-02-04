// components/VideoItem.jsx - Updated
import React, { useState, useEffect } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto-play when video becomes current OR when component mounts with videos
  useEffect(() => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    // Always try to play when video is current
    if (isCurrent && videoElement.paused) {
      const playVideo = () => {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      };

      // Small delay to ensure video is ready
      setTimeout(playVideo, 100);
      setIsPlaying(true);
      setShowRemoveBtn(true);
    }
  }, [isCurrent, index, videoRefs]);

  const handleVideoTouch = () => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowRemoveBtn(true);
        })
        .catch(console.error);
    } else {
      videoElement.pause();
      setIsPlaying(false);
      setShowRemoveBtn(false);
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

  const handleTimeUpdate = () => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      if (videoElement.duration && !isNaN(videoElement.duration)) {
        setDuration(videoElement.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRefs.current[index];
    if (videoElement && videoElement.duration) {
      setDuration(videoElement.duration);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    const videoElement = videoRefs.current[index];
    if (!videoElement || !duration) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = Math.min(Math.max(clickPosition / progressBarWidth, 0), 1);
    const newTime = percentage * duration;

    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
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

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          muted={!isCurrent}
          loop={!isLooping}
        />

        {/* Remove Button - Shows when video is playing */}
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

        {/* Play Overlay - Shows when video is paused */}
        {!isPlaying && (
          <div className="play-overlay">
            <div className="play-icon">▶️</div>
          </div>
        )}

        {/* Video Progress Bar - Only on mobile */}
        <div className="video-progress-container" onClick={handleProgressClick}>
          <div 
            className="video-progress-bar" 
            style={{ 
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
            }}
          />
          <div className="progress-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;