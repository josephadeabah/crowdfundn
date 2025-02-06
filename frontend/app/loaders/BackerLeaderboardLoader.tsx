import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BackerLeaderboardLoader: React.FC = () => {
  const rows = Array(10).fill(null); // You can adjust the number of rows based on how many skeletons you want

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Rank
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              User
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Backed
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Score
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Trophy
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="px-4 py-2 text-gray-600">
                <Skeleton width={30} />
              </td>
              <td className="px-4 py-2 flex items-center space-x-3">
                <div className="relative cursor-pointer">
                  <Skeleton circle width={24} height={24} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-700">
                    <Skeleton width={100} />
                  </span>
                </div>
              </td>
              <td className="px-4 py-2 text-gray-700">
                <Skeleton width={80} />
              </td>
              <td className="px-4 py-2 text-gray-700">
                <Skeleton width={60} />
              </td>
              <td className="px-4 py-2 text-gray-700 flex items-center gap-2">
                <Skeleton width={20} height={20} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackerLeaderboardLoader;
