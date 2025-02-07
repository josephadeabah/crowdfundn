import React from 'react';
import { Tooltip } from 'react-tooltip';

interface ProgressBarProps {
  firstProgress: number;
  firstTooltipContent: string;
  className?: string;
  overflowColors?: string[]; // Colors for overflow layers
}

const Progress: React.FC<ProgressBarProps> = ({
  firstProgress,
  firstTooltipContent,
  className = 'h-2',
  overflowColors = ['#FACC15', '#FF8800', '#DC2626'], // Yellow, Orange, Red
}) => {
  let remainingValue: number = firstProgress;
  const progressSegments: { color: string; progress: number }[] = [];

  // Base progress (Max 100%)
  const baseProgress: number = Math.min(remainingValue, 100);
  progressSegments.push({ color: 'green', progress: baseProgress });
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
      <div className={`relative ${className} w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}>
        {progressSegments.reduce<JSX.Element[]>((prevElements, segment, index) => {
          const prevWidth = prevElements.reduce((sum, el) => sum + (el.props.style?.width ? parseFloat(el.props.style.width) : 0), 0);
          const width = `${segment.progress}%`;

          return [
            ...prevElements,
            <div
              key={index}
              className="absolute top-0 left-0 h-full opacity-80"
              style={{ width, backgroundColor: segment.color, left: `${prevWidth}%` }}
              data-tooltip-id={`progress-tooltip-${index}`}
              data-tooltip-content={
                index === 0 ? `${segment.progress}%` : `Overflow ${index}: ${segment.progress}%`
              }
            ></div>,
            <Tooltip key={`tooltip-${index}`} id={`progress-tooltip-${index}`} />,
          ];
        }, [])}
      </div>
    </div>
  );
};

export default Progress;
