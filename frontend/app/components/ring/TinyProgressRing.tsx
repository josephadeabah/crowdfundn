"use client";
import React, { useEffect, useState } from "react";

interface ClocklikeProgressRingProps {
  remainingDays: number;
  customColor?: string;
}

const ClocklikeProgressRing = ({
  remainingDays,
  customColor = "#2DD4BF", // teal
}: ClocklikeProgressRingProps) => {
  const [progress, setProgress] = useState(0);

  // For very long campaigns, we'll use a logarithmic scale or cap the visual representation
  // This ensures the visual remains meaningful even with hundreds of days
  const getVisualDays = (days: number) => {
    if (days <= 30) return days; // For short campaigns, use actual days
    if (days <= 90) return days / 3; // For medium campaigns, compress 3:1
    return 30; // For long campaigns, cap at 30 visual days
  };

  const visualDays = getVisualDays(remainingDays);
  const totalVisualDays = 30; // Fixed visual scale

  // SVG parameters
  const size = 30;
  const center = size / 2;
  const radius = size / 2;

  useEffect(() => {
    // % of visual days remaining
    const percentRemaining = (visualDays / totalVisualDays) * 100;
    setProgress(percentRemaining);
  }, [visualDays]);

  // Convert progress % to angle in radians (inverse for countdown)
  const angle = ((100 - progress) / 100) * 2 * Math.PI;

  // End point of arc
  const x = center + radius * Math.sin(angle);
  const y = center - radius * Math.cos(angle);

  // Large arc flag (for angles > 180°)
  const largeArcFlag = angle > Math.PI ? 1 : 0;

  // Path for filled "pie slice" - starts from top (12 o'clock)
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
        aria-valuenow={remainingDays}
        aria-label={`${remainingDays} days remaining`}
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

          {/* Sweeping filled sector - shows elapsed time */}
          <path d={pathData} fill={customColor} opacity={0.7} />

          {/* Clock hand */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius + 3} // Slightly shorter than full radius
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeLinecap="round"
            transform={`rotate(${(100 - progress) * 3.6} ${center} ${center})`} // Convert % to degrees
          />

          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r={1.5}
            fill="#ffffff"
          />
        </svg>
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
        {Math.floor(remainingDays)} days left
      </span>
      
      {/* Optional: Show compressed scale indicator for long campaigns */}
      {remainingDays > 90 && (
        <span className="text-xs text-gray-500 ml-1">
          (compressed scale)
        </span>
      )}
    </div>
  );
};

export default ClocklikeProgressRing;