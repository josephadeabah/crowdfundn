import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CampaignsLoader = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <Skeleton height={20} className="mb-2" />
              <Skeleton height={15} className="mb-2" />
              <div className="mt-4 flex justify-between items-center">
                <Skeleton height={30} width={100} />
                <Skeleton height={15} width={80} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CampaignsLoader;
