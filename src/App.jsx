// App.jsx - Updated to pass setVideos to ReelsContainer
import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import ReelsContainer from "./components/ReelsContainer";
import UploadFooter from "./components/UploadFooter";
import SleepTimerModal from "./components/SleepTimerModal";
import TimerPopup from "./components/TimerPopup";
import "./App.css";

const SmartShorts = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerPopup, setTimerPopup] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerDuration, setTimerDuration] = useState({ hours: 0, minutes: 30 });
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Handle video upload
  const handleVideoUpload = (newVideos) => {
    setVideos((prev) => [...prev, ...newVideos]);
  };

  // Start sleep timer
  const startSleepTimer = (hours, minutes) => {
    // Clear any existing timer
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    const totalSeconds = hours * 3600 + minutes * 60;
    setTimeLeft(totalSeconds);
    setIsTimerActive(true);
    setTimerDuration({ hours, minutes });

    // Start countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set timeout for timer completion
    sleepTimerRef.current = setTimeout(() => {
      setTimerPopup(true);
      // Pause all videos
      videoRefs.current.forEach((video) => {
        if (video && typeof video.pause === "function") {
          video.pause();
        }
      });
      setIsTimerActive(false);
      setTimeLeft(null);

      // Auto-hide popup after 5 seconds
      setTimeout(() => setTimerPopup(false), 5000);
    }, totalSeconds * 1000);
  };

  // Cancel sleep timer
  const cancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsTimerActive(false);
    setTimeLeft(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);

      // Cleanup object URLs
      videos.forEach((video) => {
        if (video.url && video.url.startsWith("blob:")) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  }, [videos]);

  return (
    <div className="smartshorts-app">
      <Header
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        isTimerActive={isTimerActive}
        timeLeft={timeLeft}
        setShowTimerModal={setShowTimerModal}
      />

      <ReelsContainer
        videos={videos}
        setVideos={setVideos} // Pass setVideos for removal
        currentVideoIndex={currentVideoIndex}
        setCurrentVideoIndex={setCurrentVideoIndex}
        isLooping={isLooping}
        videoRefs={videoRefs}
        containerRef={containerRef}
        isTimerActive={isTimerActive}
        setTimerPopup={setTimerPopup}
      />

      <UploadFooter onUpload={handleVideoUpload} />

      {showTimerModal && (
        <SleepTimerModal
          setShowTimerModal={setShowTimerModal}
          isTimerActive={isTimerActive}
          startSleepTimer={startSleepTimer}
          cancelSleepTimer={cancelSleepTimer}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
        />
      )}

      {timerPopup && (
        <TimerPopup
          setTimerPopup={setTimerPopup}
          setShowTimerModal={setShowTimerModal}
        />
      )}
    </div>
  );
};

export default SmartShorts;
