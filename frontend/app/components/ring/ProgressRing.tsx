import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressRingProps {
  value: number; // Total progress, including overflow
  size?: number; // Diameter of the ring
  strokeWidth?: number; // Thickness of the ring
  color?: string; // Base progress color
  overflowColors?: string[]; // Array of overflow colors
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = 'green',
  overflowColors = ['#FACC15', '#FF8800', '#DC2626'], // Yellow, Orange, Red
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let remainingValue: number = value;
  const progressSegments: { color: string; progress: number }[] = [];

  // Base progress (Max 100%)
  const baseProgress: number = Math.min(remainingValue, 100);
  progressSegments.push({ color, progress: baseProgress });
  remainingValue -= baseProgress;

  // Overflow layers
  let overflowIndex = 0;
  while (remainingValue > 0) {
    const overflowProgress: number = Math.min(remainingValue, 100);
    const overflowColor: string = overflowColors[overflowIndex] || '#000000'; // Default to black if no more colors
    progressSegments.push({ color: overflowColor, progress: overflowProgress });
    remainingValue -= overflowProgress;
    overflowIndex++;
  }

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

        {/* Render Progress Segments */}
        {progressSegments.reduce<JSX.Element[]>((prevOffset, segment, index) => {
          const offset: number = circumference - (segment.progress / 100) * circumference;

          return [
            ...prevOffset,
            <circle
              key={index}
              stroke={segment.color}
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              data-tooltip-id={`progress-tooltip-${index}`}
              data-tooltip-content={
                index === 0 ? `${segment.progress}%` : `Overflow ${index}: ${segment.progress}%`
              }
            />,
            <Tooltip key={`tooltip-${index}`} id={`progress-tooltip-${index}`} />,
          ];
        }, [])}

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
          {Math.min(value, 100)}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressRing;
