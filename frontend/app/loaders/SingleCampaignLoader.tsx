'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SingleCampaignLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Middle Column: Campaign Details */}
        <div className="order-1 lg:col-span-1 overflow-y-auto max-h-100">
          <h1 className="text-4xl font-bold mb-4">
            <Skeleton width={300} />
          </h1>
          <div className="mb-8 relative">
            <Skeleton height={300} className="rounded-lg" />
          </div>
          <div className="bg-white rounded-lg shadow-md py-6 px-2 mb-8">
            <div className="w-full flex flex-col gap-2 items-center mb-4">
              <div className="text-2xl font-bold">
                <Skeleton width={150} />
              </div>
              <Skeleton height={10} width={600} />
            </div>
            <div className="prose max-w-none">
              <Skeleton count={3} />
            </div>
          </div>
        </div>

        {/* Left Column: Donation and Rewards */}
        <div className="order-3 sticky top-4 h-fit">
          <h2 className="text-2xl font-bold mb-4 w-full">
            <Skeleton width={200} />
          </h2>
          <div className="bg-white rounded-sm shadow p-4 mb-4">
            <Skeleton height={100} />
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <Skeleton width={150} />
            </h2>
            <div className="flex items-center mb-4">
              <Skeleton width={100} height={40} className="mr-4" />
              <Skeleton width={60} height={40} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold">
              <Skeleton width={150} />
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <Skeleton count={4} height={50} />
            </div>
            <Skeleton height={100} className="mt-4" />
            <Skeleton width={80} height={40} className="mt-2" />
          </div>
        </div>

        {/* Right Column: Sticky Rewards */}
        <div className="order-2 lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md px-6 mb-20 pb-10">
            <h2 className="text-2xl font-bold mb-4">
              <Skeleton width={150} />
            </h2>
            <div className="max-h-96 overflow-y-auto px-4 mb-4">
              <Skeleton count={3} height={80} className="mb-4" />
            </div>
            <Skeleton height={50} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignLoader;
