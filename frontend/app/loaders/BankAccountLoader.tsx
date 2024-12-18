import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BankAccountLoader: React.FC = () => {
  return (
    <div className="p-4 max-w-md bg-white rounded-sm shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Name Row */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">
            <Skeleton width={80} height={16} />
          </span>
          <span className="text-gray-800">
            <Skeleton width={120} height={16} />
          </span>
        </div>

        {/* Account Number Row */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">
            <Skeleton width={120} height={16} />
          </span>
          <span className="text-gray-800">
            <Skeleton width={100} height={16} />
          </span>
        </div>

        {/* Bank Row */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">
            <Skeleton width={50} height={16} />
          </span>
          <span className="text-gray-800">
            <Skeleton width={140} height={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BankAccountLoader;
