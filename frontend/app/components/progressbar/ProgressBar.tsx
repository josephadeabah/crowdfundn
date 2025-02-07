import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  firstTooltipContent: string;
  overflowColors?: string[];
  className?: string;
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  firstTooltipContent,
  overflowColors = ['#FACC15', '#FF8800', '#DC2626'], // Yellow, Orange, Red
  className = 'h-2',
}) => {
  const baseProgress = Math.min(firstProgress, 100);
  let remainingValue = firstProgress > 100 ? firstProgress - 100 : 0;

  const overflowSegments: {
    color: string;
    progress: number;
    tooltipId: string;
  }[] = [];
  let overflowIndex = 0;

  while (remainingValue > 0) {
    const overflowProgress = Math.min(remainingValue, 100);
    const overflowColor = overflowColors[overflowIndex] || '#000000';
    const tooltipId = `overflow-tooltip-${overflowIndex}`;

    overflowSegments.push({
      color: overflowColor,
      progress: overflowProgress,
      tooltipId,
    });
    remainingValue -= overflowProgress;
    overflowIndex++;
  }

  const displayProgress = firstProgress > 100 ? 100 : firstProgress; // Cap displayed value at 100%

  return (
    <div className="w-full">
      {/* Progress label */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-green-600"
          data-tooltip-id="progress-tooltip"
          data-tooltip-content={firstTooltipContent}
        >
          {`${Math.round(displayProgress)}%`}
        </span>
      </div>

      {/* Combined Progress bar */}
      <div
        className={`relative ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}
      >
        {/* Base progress (Green) */}
        <div
          className="h-full bg-green-600"
          style={{ width: `${baseProgress}%` }}
          data-tooltip-id="progress-tooltip"
          data-tooltip-content={firstTooltipContent}
        ></div>

        {/* Overflow progress segments */}
        {overflowSegments.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 h-full opacity-80"
            style={{
              width: `${segment.progress}%`,
              backgroundColor: segment.color,
              left: `${baseProgress}%`,
            }}
            data-tooltip-id={segment.tooltipId}
            data-tooltip-content={`Overflow ${index + 1}: ${segment.progress}%`}
          ></div>
        ))}
      </div>

      {/* Tooltips */}
      <Tooltip id="progress-tooltip" />
      {overflowSegments.map((segment) => (
        <Tooltip key={segment.tooltipId} id={segment.tooltipId} />
      ))}
    </div>
  );
};

export default Progress;