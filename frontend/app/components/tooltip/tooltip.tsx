'use client';

import { cn } from '@/app/lib/utils';
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
  className,
  iconSize = 16,
}) => {
  return (
    <>
      <FaInfoCircle
        data-tooltip-id={id}
        data-tooltip-html={content}
        data-tooltip-place="right"
        data-tooltip-delay-show={300}
        data-tooltip-delay-hide={200}
        className={cn(className, 'text-gray-400 text-sm cursor-pointer mr-2')}
        size={iconSize}
      />
      <Tooltip
        id={id}
        className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-50"
        clickable
        delayShow={300}
        delayHide={200}
        style={{
          pointerEvents: 'auto',
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default InfoTooltip;