import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TransferLoader = () => {
  return (
    <>
      {Array(8) // Assuming there are 8 rows to be loaded
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
    </>
  );
};

export default TransferLoader;
