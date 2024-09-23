import React from 'react';

export default function Rewards() {
  return (
    <div className="h-full">
      {/* Donor List Section */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-4">
        Donor List
      </h3>
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 overflow-x-auto overflow-y-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-2 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Donor Name
              </th>
              <th className="py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
            {/* Sample Data for Donors */}
            {[
              { id: 1, name: 'John Doe' },
              { id: 2, name: 'Jane Smith' },
              { id: 3, name: 'Sam Wilson' },
            ].map((donor) => (
              <tr key={donor.id}>
                <td className="py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                  {donor.name}
                </td>
                <td className="py-4 flex items-center justify-end text-xs font-medium whitespace-nowrap">
                  <button className="flex items-center justify-center px-2 py-1 border border-gray-800 dark:border-gray-400 bg-white text-gray-600 dark:text-gray-50 rounded-full hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                    Reward Donor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-4 dark:text-white">
        Your Rewards for Donors
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-6">
        Offer exciting rewards to your supporters and engage them in your
        campaign.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Rewards You Can Offer
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Personalized Thank You Video
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For donations over $20
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Send a heartfelt video message to your supporters expressing
            gratitude.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Exclusive Merchandise
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For donations over $50
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Provide exclusive campaign merchandise such as T-shirts or stickers.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            VIP Event Access
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For donations over $100
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Invite supporters to exclusive events where they can meet you and
            others.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-4">
        Platform-Supported Rewards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Gamification Badge
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For any donation
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Automatically earn a digital badge for each contribution to showcase
            your support.
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Community Recognition
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For any donation
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Receive shout-outs on our platform for your generosity.
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow hover:bg-gray-100">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">
            Special Updates
          </h4>
          <p className="text-gray-500 dark:text-neutral-400">
            For any donation
          </p>
          <p className="text-gray-600 dark:text-neutral-300">
            Get exclusive updates and insights about the campaign.
          </p>
        </div>
      </div>
    </div>
  );
}
