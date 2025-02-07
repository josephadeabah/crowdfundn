import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  overflowColors?: string[];
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = 'green',
  overflowColors = ['#FACC15', '#FF8800', '#DC2626'], // Yellow, Orange, Red
}) => {
  const baseProgress = Math.min(value, 100);
  let remainingValue = value > 100 ? value - 100 : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const baseOffset = circumference - (baseProgress / 100) * circumference;

  const overflowSegments: {
    color: string;
    offset: number;
    progress: number;
    tooltipId: string;
  }[] = [];
  let overflowIndex = 0;

  while (remainingValue > 0) {
    const overflowProgress = Math.min(remainingValue, 100);
    const overflowColor = overflowColors[overflowIndex] || '#000000';
    const overflowOffset =
      circumference - (overflowProgress / 100) * circumference;
    const tooltipId = `overflow-tooltip-${overflowIndex}`;

    overflowSegments.push({
      color: overflowColor,
      offset: overflowOffset,
      progress: overflowProgress,
      tooltipId,
    });
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

        {/* Overflow Progress Layers */}
        {overflowSegments.map((segment, index) => (
          <circle
            key={index}
            stroke={segment.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={segment.offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            data-tooltip-id={segment.tooltipId}
            data-tooltip-content={`Overflow ${index + 1}: ${segment.progress}%`}
          />
        ))}

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

      {/* Tooltips */}
      <Tooltip id="progress-tooltip" />
      {overflowSegments.map((segment) => (
        <Tooltip key={segment.tooltipId} id={segment.tooltipId} />
      ))}
    </div>
  );
};

export default ProgressRing;
