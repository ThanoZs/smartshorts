// components/ReelsContainer.jsx - Updated with scrollbar removal
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
      // Loop is ON: go to next video
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      setCurrentVideoIndex(nextIndex);
      scrollToVideo(nextIndex);
    } else if (!isLooping && index === currentVideoIndex) {
      // Loop is OFF: restart the same video
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
    // Clean up the video URL to prevent memory leaks
    if (videos[indexToRemove]?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(videos[indexToRemove].url);
    }

    // Remove the video from the array
    const newVideos = videos.filter((_, index) => index !== indexToRemove);
    setVideos(newVideos);

    // Update videoRefs to maintain correct references
    videoRefs.current = videoRefs.current.filter(
      (_, index) => index !== indexToRemove
    );

    // If we removed the current video
    if (indexToRemove === currentVideoIndex) {
      if (newVideos.length > 0) {
        // If there are still videos, go to the next one or previous if at end
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
        // No videos left
        setCurrentVideoIndex(0);
      }
    } else if (indexToRemove < currentVideoIndex) {
      // Adjust current index if a video before current was removed
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

    // Calculate which video is most visible
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
      // Don't pause any videos - let them continue playing
      // Only update current video index
      setCurrentVideoIndex(currentIndex);
      
      // Auto-play the new current video if it's not playing
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

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [videos, currentVideoIndex]);

  // Auto-play first video on load
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      setTimeout(() => {
        const playPromise = videoRefs.current[0].play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Initial autoplay prevented:", error);
          });
        }
      }, 300);
    }
  }, [videos]);

  return (
    <main 
      className="reels-container" 
      ref={containerRef}
      style={{ 
        overflowY: 'auto',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
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