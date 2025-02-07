import React, { useEffect, useState } from 'react';
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
  secondProgress,
  thirdProgress,
  firstTooltipContent,
  secondTooltipContent,
  thirdTooltipContent,
  className = 'h-2',
}) => {
  const [cycleProgress, setCycleProgress] = useState(0);

  useEffect(() => {
    if (firstProgress >= 100) {
      setCycleProgress(1); // Start new progress cycle
    } else if (firstProgress > 0) {
      setCycleProgress(firstProgress); // Keep cycle in sync
    }
  }, [firstProgress]);

  return (
    <div className="w-full relative">
      {/* Progress labels */}
      <div className="text-base flex items-center justify-between font-bold">
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
          {secondProgress && `${Math.round(Number(secondProgress))}%`}
        </span>
        <span
          className="text-green-600"
          data-tooltip-id="employee-tooltip"
          data-tooltip-content={thirdTooltipContent}
        >
          {thirdProgress && `${Math.round(Number(thirdProgress))}%`}
        </span>
      </div>

      {/* Combined Progress bar */}
      <div
        className={`relative flex ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}
      >
        {/* First progress (Main) */}
        <div
          className="h-full bg-green-600 transition-all duration-300"
          style={{ width: `${firstProgress}%` }}
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        ></div>

        {/* Second progress (Overlay) - Only appears after 100% */}
        {firstProgress >= 100 && (
          <div
            className="absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-300 rounded-full"
            style={{ width: `${cycleProgress}%` }}
          ></div>
        )}

        {/* Second & Third progress */}
        <div
          className="h-full bg-yellow-100 transition-all duration-300"
          style={{ width: `${secondProgress}%` }}
          data-tooltip-id="manager-tooltip"
          data-tooltip-content={secondTooltipContent}
        ></div>
        <div
          className="h-full bg-green-400 transition-all duration-300"
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
