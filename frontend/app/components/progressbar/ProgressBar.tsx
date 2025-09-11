import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  firstTooltipContent: string;
  className?: string;
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  firstTooltipContent,
  className = 'h-2',
}) => {
  const colors = ['#16A34A', '#FACC15', '#FF8800', '#DC2626']; // Green, Yellow, Orange, Red
  const baseProgress = Math.min(firstProgress, 100);
  let remainingValue = firstProgress > 100 ? firstProgress - 100 : 0;

  const overflowSegments: {
    color: string;
    progress: number;
    tooltipId: string;
  }[] = [];
  let overflowIndex = 1;

  while (remainingValue > 0) {
    const overflowProgress = Math.min(remainingValue, 100);
    const overflowColor = colors[overflowIndex] || '#000000';
    const tooltipId = `overflow-tooltip-${overflowIndex}`;

    overflowSegments.push({
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
          {`${Math.round(firstProgress)}%`}
        </span>
      </div>

      {/* Progress bar container */}
      <div
        className={`relative ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}
      >
        {/* Base progress (Green) */}
        <div
          className="h-full bg-green-600"
          style={{ width: `${baseProgress}%` }}
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={`${baseProgress as unknown as string}%`}
        ></div>

        {/* Overflow progress sections */}
        {overflowSegments.map((segment, index) => (
          <div
            key={index}
            className="absolute top-0 h-full opacity-80"
            style={{
              width: `${segment.progress}%`,
              backgroundColor: segment.color,
              left: `${100 * index}%`, // Stack segments side by side
            }}
            data-tooltip-id={segment.tooltipId}
            data-tooltip-content={`Overflow ${index}: ${segment.progress}%`}
          ></div>
        ))}
      </div>

      {/* Tooltips */}
      <Tooltip id="performance-tooltip" />
      {overflowSegments.map((segment) => (
        <Tooltip key={segment.tooltipId} id={segment.tooltipId} />
      ))}
    </div>
  );
};

export default Progress;
