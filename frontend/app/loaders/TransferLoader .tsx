import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TransferLoader = () => {
  return (
    <>
      <thead className="bg-gray-50 dark:bg-neutral-700">
        <tr>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Amount
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Date
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Status
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Reference
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Account Number
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Settlement Bank
          </th>
          <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
            Reason
          </th>
        </tr>
      </thead>
      <tbody>
        {Array(10) // Assuming there are 5 rows of transfers, adjust as necessary
          .fill(null)
          .map((_, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                <Skeleton width={100} />
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                <Skeleton width={120} />
              </td>
              <td className="px-4 py-2 text-green-500 dark:text-green-400 whitespace-nowrap">
                <Skeleton width={80} />
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                <Skeleton width={150} />
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                <Skeleton width={120} />
              </td>
              <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                <Skeleton width={150} />
              </td>
              <td className="px-4 py-2 truncate text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                <Skeleton width={200} />
              </td>
            </tr>
          ))}
      </tbody>
    </>
  );
};

export default TransferLoader;
