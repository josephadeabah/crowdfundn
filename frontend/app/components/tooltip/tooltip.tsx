'use client';

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

interface InfoTooltipProps {
  id: string;
  content: string;
  className?: string;
  iconSize?: string | number;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  id,
  content,
  className = 'text-gray-400 text-sm cursor-pointer mr-2',
  iconSize = 16,
}) => {
  return (
    <>
      <FaInfoCircle
        data-tooltip-id={id}
        data-tooltip-html={content} // Changed from data-tooltip-content to data-tooltip-html
        className={className}
        size={iconSize}
      />
      <Tooltip
        id={id}
        className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-50"
        place="right"
      />
    </>
  );
};

export default InfoTooltip;
