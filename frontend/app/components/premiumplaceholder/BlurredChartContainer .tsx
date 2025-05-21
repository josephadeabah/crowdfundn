// components/BlurredChartContainer.jsx
import React from 'react';
import Link from 'next/link';

import { ReactNode } from 'react';

interface BlurredChartContainerProps {
  children: ReactNode;
}

const BlurredChartContainer = ({ children }: BlurredChartContainerProps) => {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 dark:bg-opacity-30">
        <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
          <p className="mb-4">Upgrade your plan to access these analytics</p>
          <Link
            href="/upgrade"
            className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded hover:from-green-600 hover:to-green-700 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlurredChartContainer;
