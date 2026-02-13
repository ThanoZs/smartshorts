// components/SplashScreen.jsx
import React, { useEffect, useState } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete splash screen after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo">
          <svg viewBox="0 0 200 200" className="logo-svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9c08ff" />
                <stop offset="50%" stopColor="#6b95ff" />
                <stop offset="100%" stopColor="#0088ff" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Play button triangle */}
            <path
              d="M 70 50 L 150 100 L 70 150 Z"
              fill="url(#logoGradient)"
              filter="url(#glow)"
              className="play-triangle"
            />
            
            {/* Circle around */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#logoGradient)"
              strokeWidth="4"
              className="logo-circle"
            />
          </svg>
        </div>
        
        <h1 className="splash-title">
          <span className="title-letter">S</span>
          <span className="title-letter">m</span>
          <span className="title-letter">a</span>
          <span className="title-letter">r</span>
          <span className="title-letter">t</span>
          <span className="title-letter">S</span>
          <span className="title-letter">h</span>
          <span className="title-letter">o</span>
          <span className="title-letter">r</span>
          <span className="title-letter">t</span>
          <span className="title-letter">s</span>
        </h1>
        
        <div className="splash-tagline">Your Personal Media Hub</div>
        
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
      
      {/* Particle effects */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;