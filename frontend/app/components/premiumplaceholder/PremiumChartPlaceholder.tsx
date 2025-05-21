import React from 'react';
import Link from 'next/link';
import { FaLock, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';

const PremiumChartPlaceholder = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-dashed border-gray-300 dark:border-neutral-600 p-6 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FaLock className="h-12 w-12 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Premium Analytics Unlocked
        </h3>
        <p className="text-gray-500 dark:text-neutral-400 max-w-md">
          Get access to detailed funding analytics, performance metrics, and
          geographic insights by upgrading your account.
        </p>
        <Link
          href="/account/upgrade"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-colors duration-300 shadow-sm"
        >
          Upgrade Now
        </Link>
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-neutral-400">
          <div className="flex items-center">
            <FaChartLine className="mr-2" />
            <span>Funding Over Time</span>
          </div>
          <div className="flex items-center">
            <FaChartLine className="mr-2" />
            <span>Campaign Performance</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkedAlt className="mr-2" />
            <span>Funding Sources</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumChartPlaceholder;
