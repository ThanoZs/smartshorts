// components/ReelsContainer.jsx - Updated with better auto-play
import React, { useEffect } from "react";
import VideoItem from "./VideoItem";
import "./ReelsContainer.css";

const ReelsContainer = ({
  videos,
  currentVideoIndex,
  setCurrentVideoIndex,
  isLooping,
  videoRefs,
  containerRef,
  isTimerActive,
  setTimerPopup,
  setVideos,
}) => {
  const handleVideoEnd = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (isLooping && index === currentVideoIndex) {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      setCurrentVideoIndex(nextIndex);
      scrollToVideo(nextIndex);
    } else if (!isLooping && index === currentVideoIndex) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Replay error:", error);
        });
      }
    }
  };

  const handleRemoveVideo = (indexToRemove) => {
    if (videos[indexToRemove]?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(videos[indexToRemove].url);
    }

    const newVideos = videos.filter((_, index) => index !== indexToRemove);
    setVideos(newVideos);

    videoRefs.current = videoRefs.current.filter(
      (_, index) => index !== indexToRemove
    );

    if (indexToRemove === currentVideoIndex) {
      if (newVideos.length > 0) {
        const newIndex = Math.min(indexToRemove, newVideos.length - 1);
        setCurrentVideoIndex(newIndex);
        
        // Auto-play the new current video
        setTimeout(() => {
          if (videoRefs.current[newIndex]) {
            const playPromise = videoRefs.current[newIndex].play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.log("Autoplay after removal prevented:", error);
              });
            }
          }
        }, 100);
      } else {
        setCurrentVideoIndex(0);
      }
    } else if (indexToRemove < currentVideoIndex) {
      setCurrentVideoIndex((prev) => prev - 1);
    }
  };

  const scrollToVideo = (index) => {
    const wrapperElement = document.getElementById(`video-wrapper-${index}`);
    if (wrapperElement) {
      wrapperElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current || videos.length === 0) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    let currentIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < videos.length; i++) {
      const wrapperElement = document.getElementById(`video-wrapper-${i}`);
      if (wrapperElement) {
        const elementTop = wrapperElement.offsetTop;
        const elementHeight = wrapperElement.clientHeight;
        const elementCenter = elementTop + elementHeight / 2;
        const viewportCenter = scrollTop + containerHeight / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          currentIndex = i;
        }
      }
    }

    if (currentIndex !== currentVideoIndex) {
      setCurrentVideoIndex(currentIndex);
      
      // Auto-play the new current video
      setTimeout(() => {
        if (videoRefs.current[currentIndex] && videoRefs.current[currentIndex].paused) {
          const playPromise = videoRefs.current[currentIndex].play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Autoplay prevented:", error);
            });
          }
        }
      }, 50);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [videos, currentVideoIndex]);

  // Auto-play when videos are uploaded or when videos array changes
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[currentVideoIndex]) {
      // Wait a bit for video to load, then try to play
      const timer = setTimeout(() => {
        const videoElement = videoRefs.current[currentVideoIndex];
        if (videoElement && videoElement.paused) {
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Autoplay prevented:", error);
            });
          }
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [videos, currentVideoIndex]);

  return (
    <main 
      className="reels-container" 
      ref={containerRef}
      style={{ 
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <VideoItem
            key={video.id}
            video={video}
            index={index}
            videoRefs={videoRefs}
            isCurrent={index === currentVideoIndex}
            isLooping={isLooping}
            onVideoEnd={() => handleVideoEnd(index)}
            onRemove={handleRemoveVideo}
          />
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📱</div>
          <h3 className="empty-title">No Videos Yet</h3>
          <p className="empty-description">
            Upload your favorite shorts to get started
          </p>
        </div>
      )}
    </main>
  );
};

export default ReelsContainer;