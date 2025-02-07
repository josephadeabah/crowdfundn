import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressRingProps {
  value: number; // Percentage value (0 to 100, handle overflow)
  size?: number; // Diameter of the ring
  strokeWidth?: number; // Thickness of the ring
  color?: string; // Primary progress color
  overflowColor?: string; // Overflow progress color
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = 'green',
  overflowColor = 'orange',
}) => {
  const baseProgress = Math.min(value, 100);
  const overflowProgress = value > 100 ? value - 100 : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const baseOffset = circumference - (baseProgress / 100) * circumference;
  const overflowOffset =
    circumference - (overflowProgress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="mx-auto">
        {/* Background Circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Base Progress (Green) */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={baseOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          data-tooltip-id="progress-tooltip"
          data-tooltip-content={`${baseProgress}%`}
        />

        {/* Overflow Progress (Yellow) */}
        {overflowProgress > 0 && (
          <circle
            stroke={overflowColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={overflowOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            data-tooltip-id="overflow-tooltip"
            data-tooltip-content={`Overflow: ${overflowProgress}%`}
          />
        )}

        {/* Center Text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size / 5}
          fill={color}
          fontWeight="bold"
        >
          {value}%
        </text>
      </svg>

      {/* Tooltip instances */}
      <Tooltip id="progress-tooltip" />
      <Tooltip id="overflow-tooltip" />
    </div>
  );
};

export default ProgressRing;
