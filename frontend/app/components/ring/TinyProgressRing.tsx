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

  // Fixed total days (30 days as default)
  const totalDays = 30;

  // Validate and normalize inputs
  const validTotalDays = Math.max(1, totalDays);
  const validRemainingDays = Math.min(
    Math.max(0, remainingDays),
    validTotalDays,
  );

  // Calculate percentage (inverse since we want to show time remaining)
  const percentage = (validRemainingDays / validTotalDays) * 100;

  // SVG parameters
  const size = 30;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  // Calculate rotation angle for clock-like movement (inverse for countdown)
  const rotation = (progress / 100) * 360;

  // Generate marks around the circumference (30 marks for 30 days)
  const generateMarks = () => {
    const marks = [];
    const markLength = 2;
    const markWidth = 1;
    
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * 360;
      const isPast = i >= (30 - validRemainingDays);
      
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
          stroke={isPast ? customColor : '#E5E7EB'}
          strokeWidth={markWidth}
          strokeLinecap="round"
          opacity={isPast ? 0.7 : 0.5}
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
        role="progressbar"
        aria-valuenow={validRemainingDays}
        aria-valuemin={0}
        aria-valuemax={validTotalDays}
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

          {/* Circumference marks */}
          {generateMarks()}

          {/* Progress trace (sweeping color behind the hand) */}
          <circle
            stroke={customColor}
            strokeWidth={strokeWidth}
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            opacity={0.3}
            className="transition-all duration-500 ease-in-out"
            transform={`rotate(-90 ${center} ${center})`}
          />

          {/* Clock hand */}
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
        {validRemainingDays} days left
      </span>
    </div>
  );
};

export default ClocklikeProgressRing;