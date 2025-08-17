import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EquityInvestmentsLoader = () => {
  return (
    <div className="px-2 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          <Skeleton width={200} />
        </h1>
        <div className="flex space-x-4">
          <Skeleton width={150} height={40} />
        </div>
      </div>

      {/* Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <h3 className="text-gray-500 dark:text-gray-400 mb-2">
              <Skeleton width={120} />
            </h3>
            <p className="text-3xl font-bold">
              <Skeleton width={100} />
            </p>
          </div>
        ))}
      </div>

      {/* Investments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
        <div className="px-2 py-4">
          <h2 className="text-xl font-semibold mb-4">
            <Skeleton width={150} />
          </h2>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    'Campaign',
                    'Invested',
                    'Shares',
                    'Current Value',
                    'Return',
                    'Status',
                    'Actions',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <Skeleton width={80} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={180} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={80} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={100} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={80} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={120} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton width={80} height={24} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-4">
                        <Skeleton width={50} height={24} />
                        <Skeleton width={80} height={24} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            <Skeleton width={150} />
          </h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <Skeleton width="90%" height="90%" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            <Skeleton width={120} />
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Skeleton width={200} />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  <Skeleton width={100} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquityInvestmentsLoader;
