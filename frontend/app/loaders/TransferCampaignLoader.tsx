import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TransferCampaignLoader = () => {
  return (
    <div className="space-y-4">
      {/* Assuming we're waiting for campaigns data */}
      {Array(3) // Assuming there are 3 campaigns, adjust as necessary
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                {/* Loading title */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  <Skeleton width={200} />
                </h3>
                {/* Loading raised amount and goal amount */}
                <p className="text-gray-500 dark:text-neutral-400">
                  <Skeleton width={150} />
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TransferCampaignLoader;
