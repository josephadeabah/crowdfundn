import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CampaignCardLoader = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="flex flex-col h-full">
              <Skeleton height={128} className="mb-2 w-full" />{' '}
              {/* Image placeholder */}
              <div className="px-1">
                <Skeleton height={20} width={135} className="mb-2" />{' '}
                {/* Title placeholder */}
                <Skeleton height={10} width={100} className="mb-2" />{' '}
                {/* Progress bar placeholder */}
                <Skeleton height={10} width={120} />{' '}
                {/* Raised amount placeholder */}
                <div className="w-full text-xs mt-2">
                  <Skeleton height={10} width={100} />
                </div>
                <p className="flex justify-between items-center text-sm font-semibold mt-2">
                  <Skeleton height={10} width={80} /> {/* Current amount */}
                  <Skeleton height={10} width={40} /> {/* Raised label */}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CampaignCardLoader;
