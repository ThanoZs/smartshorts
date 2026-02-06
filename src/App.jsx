// App.jsx - Updated with splash screen
import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import ReelsContainer from "./components/ReelsContainer";
import UploadFooter from "./components/UploadFooter";
import SleepTimerModal from "./components/SleepTimerModal";
import TimerPopup from "./components/TimerPopup";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

const SmartShorts = () => {
  const [showSplash, setShowSplash] = useState(true);
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

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Handle video upload - AUTO-PLAY FIRST VIDEO
  const handleVideoUpload = (newVideos) => {
    const updatedVideos = [...videos, ...newVideos];
    setVideos(updatedVideos);
    
    if (videos.length === 0 && newVideos.length > 0) {
      setCurrentVideoIndex(0);
    }
  };

  // Auto-play when current video index changes
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[currentVideoIndex]) {
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
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex, videos]);

  // Start sleep timer
  const startSleepTimer = (hours, minutes) => {
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

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    sleepTimerRef.current = setTimeout(() => {
      setTimerPopup(true);
      videoRefs.current.forEach((video) => {
        if (video && typeof video.pause === "function") {
          video.pause();
        }
      });
      setIsTimerActive(false);
      setTimeLeft(null);

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

  // Cleanup
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      videos.forEach((video) => {
        if (video.url && video.url.startsWith("blob:")) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  }, [videos]);

  // Reset videoRefs when videos array changes
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

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
        setVideos={setVideos}
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