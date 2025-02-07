import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  secondProgress?: number;
  thirdProgress?: number;
  firstTooltipContent: string;
  secondTooltipContent?: string;
  thirdTooltipContent?: string;
  className?: string;
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  secondProgress = 0,
  thirdProgress = 0,
  firstTooltipContent,
  secondTooltipContent,
  thirdTooltipContent,
  className = 'h-2',
}) => {
  const baseFirstProgress = Math.min(firstProgress, 100);
  const overflowFirstProgress = firstProgress > 100 ? firstProgress - 100 : 0;

  const baseSecondProgress = Math.min(secondProgress, 100);
  const overflowSecondProgress = secondProgress > 100 ? secondProgress - 100 : 0;

  const baseThirdProgress = Math.min(thirdProgress, 100);
  const overflowThirdProgress = thirdProgress > 100 ? thirdProgress - 100 : 0;

  return (
    <div className="w-full">
      {/* Progress labels */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-green-600"
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
          {secondProgress && `${Math.round(secondProgress)}%`}
        </span>
        <span
          className="text-green-400"
          data-tooltip-id="employee-tooltip"
          data-tooltip-content={thirdTooltipContent}
        >
          {thirdProgress && `${Math.round(thirdProgress)}%`}
        </span>
      </div>

      {/* Combined Progress bar */}
      <div className={`relative ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}>
        {/* First progress */}
        <div
          className="h-full bg-green-600"
          style={{ width: `${baseFirstProgress}%` }}
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        ></div>
        {overflowFirstProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-yellow-500 opacity-80"
            style={{ width: `${overflowFirstProgress}%` }}
            data-tooltip-id="overflow-first-tooltip"
            data-tooltip-content={`Overflow: ${Math.round(overflowFirstProgress)}%`}
          ></div>
        )}

        {/* Second progress */}
        <div
          className="h-full bg-yellow-100"
          style={{ width: `${baseSecondProgress}%` }}
          data-tooltip-id="manager-tooltip"
          data-tooltip-content={secondTooltipContent}
        ></div>
        {overflowSecondProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-red-500 opacity-80"
            style={{ width: `${overflowSecondProgress}%` }}
            data-tooltip-id="overflow-second-tooltip"
            data-tooltip-content={`Overflow: ${Math.round(overflowSecondProgress)}%`}
          ></div>
        )}

        {/* Third progress */}
        <div
          className="h-full bg-green-400"
          style={{ width: `${baseThirdProgress}%` }}
          data-tooltip-id="employee-tooltip"
          data-tooltip-content={thirdTooltipContent}
        ></div>
        {overflowThirdProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 opacity-80"
            style={{ width: `${overflowThirdProgress}%` }}
            data-tooltip-id="overflow-third-tooltip"
            data-tooltip-content={`Overflow: ${Math.round(overflowThirdProgress)}%`}
          ></div>
        )}
      </div>

      {/* Tooltip instances */}
      <Tooltip id="performance-tooltip" />
      <Tooltip id="overflow-first-tooltip" />
      <Tooltip id="manager-tooltip" />
      <Tooltip id="overflow-second-tooltip" />
      <Tooltip id="employee-tooltip" />
      <Tooltip id="overflow-third-tooltip" />
    </div>
  );
};

export default Progress;