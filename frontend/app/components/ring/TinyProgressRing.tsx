"use client";
import React, { useEffect, useState } from 'react';

interface ClocklikeProgressRingProps {
  remainingDays: number;
  customColor?: string;
}

const ClocklikeProgressRing = ({
  remainingDays,
  customColor = '#2DD4BF',
}: ClocklikeProgressRingProps) => {
  const [progress, setProgress] = useState(0);
  const [previousRemainingDays, setPreviousRemainingDays] = useState(remainingDays);

  // SVG parameters
  const size = 30;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = center - strokeWidth;

  useEffect(() => {
    // Calculate progress based on day change (not total days)
    // This creates a smooth visual transition as days pass
    const targetProgress = 100 - ((remainingDays % 1) * 100);
    
    const timer = setTimeout(() => {
      setProgress(targetProgress);
      setPreviousRemainingDays(remainingDays);
    }, 100);

    return () => clearTimeout(timer);
  }, [remainingDays]);

  // Calculate rotation angle for clock-like movement
  // The hand makes a full rotation each day
  const rotation = (progress / 100) * 360;

  // Generate marks that show the progression of a single day
  const generateHourMarks = () => {
    const marks = [];
    const markLength = 1.5;
    const markWidth = 0.8;
    
    // Create 12 marks (like hours on a clock)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 360;
      
      // Calculate mark position
      const startAngle = angle - 90; // Start from top (12 o'clock)
      const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const endX = center + (radius - markLength) * Math.cos((startAngle * Math.PI) / 180);
      const endY = center + (radius - markLength) * Math.sin((startAngle * Math.PI) / 180);

      marks.push(
        <line
          key={i}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#E5E7EB"
          strokeWidth={markWidth}
          strokeLinecap="round"
          opacity={0.5}
        />
      );
    }
    
    return marks;
  };

  // Generate progress marks for the current day
  const generateProgressMarks = () => {
    const marks = [];
    const markLength = 2;
    const markWidth = 1;
    
    // Show progress through current day (simulated)
    const progressMarks = Math.floor(progress / 8.33); // 12 marks for 100%
    
    for (let i = 0; i < progressMarks; i++) {
      const angle = (i / 12) * 360;
      
      // Calculate mark position
      const startAngle = angle - 90;
      const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const endX = center + (radius - markLength) * Math.cos((startAngle * Math.PI) / 180);
      const endY = center + (radius - markLength) * Math.sin((startAngle * Math.PI) / 180);

      marks.push(
        <line
          key={`progress-${i}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={customColor}
          strokeWidth={markWidth}
          strokeLinecap="round"
          opacity={0.7}
          className="transition-all duration-300"
        />
      );
    }
    
    return marks;
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative inline-flex items-center justify-center group"
        role="timer"
        aria-valuenow={remainingDays}
        aria-label={`${remainingDays} days remaining`}
      >
        <svg
          className="transform transition-transform duration-300 ease-in-out group-hover:scale-110"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            cx={center}
            cy={center}
            r={radius}
          />

          {/* Hour marks (static) */}
          {generateHourMarks()}

          {/* Progress marks (dynamic) */}
          {generateProgressMarks()}

          {/* Clock hand - shows progression through current day */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={strokeWidth + 2}
            stroke={customColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${center} ${center})`}
            className="transition-all duration-500 ease-in-out"
          />

          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r={1.5}
            fill={customColor}
            className="transition-all duration-300"
          />
        </svg>
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
        {Math.floor(remainingDays)} days left
      </span>
    </div>
  );
};

export default ClocklikeProgressRing;