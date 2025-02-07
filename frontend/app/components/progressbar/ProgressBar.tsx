import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  secondProgress?: number;
  thirdProgress?: number;
  firstTooltipContent: string;
  secondTooltipContent?: string;
  thirdTooltipContent?: string;
  className?: string; // New prop for custom height and styles
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  secondProgress,
  thirdProgress,
  firstTooltipContent,
  secondTooltipContent,
  thirdTooltipContent,
  className = 'h-2', // Default className for height
}) => {
  const [progress, setProgress] = useState(firstProgress);
  const [color, setColor] = useState('bg-green-600');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setColor((prevColor) => 
            prevColor === 'bg-green-600' ? 'bg-blue-600' : 
            prevColor === 'bg-blue-600' ? 'bg-red-600' : 
            'bg-green-600'
          );
          return 0;
        }
        return prevProgress + 1;
      });
    }, 50); // Adjust the interval for smoother or faster progression

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Progress labels */}
      <div className="text-md flex items-center justify-between font-bold">
        <span
          className="text-green-600"
          data-tooltip-id="performance-tooltip"
          data-tooltip-content={firstTooltipContent}
        >
          {`${Math.round(progress)}%`}
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
        className={`flex ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}
      >
        <div
          className={`h-full ${color}`}
          style={{ width: `${progress}%` }}
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