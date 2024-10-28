import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RewardsLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <Skeleton height={192} className="mb-2" />{' '}
            {/* Placeholder for image */}
            <Skeleton height={20} className="mb-2" />{' '}
            {/* Placeholder for title */}
            <Skeleton height={15} className="mb-2" />{' '}
            {/* Placeholder for description */}
            <div className="flex justify-between items-center">
              <Skeleton height={30} width={80} /> {/* Placeholder for amount */}
              <Skeleton height={15} width={50} /> {/* Placeholder for points */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default RewardsLoader;
