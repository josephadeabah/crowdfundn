import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FundraiserLeaderboardLoader: React.FC = () => {
  const rows = Array(10).fill(null); // Adjust the number of rows as needed

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Rank
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Fund Raiser
            </th>
            <th className="px-4 py-3 text-gray-800 text-sm font-medium">
              Total Raised
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index} className="border-t border-gray-300">
              {/* Rank Column */}
              <td className="px-4 py-2 text-gray-600">
                <Skeleton width={40} />
              </td>

              {/* Fund Raiser Column */}
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

              {/* Total Raised Column */}
              <td className="px-4 py-2 text-gray-600">
                <Skeleton width={80} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundraiserLeaderboardLoader;
