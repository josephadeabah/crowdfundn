'use client';
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

  useEffect(() => {
    fetchLeaderboardData(); // Fetch leaderboard data on component mount
  }, [fetchLeaderboardData]);

  const [activeTab, setActiveTab] = useState('all-time');
  const [selectedCategory, setSelectedCategory] = useState('topBackers');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const getFilteredData = (data: any[]) => {
    switch (activeTab) {
      case 'this-week':
        // Filter data for this week
        return data.filter((item) => isWithinThisWeek(item.date));
      case 'this-month':
        // Filter data for this month
        return data.filter((item) => isWithinThisMonth(item.date));
      default:
        // Default to "All Time"
        return data;
    }
  };

  // Mock filtering functions (replace with your actual logic)
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
    <div className="px-4 py-5 flex flex-col items-center flex-grow min-h-screen">
      <div className="w-full max-w-4xl  bg-white">
        <div className="p-4 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-white">Leaderboard</h1>
            <p className="text-sm text-[#90accb]">
              The top 100 Backers and their scores
            </p>
          </div>
        </div>
        <div className="py-3">
          <div className="flex justify-between">
            <div className="flex border-b border-[#314c68]">
              <button
                className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                  activeTab === 'all-time'
                    ? 'border-b-[#2589f4] text-white'
                    : 'border-b-transparent text-[#90accb]'
                }`}
                onClick={() => handleTabClick('all-time')}
              >
                All time
              </button>
              <button
                className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                  activeTab === 'this-month'
                    ? 'border-b-[#2589f4] text-white'
                    : 'border-b-transparent text-[#90accb]'
                }`}
                onClick={() => handleTabClick('this-month')}
              >
                This month
              </button>
              <button
                className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                  activeTab === 'this-week'
                    ? 'border-b-[#2589f4] text-white'
                    : 'border-b-transparent text-[#90accb]'
                }`}
                onClick={() => handleTabClick('this-week')}
              >
                This week
              </button>
            </div>
            <select
              className="ml-4 p-2 rounded bg-[#223549] text-white"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="topBackers">Top Backers</option>
              <option value="mostActiveBackers">Most Active Backers</option>
            </select>
          </div>
        </div>
        <div className="px-4 py-3">
          {loading ? (
            <p className="text-center text-[#90accb]">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#182634]">
                <tr>
                  <th className="px-4 py-3 text-white text-sm font-medium">Rank</th>
                  <th className="px-4 py-3 text-white text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-white text-sm font-medium">Backed</th>
                  <th className="px-4 py-3 text-white text-sm font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-t border-[#314c68]">
                    <td className="px-4 py-2 text-[#90accb]">{index + 1}</td>
                    <td className="px-4 py-2 text-[#90accb]">{item.name}</td>
                    <td className="px-4 py-2 text-[#90accb]">{item.amount}</td>
                    <td className="px-4 py-2 text-[#90accb]">
                      {item.contributions || item.rewards}
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
