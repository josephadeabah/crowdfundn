"use client";
import React, { useEffect, useState } from "react";

interface ClocklikeProgressRingProps {
  remainingDays: number;
  totalDays?: number; // total campaign days
  customColor?: string;
}

const ClocklikeProgressRing = ({
  remainingDays,
  totalDays = 30, // default campaign length
  customColor = "#2DD4BF", // teal
}: ClocklikeProgressRingProps) => {
  const [progress, setProgress] = useState(0);

  // SVG parameters
  const size = 60;
  const strokeWidth = 4;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // progress = % of days remaining
    const percentRemaining = (remainingDays / totalDays) * 100;
    setProgress(percentRemaining);
  }, [remainingDays, totalDays]);

  // Stroke offset for the progress ring
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative inline-flex items-center justify-center group"
        role="timer"
        aria-valuenow={progress}
        aria-label={`${progress.toFixed(0)}% time remaining`}
      >
        <svg
          className="transform transition-transform duration-300 ease-in-out group-hover:scale-105"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Inner circle filled with teal */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={customColor}
            opacity={0.15}
          />

          {/* Background track */}
          <circle
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            cx={center}
            cy={center}
            r={radius}
          />

          {/* Progress ring */}
          <circle
            stroke={customColor}
            strokeWidth={strokeWidth}
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
            transform={`rotate(-90 ${center} ${center})`}
          />

          {/* Percentage text */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            fontSize="12"
            fontWeight="bold"
            fill={customColor}
          >
            {progress.toFixed(0)}%
          </text>
        </svg>
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
        {Math.floor(remainingDays)} days left
      </span>
    </div>
  );
};

export default ClocklikeProgressRing;
