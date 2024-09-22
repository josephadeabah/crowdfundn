'use client';
import { useState } from 'react';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Active Campaigns
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  3 Campaigns
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Total Donations
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">$12,300</p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Pending Withdrawals
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">$2,400</p>
              </div>
            </div>
          </div>
        );
      case 'Donations':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Donations
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Donor
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800">
                  <tr>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      John Doe
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      $500
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      Aug 20, 2024
                    </td>
                    <td className="px-4 py-2 text-green-500 dark:text-green-400">
                      Completed
                    </td>
                  </tr>
                  {/* Add more rows */}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Transfers':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Transfers
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Review your transfer history or request new transfers.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
              Request Transfer
            </button>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800">
                  <tr>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      $1,200
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      Aug 15, 2024
                    </td>
                    <td className="px-4 py-2 text-yellow-500 dark:text-yellow-400">
                      Pending
                    </td>
                  </tr>
                  {/* Add more rows */}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Rewards':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Rewards
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Manage rewards offered in your campaigns.
            </p>
            <ul className="space-y-3">
              <li className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Exclusive T-shirt
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  For donations over $50
                </p>
              </li>
              {/* Add more rewards */}
            </ul>
          </div>
        );
      case 'Updates':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Post Updates
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Share the latest updates with your backers.
            </p>
            <textarea
              className="w-full p-3 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
              rows={1}
              placeholder="Write your update here..."
            ></textarea>
            <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
              Post Update
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-screen">
      {/* Tabs Menu */}
      <div className="w-full md:w-[15%] border-b md:border-b-0 md:border-r-2 border-dashed border-red-200 dark:border-neutral-700">
        <nav
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible"
          aria-label="Tabs"
          role="tablist"
        >
          {['Dashboard', 'Donations', 'Transfers', 'Rewards', 'Updates'].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                className={`py-2 px-2 whitespace-nowrap text-sm md:text-base ${activeTab === tab ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-4 md:border-r-0 border-red-200 text-red-600 dark:text-red-600' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'} flex items-center focus:outline-none`}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                aria-controls={`vertical-tab-${tab}`}
                role="tab"
              >
                {tab}
              </button>
            ),
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-full p-4 md:m-3">
        <div role="tabpanel" id={`vertical-tab-${activeTab}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
