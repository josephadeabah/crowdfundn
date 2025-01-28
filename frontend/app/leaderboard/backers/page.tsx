'use client';
import React, { useState } from 'react';

const LeaderboardBackersPage = () => {
  const [activeTab, setActiveTab] = useState('all-time');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="px-4 md:px-40 py-5 flex flex-col items-center flex-grow bg-[#0d1a26] min-h-screen">
      <div className="w-full max-w-[960px]">
        <div className="p-4 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-white">Leaderboard</h1>
            <p className="text-sm text-[#90accb]">The top 100 fundraisers and their scores</p>
          </div>
        </div>
        <div className="px-4 py-3">
          <label className="flex items-center rounded-xl bg-[#223549]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#90accb] w-6 h-6 ml-4"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
            <input
              placeholder="Search for users, campaigns, or scores"
              className="flex-grow bg-[#223549] text-white placeholder-[#90accb] px-4 py-2 rounded-r-xl focus:outline-none"
            />
          </label>
        </div>
        <div className="py-3">
          <div className="flex border-b border-[#314c68]">
            <button
              className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                activeTab === 'all-time' ? 'border-b-[#2589f4] text-white' : 'border-b-transparent text-[#90accb]'
              }`}
              onClick={() => handleTabClick('all-time')}
            >
              All time
            </button>
            <button
              className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                activeTab === 'this-month' ? 'border-b-[#2589f4] text-white' : 'border-b-transparent text-[#90accb]'
              }`}
              onClick={() => handleTabClick('this-month')}
            >
              This month
            </button>
            <button
              className={`flex-1 text-sm font-bold text-center py-4 border-b-2 ${
                activeTab === 'this-week' ? 'border-b-[#2589f4] text-white' : 'border-b-transparent text-[#90accb]'
              }`}
              onClick={() => handleTabClick('this-week')}
            >
              This week
            </button>
          </div>
        </div>
        <div className="px-4 py-3">
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
              <tr className="border-t border-[#314c68]">
                <td className="px-4 py-2 text-[#90accb]">1</td>
                <td className="px-4 py-2">
                  <div
                    className="w-10 h-10 bg-cover rounded-full"
                    style={{
                      backgroundImage:
                        'url("https://cdn.usegalileo.ai/sdxl10/a245309c-1e3c-4d2e-ab37-e62e455b4346.png")',
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-[#90accb]">$1,000</td>
                <td className="px-4 py-2 text-[#90accb]">1,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardBackersPage;