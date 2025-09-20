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
  const size = 30;
  const center = size / 2;
  const radius = size / 2;

  useEffect(() => {
    // % of days remaining
    const percentRemaining = (remainingDays / totalDays) * 100;
    setProgress(percentRemaining);
  }, [remainingDays, totalDays]);

  // Convert progress % to angle in radians
  const angle = (progress / 100) * 2 * Math.PI;

  // End point of arc
  const x = center + radius * Math.sin(angle);
  const y = center - radius * Math.cos(angle);

  // Large arc flag (for angles > 180°)
  const largeArcFlag = angle > Math.PI ? 1 : 0;

  // Path for filled "pie slice"
  const pathData = `
    M ${center} ${center}
    L ${center} 0
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}
    Z
  `;

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative inline-flex items-center justify-center group"
        role="timer"
        aria-valuenow={progress}
        aria-label={`${progress.toFixed(0)}% time remaining`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform transition-transform duration-300 ease-in-out group-hover:scale-105"
        >
          {/* Background circle (light gray) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="#E5E7EB"
          />

          {/* Sweeping filled sector */}
          <path d={pathData} fill={customColor} />
        </svg>
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
        {Math.floor(remainingDays)} days left
      </span>
    </div>
  );
};

export default ClocklikeProgressRing;
