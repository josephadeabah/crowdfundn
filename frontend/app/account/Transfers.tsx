import React from 'react';

export default function Transfers() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Transfers
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Review your transfer history or request new transfers.
      </p>
      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700 mb-6">
        Request Transfer
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Payout Card */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Payout
          </h3>
          <p className="text-gray-500 dark:text-neutral-400">Total: $3,500</p>
          <p className="text-gray-600 dark:text-neutral-300">Pending: $1,200</p>
          <p className="text-gray-600 dark:text-neutral-300">
            Completed: $2,300
          </p>
        </div>

        {/* Activity Card */}
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-900 hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Activity
          </h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Mobile Money</span>
              <span>$1,200</span>
            </li>
            <li className="flex justify-between">
              <span>Bank Transfer</span>
              <span>$1,500</span>
            </li>
            <li className="flex justify-between">
              <span>Digital Payment (PayPal)</span>
              <span>$800</span>
            </li>
          </ul>
        </div>

        {/* Breakdown Card */}
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-900 hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Breakdown
          </h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Mobile Money Fees</span>
              <span className="text-red-500">-$50</span>
            </li>
            <li className="flex justify-between">
              <span>Bank Transfer Fees</span>
              <span className="text-red-500">-$30</span>
            </li>
            <li className="flex justify-between">
              <span>PayPal Fees</span>
              <span className="text-red-500">-$20</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Transaction History
        </h3>
        <table className="min-w-full table-auto bg-white dark:bg-neutral-800 rounded-lg">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-white hover:bg-gray-100">
                Date
              </th>
              <th className="px-4 py-2 text-left text-gray-600 dark:text-white hover:bg-gray-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100">
                $1,200
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100">
                Aug 15, 2024
              </td>
              <td className="px-4 py-2 text-yellow-500 dark:text-yellow-400 hover:bg-gray-100">
                Pending
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100">
                $1,500
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100">
                Aug 10, 2024
              </td>
              <td className="px-4 py-2 text-green-500 dark:text-green-400 hover:bg-gray-100">
                Completed
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
