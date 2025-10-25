// WatchlistSkeletonLoader.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const WatchlistSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40} />
            <div className="flex-1">
              <Skeleton width={200} height={24} className="mb-2" />
              <Skeleton width={300} height={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - All Campaigns Skeleton */}
          <div className="flex-1">
            <div className="mb-6">
              <Skeleton width={250} height={28} className="mb-2" />
              <Skeleton width={200} height={16} />
            </div>

            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Image Section Skeleton */}
                  <div className="relative w-full h-48">
                    <Skeleton height={192} className="rounded-none" />

                    {/* Campaign Type Badge Skeleton */}
                    <div className="absolute top-3 left-3">
                      <Skeleton width={80} height={28} borderRadius={16} />
                    </div>

                    {/* Favorite Button Skeleton */}
                    <div className="absolute top-3 right-3">
                      <Skeleton circle width={36} height={36} />
                    </div>
                  </div>

                  {/* Content Section Skeleton */}
                  <div className="p-4">
                    {/* Header Skeleton */}
                    <div className="mb-3">
                      <Skeleton width="80%" height={20} className="mb-2" />
                      <div className="flex items-center gap-2">
                        <Skeleton circle width={16} height={16} />
                        <Skeleton width={120} height={16} />
                      </div>
                    </div>

                    {/* Progress Bar Skeleton */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <Skeleton width={80} height={16} />
                        <Skeleton width={100} height={16} />
                      </div>
                      <Skeleton height={12} borderRadius={6} />
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {Array.from({ length: 4 }).map((_, statIndex) => (
                        <div
                          key={statIndex}
                          className="text-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Skeleton circle width={16} height={16} />
                            <Skeleton width={50} height={16} />
                          </div>
                          <Skeleton
                            width={60}
                            height={20}
                            className="mx-auto"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Action Section Skeleton */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <Skeleton circle width={40} height={40} />
                        <div>
                          <Skeleton width={100} height={16} className="mb-1" />
                          <Skeleton width={80} height={14} />
                        </div>
                      </div>
                      <Skeleton width={120} height={40} borderRadius={8} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Favorites Sidebar Skeleton */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Sidebar Header Skeleton */}
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton width={150} height={20} className="mb-2" />
                    <Skeleton width={100} height={16} />
                  </div>
                  <Skeleton circle width={32} height={32} />
                </div>
              </div>

              {/* Scrollable Favorites List Skeleton */}
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: 'calc(100vh - 200px)',
                  minHeight: '200px',
                }}
              >
                <div className="p-4">
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Avatar Skeleton */}
                        <Skeleton circle width={40} height={40} />

                        {/* Campaign Info Skeleton */}
                        <div className="flex-1 min-w-0">
                          <Skeleton width="90%" height={16} className="mb-1" />
                          <Skeleton width="70%" height={14} className="mb-1" />
                          <div className="flex items-center gap-2">
                            <Skeleton
                              width={60}
                              height={20}
                              borderRadius={10}
                            />
                            <Skeleton width={50} height={14} />
                          </div>
                        </div>

                        {/* Remove Button Skeleton */}
                        <Skeleton circle width={24} height={24} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Skeleton */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Skeleton width={200} height={14} className="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistSkeletonLoader;
