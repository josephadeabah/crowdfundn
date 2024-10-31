import React from 'react';
import { FiPlus } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CampaignUpdatesLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Campaign Updates</h1>
        <button className="flex items-center px-4 py-2 bg-gray-300 text-white rounded-lg">
          <FiPlus className="mr-2" />
          Add Update
        </button>
      </div>

      {/* Updates Display Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              <Skeleton width={200} height={24} />
            </h2>
            <div className="space-y-4">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-orange-400 pl-4 py-2"
                >
                  <p className="text-gray-600 mt-1">
                    <Skeleton count={2} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignUpdatesLoader;
