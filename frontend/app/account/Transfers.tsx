import React from 'react';
import { Button } from '../components/button/Button';

export default function Transfers() {
  return (
    <div className="h-full mb-20">
      {/* Header Section */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Transfers
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Review your transfer history or request new transfers.
      </p>
      {/* Request Transfer Button */}
      <Button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700 mb-6">
        Request Transfer
      </Button>
      {/* Cards Section */}
      <div className="space-y-4">
        {/* Activity Card */}
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Activity
          </h3>
          <ul className="mt-2 space-y-2 text-gray-600 dark:text-neutral-300">
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
        <div className=" bg-white dark:bg-gray-900 rounded-lg duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Breakdown
          </h3>
          {/* Total Donated - Full Width */}
          <div className="p-4 hover:bg-gray-50 dark:bg-neutral-800 rounded-lg shadow mb-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-white">
              Total Donated
            </h4>
            <p className="text-green-500 dark:text-neutral-400">$10,500</p>
          </div>

          {/* Flexed Sub-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Current Balance */}
            <div className="p-4 hover:bg-gray-50 dark:bg-neutral-800 rounded-lg shadow">
              <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                Current Balance
              </h4>
              <p className="text-yellow-600 dark:text-neutral-400">$4,200</p>
            </div>

            {/* Being Processed */}
            <div className="p-4 hover:bg-gray-50 dark:bg-neutral-800 rounded-lg shadow">
              <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                Being Processed
              </h4>
              <p className="text-gray-500 dark:text-neutral-400">$1,500</p>
            </div>

            {/* Transaction Fees */}
            <div className="p-4 hover:bg-gray-50 dark:bg-neutral-800 rounded-lg shadow">
              <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                Transaction Fees
              </h4>
              <p className="text-red-500 dark:text-neutral-400">-$300</p>
            </div>
          </div>
        </div>
      </div>
      {/* Transaction History Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Transaction History
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
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
              <tr>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  $1,500
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-white">
                  Aug 10, 2024
                </td>
                <td className="px-4 py-2 text-green-500 dark:text-green-400">
                  Completed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Space Below the Page */}
      <div className="h-20"></div> {/* Adjust the height as needed */}
    </div>
  );
}
