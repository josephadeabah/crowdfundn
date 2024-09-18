import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  secondProgress?: number;
  thirdProgress?: number;
  firstTooltipContent: string;
  secondTooltipContent?: string;
  thirdTooltipContent?: string;
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  secondProgress,
  thirdProgress,
  firstTooltipContent,
  secondTooltipContent,
  thirdTooltipContent,
}) => {
  return (
    <div className="w-full">
      {/* Progress labels */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-red-500"
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        >
          {`${Math.round(firstProgress)}%`}
        </span>
        <span
          className="text-yellow-500"
          data-tooltip-id="manager-tooltip"
          data-tooltip-content={secondTooltipContent}
        >
          {secondProgress && `${Math.round(Number(secondProgress))}%`}
        </span>
        <span
          className="text-green-500"
          data-tooltip-id="employee-tooltip"
          data-tooltip-content={thirdTooltipContent}
        >
          {thirdProgress && `${Math.round(Number(thirdProgress))}%`}
        </span>
      </div>

      {/* Combined Progress bar */}
      <div className="flex h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-red-600"
          style={{ width: `${firstProgress}%` }}
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        ></div>
        <div
          className="h-full bg-yellow-100"
          style={{ width: `${secondProgress}%` }}
          data-tooltip-id="manager-tooltip"
          data-tooltip-content={secondTooltipContent}
        ></div>
        <div
          className="h-full bg-green-400"
          style={{ width: `${thirdProgress}%` }}
          data-tooltip-id="employee-tooltip"
          data-tooltip-content={thirdTooltipContent}
        ></div>
      </div>

      {/* Tooltip instances */}
      <Tooltip id="performance-tooltip" />
      <Tooltip id="manager-tooltip" />
      <Tooltip id="employee-tooltip" />
    </div>
  );
};

export default Progress;
