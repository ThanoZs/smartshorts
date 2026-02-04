// components/UploadFooter.jsx
import React, { useState } from "react";
import "./UploadFooter.css";

const UploadFooter = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newVideos = [];

    files.forEach((file, index) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const videoData = {
          id: Date.now() + index,
          url: url,
          name: file.name,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: video.videoWidth / video.videoHeight,
        };
        newVideos.push(videoData);

        // When all videos are processed
        if (newVideos.length === files.length) {
          onUpload(newVideos);
        }
      };

      video.src = url;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("video/")
    );

    if (files.length > 0) {
      const event = { target: { files } };
      handleFileUpload(event);
    }
  };

  return (
    <footer className="upload-footer">
      <div
        className={`upload-container ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="upload-btn">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              <path d="M14 13h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H8c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z" />
            </svg>
          </div>

          <div className="upload-text">
            <span className="upload-title">Upload Shorts</span>
            <span className="upload-subtitle">
              Select videos from your device
            </span>
          </div>
        </label>

        {isDragging && <div className="drag-overlay">Drop videos here</div>}
      </div>
    </footer>
  );
};

export default UploadFooter;
