'use client';
import Avatar from '@/app/components/avatar/Avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/popover/Popover';
import { useLeaderboardContext } from '@/app/context/leaderboard/LeaderboardContext';
import React, { useEffect, useState } from 'react';

const LeaderboardBackersPage = () => {
  const {
    topBackers,
    mostActiveBackers,
    loading,
    error,
    fetchLeaderboardData,
  } = useLeaderboardContext(); // Access the context

  const [activeTab, setActiveTab] = useState('all-time');
  const [selectedCategory, setSelectedCategory] = useState('topBackers');

  useEffect(() => {
    fetchLeaderboardData(); // Fetch leaderboard data on component mount
  }, [fetchLeaderboardData]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const getFilteredData = (data: any[]) => {
    switch (activeTab) {
      case 'this-week':
        return data.filter((item) => isWithinThisWeek(item.date)); // Mock filtering logic
      case 'this-month':
        return data.filter((item) => isWithinThisMonth(item.date)); // Mock filtering logic
      default:
        return data;
    }
  };

  const isWithinThisWeek = (date: string) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const givenDate = new Date(date);
    return givenDate >= startOfWeek;
  };

  const isWithinThisMonth = (date: string) => {
    const now = new Date();
    const givenDate = new Date(date);
    return (
      givenDate.getFullYear() === now.getFullYear() &&
      givenDate.getMonth() === now.getMonth()
    );
  };

  const filteredData =
    selectedCategory === 'topBackers'
      ? getFilteredData(topBackers)
      : getFilteredData(mostActiveBackers);

  return (
    <div className="px-4 py-5 flex flex-col items-center flex-grow bg-white min-h-screen">
      <div className="w-full max-w-3xl">
        <div className="p-4 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-black">
              Leaderboard
            </h1>
            <p className="text-sm text-gray-600">
              The top 100 Backers and their scores
            </p>
          </div>
        </div>
        <div className="py-3">
          <div className="w-full flex justify-between items-center">
            <div className="flex space-x-4 border-b border-gray-300">
              {['all-time', 'this-month', 'this-week'].map((tab) => (
                <button
                  key={tab}
                  className={`text-sm font-bold py-2 ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-black'
                      : 'text-gray-600'
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.replace('-', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
            <select
              className="ml-4 p-2 rounded bg-gray-100 border text-gray-700"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="topBackers">Top Backers</option>
              <option value="mostActiveBackers">Most Active Backers</option>
            </select>
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
                    User
                  </th>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Backed
                  </th>
                  <th className="px-4 py-3 text-gray-800 text-sm font-medium">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((backer, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 flex items-center space-x-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative cursor-pointer">
                            <Avatar name={backer.name} size="sm" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 shadow-lg">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <Avatar name={backer.name} size="sm" />
                              <div>
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {backer.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {backer.country || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Category Interest
                              </p>
                              <p className="text-sm text-gray-600">
                                {backer.category_interest || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Bio
                              </p>
                              <p className="text-sm text-gray-600">
                                {backer.bio || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">
                                Total Donated
                              </p>
                              <p className="text-sm text-gray-600">
                                {backer.amount || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <span className="text-gray-700">{backer.name}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{backer.amount}</td>
                    <td className="px-4 py-2 text-gray-700">
                      {backer.score || 'N/A'}
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

export default LeaderboardBackersPage;
