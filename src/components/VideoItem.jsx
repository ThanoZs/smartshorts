// components/VideoItem.jsx - Updated with ALWAYS VISIBLE remove button
import React, { useState, useEffect, useRef } from "react";
import "./VideoItem.css";

const VideoItem = ({
  video,
  index,
  videoRefs,
  isCurrent,
  isLooping,
  onVideoEnd,
  onRemove,
  pauseAllOtherVideos,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const progressContainerRef = useRef(null);
  
  // Reset progress bar when video becomes current
  useEffect(() => {
    if (isCurrent) {
      const videoElement = videoRefs.current[index];
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
      }
    }
  }, [isCurrent, index, videoRefs]);

  // Auto-play when video becomes current
  useEffect(() => {
    const videoElement = videoRefs.current[index];
    if (!videoElement) return;

    if (isCurrent) {
      // Pause all other videos
      pauseAllOtherVideos(index);
      
      // Try to play current video
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
    } else {
      // Pause this video if it's not current
      if (!videoElement.paused) {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  }, [isCurrent, index, videoRefs, pauseAllOtherVideos]);

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
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    const videoElement = videoRefs.current[index];
    if (videoElement && isCurrent) {
      setCurrentTime(videoElement.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRefs.current[index];
    if (videoElement && videoElement.duration) {
      setDuration(videoElement.duration);
    }
  };

  // Manual seeking functionality
  const handleProgressMouseDown = (e) => {
    e.stopPropagation();
    setIsSeeking(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isSeeking && isCurrent) {
      handleProgressClick(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsSeeking(false);
  };

  const handleProgressClick = (e) => {
    if (!isCurrent) return;
    
    e.stopPropagation();
    const videoElement = videoRefs.current[index];
    if (!videoElement || !duration) return;

    const progressBar = progressContainerRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickPosition / rect.width;
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

  // Add event listeners for seeking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isSeeking) {
        handleProgressMouseMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isSeeking) {
        setIsSeeking(false);
      }
    };

    if (isSeeking) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isSeeking]);

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

        {/* Remove Button - ALWAYS VISIBLE on ALL videos */}
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

        {/* Play Overlay - Shows when video is paused */}
        {!isPlaying && (
          <div className="play-overlay">
            <div className="play-icon">▶️</div>
          </div>
        )}

        {/* Video Progress Bar - Only on mobile, only for current video */}
        {isCurrent && (
          <div 
            className="video-progress-container" 
            ref={progressContainerRef}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onTouchStart={handleProgressMouseDown}
          >
            <div 
              className="video-progress-bar" 
              style={{ 
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
              }}
            />
            <div className="progress-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Seek handle */}
            <div 
              className="seek-handle" 
              style={{ 
                left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoItem;