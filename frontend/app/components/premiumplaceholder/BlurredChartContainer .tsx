// components/BlurredChartContainer.jsx
import React from 'react';
import { ReactNode } from 'react';
import { FaLock } from 'react-icons/fa';

interface BlurredChartContainerProps {
  children: ReactNode;
}

const BlurredChartContainer = ({ children }: BlurredChartContainerProps) => {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 dark:bg-opacity-30">
        <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="mb-4">Upgrade your plan to access these analytics</p>
          <FaLock className="h-12 w-12 text-yellow-500" />
          <p className="text-gray-500 dark:text-neutral-400 max-w-md">
            Get access to detailed funding analytics, performance metrics, and
            geographic insights by upgrading your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlurredChartContainer;
