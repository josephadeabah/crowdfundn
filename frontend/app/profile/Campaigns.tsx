import React from 'react';

export default function Campaigns() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Campaigns
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Manage your active and past campaigns.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Active Campaign 1
          </h3>
          <p className="text-gray-500 dark:text-neutral-400">
            Ongoing fundraising for community development.
          </p>
          <div className="mt-4 flex justify-between items-center">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
              Amplify
            </button>
            <span className="text-xs text-green-400 font-semibold">
              Active campaign
            </span>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Active Campaign 2
          </h3>
          <p className="text-gray-500 dark:text-neutral-400">
            Fundraising for educational supplies.
          </p>
          <div className="mt-4 flex justify-between items-center">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
              Amplify
            </button>
            <span className="text-xs text-green-400 font-semibold">
              Active campaign
            </span>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Past Campaign 1
          </h3>
          <p className="text-gray-500 dark:text-neutral-400">
            Successfully funded school supplies.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Past Campaign 2
          </h3>
          <p className="text-gray-500 dark:text-neutral-400">
            Community park renovation completed.
          </p>
        </div>
      </div>
    </div>
  );
}
