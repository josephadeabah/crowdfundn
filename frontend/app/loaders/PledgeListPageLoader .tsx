'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PledgeListPageLoader = () => {
  return (
    <div className="container mx-auto px-2 py-8">
      <div className="w-full flex justify-start items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          <Skeleton width={200} height={30} />
        </h2>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        <Skeleton width={300} height={20} />
      </p>

      <div className="space-y-4">
        {[1, 2, 3].map((campaign) => (
          <div
            key={campaign}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Details Section */}
              <div className="flex-1 p-6">
                {/* Pledge Details */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <Skeleton width={100} height={15} />
                  </p>
                  <p className="text-sm text-gray-700">
                    <Skeleton width={150} height={15} />
                  </p>
                  <p className="text-sm text-gray-700">
                    <Skeleton width={120} height={15} />
                  </p>
                </div>

                {/* Shipping Data */}
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    <Skeleton width={150} height={20} />
                  </h3>
                  <p className="text-sm text-gray-700">
                    <Skeleton width={200} height={15} />
                  </p>
                  <p className="text-sm text-gray-700">
                    <Skeleton width={250} height={15} />
                  </p>
                </div>

                {/* Selected Rewards */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    <Skeleton width={200} height={25} />
                  </h3>
                  {[1, 2].map((reward) => (
                    <div key={reward} className="mb-6">
                      {/* Reward Image */}
                      <div className="relative w-full h-48 mb-4">
                        <Skeleton height={192} />
                      </div>

                      {/* Reward Details */}
                      <h2 className="text-xl font-semibold mb-2">
                        <Skeleton width={180} height={25} />
                      </h2>
                      <p className="text-gray-600 mb-4">
                        <Skeleton width={250} height={20} />
                      </p>
                      <p className="text-sm text-gray-700">
                        <Skeleton width={100} height={15} />
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delete Button */}
                <div className="mt-6">
                  <Skeleton width="100%" height={40} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PledgeListPageLoader;
