'use client';
import Avatar from '@/app/components/avatar/Avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/popover/Popover';
import { useLeaderboardContext } from '@/app/context/leaderboard/LeaderboardContext';
import React, { useEffect } from 'react';

const LeaderboardFundraisersPage = () => {
  const { topFundraisersStories, loading, error, fetchLeaderboardData } =
    useLeaderboardContext(); // Access the context

  useEffect(() => {
    fetchLeaderboardData(); // Fetch leaderboard data on component mount
  }, [fetchLeaderboardData]);

  return (
    <div className="px-4 py-5 flex flex-col items-center flex-grow bg-white min-h-screen">
      <div className="w-full max-w-xl">
        <div className="p-4 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-black">
              Fundraisers Leaderboard
            </h1>
            <p className="text-sm text-gray-600">
              The top 100 fundraisers with the best campaigns
            </p>
          </div>
        </div>
        <div className="px-4 py-3">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Fundraiser
                  </th>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {topFundraisersStories.map((fundraiser, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center space-x-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative cursor-pointer">
                            <Avatar name={fundraiser.name} size="sm" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 shadow-lg">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <Avatar name={fundraiser.name} size="sm" />
                              <div>
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {fundraiser.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {fundraiser.country || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Campaign Name
                              </p>
                              <p className="text-sm text-gray-600">
                                {fundraiser.campaign || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Bio
                              </p>
                              <p className="text-sm text-gray-600">
                                {fundraiser.bio || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Total Raised
                              </p>
                              <p className="text-sm text-gray-600">
                                {fundraiser.amount || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-gray-700">{fundraiser.name}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {fundraiser.campaign || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {fundraiser.score || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardFundraisersPage;
