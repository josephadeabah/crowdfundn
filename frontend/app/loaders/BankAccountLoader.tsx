import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BankAccountLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-white rounded-none shadow-card border border-gray-200">
        <div className="space-y-4">
          {/* Name Row */}
          <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-300/50 rounded-lg">
                <Skeleton circle width={16} height={16} />
              </div>
              <span className="font-medium text-gray-600">
                <Skeleton width={60} height={16} />
              </span>
            </div>
            <span className="font-semibold text-gray-800">
              <Skeleton width={120} height={16} />
            </span>
          </div>

          {/* Account Number Row */}
          <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-300/50 rounded-lg">
                <Skeleton circle width={16} height={16} />
              </div>
              <span className="font-medium text-gray-600">
                <Skeleton width={120} height={16} />
              </span>
            </div>
            <span className="font-mono font-semibold text-gray-800 tracking-wider">
              <Skeleton width={100} height={16} />
            </span>
          </div>

          {/* Bank Row */}
          <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-300/50 rounded-lg">
                <Skeleton circle width={16} height={16} />
              </div>
              <span className="font-medium text-gray-600">
                <Skeleton width={50} height={16} />
              </span>
            </div>
            <span className="font-semibold text-gray-800">
              <Skeleton width={140} height={16} />
            </span>
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex items-center justify-center gap-3 w-full p-4 bg-gray-300 rounded-none font-semibold shadow-button">
        <Skeleton width={20} height={20} />
        <Skeleton width={150} height={20} />
      </div>
    </div>
  );
};

export default BankAccountLoader;