import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CampaignCardLoader = () => {
  return (
    <div className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 w-[220px] md:w-[280px]">
      <div className="flex flex-col h-full">
        <Skeleton height={128} className="mb-2 w-full" />
        <div className="px-1">
          <Skeleton height={20} width={135} className="mb-2" />
          <Skeleton height={10} width={100} className="mb-2" />
          <Skeleton height={10} width={120} />
          <div className="w-full text-xs mt-2">
            <Skeleton height={10} width={100} />
          </div>
          <p className="flex justify-between items-center text-sm font-semibold mt-2">
            <Skeleton height={10} width={80} />
            <Skeleton height={10} width={40} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignCardLoader;