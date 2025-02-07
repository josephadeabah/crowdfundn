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
  const baseProgress = Math.min(firstProgress, 100);
  const overflowProgress = firstProgress > 100 ? firstProgress - 100 : 0;
  const displayProgress = firstProgress > 100 ? 100 : firstProgress; // Cap displayed value at 100%

  return (
    <div className="w-full">
      {/* Progress label */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-green-600"
          data-tooltip-id="performance-tooltip"
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
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        ></div>

        {/* Overflow progress (Yellow) */}
        {overflowProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 opacity-80"
            style={{ width: `${overflowProgress}%` }}
            data-tooltip-id="overflow-tooltip"
            data-tooltip-content={`Overflow: ${overflowProgress}%`}
          ></div>
        )}
      </div>

      <Tooltip id="performance-tooltip" />
      <Tooltip id="overflow-tooltip" />
    </div>
  );
};

export default Progress;
