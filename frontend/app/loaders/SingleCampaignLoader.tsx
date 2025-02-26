'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SingleCampaignLoader = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8 mb-12">
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* First Column (Bigger Width) */}
        <div className="lg:w-2/3">
          <div className="bg-white p-2 md:px-5 rounded-lg">
            {/* Campaign Title */}
            <Skeleton height={40} width={300} className="mb-4" />

            {/* Campaign Image */}
            <div className="h-[600px] mb-4">
              <Skeleton height={600} className="rounded-t" />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {['Details', 'Donate', 'Updates', 'Comments', 'Backers'].map(
                (tab, index) => (
                  <Skeleton key={index} height={40} width={100} />
                ),
              )}
            </div>

            {/* Tab Content - Details */}
            <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
              {/* Campaign Description */}
              <Skeleton count={5} className="mb-4" />

              {/* Share Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                <Skeleton height={30} width={200} className="mb-4" />
                <div className="flex gap-4 mb-4">
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={100} />
                </div>
              </div>

              {/* Fundraiser Info Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <Skeleton circle height={80} width={80} />
                <div className="flex-1">
                  <Skeleton height={20} width={150} className="mb-2" />
                  <Skeleton height={40} width={200} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Column (Smaller Width and Sticky) */}
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <div className="bg-white p-4 rounded-lg">
              {/* Support This Project */}
              <Skeleton height={30} width={200} className="mb-4" />
              <Skeleton height={20} width={300} className="mb-4" />

              {/* Donation Button */}
              <Skeleton height={50} className="mb-6" />

              {/* Campaign Progress */}
              <Skeleton height={30} width={200} className="mb-4" />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow mb-8 p-2 space-y-6 sm:space-y-0 sm:space-x-6">
                <div className="text-center sm:text-left">
                  <Skeleton height={20} width={150} className="mb-2" />
                  <Skeleton height={20} width={100} className="mb-2" />
                  <Skeleton height={20} width={120} />
                </div>
                <Skeleton circle height={150} width={150} />
              </div>

              {/* Donations Chart */}
              <Skeleton height={200} />
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Campaigns */}
      <div className="mt-8">
        <Skeleton height={30} width={200} className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={200} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignLoader;
