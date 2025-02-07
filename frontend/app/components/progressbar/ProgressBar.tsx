import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  firstTooltipContent: string;
  className?: string;
  overflowColors?: string[];
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  firstTooltipContent,
  className = 'h-2',
  overflowColors = ['#FACC15', '#FF8800', '#DC2626'], // Yellow, Orange, Red
}) => {
  let remainingValue = firstProgress;
  const progressSegments: {
    color: string;
    progress: number;
    tooltipId: string;
  }[] = [];

  // Base progress (Max 100%)
  const baseProgress = Math.min(remainingValue, 100);
  progressSegments.push({
    color: 'green',
    progress: baseProgress,
    tooltipId: 'base-progress-tooltip',
  });
  remainingValue -= baseProgress;

  // Overflow layers
  let overflowIndex = 0;
  while (remainingValue > 0) {
    const overflowProgress = Math.min(remainingValue, 100);
    const overflowColor = overflowColors[overflowIndex] || '#000000';
    const tooltipId = `overflow-tooltip-${overflowIndex}`;
    progressSegments.push({
      color: overflowColor,
      progress: overflowProgress,
      tooltipId,
    });
    remainingValue -= overflowProgress;
    overflowIndex++;
  }

  return (
    <div className="w-full">
      {/* Progress label */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-green-600"
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        >
          {`${Math.min(firstProgress, 100)}%`}
        </span>
      </div>

      {/* Combined Progress bar */}
      <div
        className={`relative ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}
      >
        {progressSegments.map((segment, index) => {
          const prevWidth = progressSegments
            .slice(0, index)
            .reduce((sum, seg) => sum + seg.progress, 0);

          return (
            <div
              key={index}
              className="absolute top-0 left-0 h-full opacity-80"
              style={{
                width: `${segment.progress}%`,
                backgroundColor: segment.color,
                left: `${prevWidth}%`,
              }}
              data-tooltip-id={segment.tooltipId}
              data-tooltip-content={
                index === 0
                  ? `${segment.progress}%`
                  : `Overflow ${index}: ${segment.progress}%`
              }
            />
          );
        })}
      </div>

      {/* Tooltips */}
      <Tooltip id="performance-tooltip" />
      {progressSegments.map((segment) => (
        <Tooltip key={segment.tooltipId} id={segment.tooltipId} />
      ))}
    </div>
  );
};

export default Progress;
