// components/ReelsContainer.jsx - Updated
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
  // Function to pause all other videos except the current one
  const pauseAllOtherVideos = (currentIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex && !video.paused) {
        video.pause();
      }
    });
  };

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
  setVideos((prevVideos) => {
    if (indexToRemove < 0 || indexToRemove >= prevVideos.length) {
      return prevVideos; // safety guard
    }

    const videoToRemove = prevVideos[indexToRemove];

    // Revoke blob URL safely
    if (videoToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(videoToRemove.url);
    }

    const newVideos = prevVideos.filter(
      (_, index) => index !== indexToRemove
    );

    // Update refs safely
    videoRefs.current = videoRefs.current.filter(
      (_, index) => index !== indexToRemove
    );

    // Handle current index logic
    if (indexToRemove === currentVideoIndex) {
      if (newVideos.length > 0) {
        const newIndex = Math.min(
          indexToRemove,
          newVideos.length - 1
        );

        setCurrentVideoIndex(newIndex);

        // Autoplay new current video
        setTimeout(() => {
          const video = videoRefs.current[newIndex];
          if (video) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) =>
                console.log("Autoplay prevented:", err)
              );
            }
          }
        }, 100);
      } else {
        setCurrentVideoIndex(0);
      }
    } 
    else if (indexToRemove < currentVideoIndex) {
      setCurrentVideoIndex((prev) => Math.max(prev - 1, 0));
    }

    return newVideos;
  });
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
      // Pause current video before switching
      if (videoRefs.current[currentVideoIndex]) {
        videoRefs.current[currentVideoIndex].pause();
      }
      
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
      // Pause all other videos first
      pauseAllOtherVideos(currentVideoIndex);
      
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
            pauseAllOtherVideos={pauseAllOtherVideos}
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