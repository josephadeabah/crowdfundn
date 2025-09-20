"use client";
import React from "react";

interface ClocklikeProgressRingProps {
  remainingDays: number;
  maxDays?: number;   // reference max to map remainingDays
  customColor?: string;
}

const ClocklikeProgressRing = ({
  remainingDays,
  maxDays = 100,       // fallback scaling if no total days
  customColor = "#2DD4BF", // teal
}: ClocklikeProgressRingProps) => {
  const size = 60;
  const center = size / 2;
  const radius = size / 2;

  // Clamp remainingDays to maxDays
  const safeDays = Math.min(remainingDays, maxDays);

  // Convert to sweep angle
  const angle = (safeDays / maxDays) * 2 * Math.PI;

  // Arc endpoint
  const x = center + radius * Math.sin(angle);
  const y = center - radius * Math.cos(angle);

  const largeArcFlag = angle > Math.PI ? 1 : 0;

  // Path for filled sector
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
        aria-label={`${remainingDays} days remaining`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform transition-transform duration-300 ease-in-out group-hover:scale-105"
        >
          {/* Background circle */}
          <circle cx={center} cy={center} r={radius} fill="#E5E7EB" />

          {/* Sweep fill */}
          <path d={pathData} fill={customColor} />
        </svg>
      </div>

      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
        {remainingDays} days left
      </span>
    </div>
  );
};

export default ClocklikeProgressRing;
