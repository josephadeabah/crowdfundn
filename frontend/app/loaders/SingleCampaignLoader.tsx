'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SingleCampaignLoader: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 lg:px-8 py-8">
        {/* Tabs Skeleton */}
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
          <Skeleton width={80} height={30} />
        </div>

        {/* Campaign Title */}
        <Skeleton width={400} height={40} className="mb-4" />

        {/* Campaign Image */}
        <div className="w-full aspect-video rounded-md overflow-hidden mb-4">
          <Skeleton height="100%" />
        </div>

        {/* Progress Section */}
        <div className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="w-full space-y-2">
            <Skeleton width={150} height={20} />
            <Skeleton width={300} height={20} />
            <Skeleton width={200} height={20} />
          </div>
          <div>
            <Skeleton circle width={120} height={120} />
          </div>
        </div>

        {/* Campaign Description */}
        <div className="space-y-2 mb-6">
          <Skeleton width={600} height={20} />
          <Skeleton width={600} height={20} />
          <Skeleton width={400} height={20} />
        </div>

        {/* Share and Fundraiser Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          {/* Share Section */}
          <div className="border-b pb-4 mb-4">
            <Skeleton width={200} height={25} className="mb-3" />
            <div className="flex space-x-4">
              <Skeleton width={100} height={40} />
              <Skeleton width={100} height={40} />
            </div>
          </div>

          {/* Fundraiser Info */}
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton circle width={50} height={50} />
            <Skeleton width={150} height={20} />
          </div>

          <Skeleton width={300} height={20} />
          <Skeleton width={300} height={20} />
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignLoader;
