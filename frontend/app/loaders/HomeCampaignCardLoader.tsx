'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomeCampaignCardLoader = () => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-background hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col">
      {/* Image placeholder */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content placeholder */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Avatar and name placeholder */}
        <div className="mb-3 flex items-center gap-2">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={100} height={12} />
        </div>

        {/* Title placeholder */}
        <h3 className="text-lg font-semibold mb-2">
          <Skeleton width={200} height={20} />
        </h3>

        {/* Progress bar placeholder */}
        <div className="mt-auto">
          <div className="w-full text-xs mb-2">
            <Skeleton width="100%" height={8} />
          </div>

          {/* Raised amount placeholder */}
          <div className="flex justify-between text-sm mb-4">
            <Skeleton width={100} height={12} />
          </div>

          {/* Backers and days left placeholder */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Skeleton width={16} height={16} />
              <Skeleton width={50} height={12} />
            </div>
            <Skeleton width={50} height={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCampaignCardLoader;
