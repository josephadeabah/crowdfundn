import React from 'react';
import { FiPlus } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CampaignsLoader = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        <button className="flex items-center px-4 py-2 bg-gray-300 text-white rounded-lg">
          <FiPlus className="mr-2" />
          Add Campaign
        </button>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Manage your active and past campaigns.
      </p>
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
