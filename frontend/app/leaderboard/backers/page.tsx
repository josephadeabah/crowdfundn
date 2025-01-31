'use client';
import Avatar from '@/app/components/avatar/Avatar';
import BronzeCupIcon from '@/app/components/icons/BronzeCupIcon';
import DiamondCupIcon from '@/app/components/icons/DiamondCupIcon';
import GoldCupIcon from '@/app/components/icons/GoldCupIcon';
import SilverCupIcon from '@/app/components/icons/SilverCupIcon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/popover/Popover';
import { usePointRewardContext } from '@/app/context/pointreward/PointRewardContext';
import TransferLoader from '@/app/loaders/TransferLoader ';
import { deslugify } from '@/app/utils/helpers/categories';
import { getRankWithSuffix } from '@/app/utils/helpers/ranking.suffix';
import React, { useEffect } from 'react';

// Function to determine the cup icon based on score
const getCupIcon = (score: number) => {
  if (score >= 5000) {
    return <DiamondCupIcon className="w-6 h-6 text-yellow-700" />;
  } else if (score >= 1000) {
    return <GoldCupIcon className="w-6 h-6 text-yellow-400" />;
  } else if (score >= 500) {
    return <SilverCupIcon className="w-6 h-6 text-gray-400" />;
  } else {
    return <BronzeCupIcon className="w-6 h-6 text-orange-500" />;
  }
};

const LeaderboardBackersPage = () => {
  const { leaderboard, loading, error, fetchLeaderboard } =
    usePointRewardContext(); // Access the context

  useEffect(() => {
    // Get the fragment (hash) from the URL
    const hash = window.location.hash;

    if (hash) {
      const target = document.getElementById(hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(); // Fetch leaderboard data on component mount
  }, [fetchLeaderboard]);

  return (
    <div className="px-4 py-5 flex flex-col items-center flex-grow bg-white min-h-screen">
      <div className="w-full max-w-7xl">
        <div className="p-4 flex justify-between">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-black">
              Leaderboard
            </h1>
            <p className="text-sm text-gray-600">
              See our philanthropists funding the most interesting projects
            </p>
          </div>
        </div>
        <div className="px-4 py-3">
          {loading ? (
            <TransferLoader />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No change makers yet. Be the first philanthropist!
            </p>
          ) : (
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
                  {leaderboard.map((backer) => (
                    <tr key={backer.id} className="border-t border-gray-300">
                      <td className="px-4 py-2 text-gray-600">
                        {getRankWithSuffix(backer.rank)}
                      </td>
                      <td className="px-4 py-2 flex items-center space-x-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative cursor-pointer">
                              <Avatar name={backer.username} size="sm" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4 shadow-lg">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <Avatar name={backer.username} size="xl" />
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-800">
                                    {backer.username}
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
                                  {deslugify(backer.category_interest) || 'N/A'}
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
                                  {backer?.currency?.toUpperCase()}{' '}
                                  {Number(backer?.total_donations || 0).toFixed(
                                    2,
                                  ) || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <span className="text-gray-700">{backer.username}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {backer?.currency?.toUpperCase()}{' '}
                        {Number(backer?.total_donations || 0).toFixed(2) ||
                          'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {backer.score || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700 flex items-center">
                        {getCupIcon(backer.score)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* How-to Section */}
        <div
          id="leaderboard-info"
          className="w-full max-w-7xl mt-10 bg-gray-50 border border-gray-200 rounded-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            How do I get on the leaderboard?
          </h2>

          <div className="mt-4 space-y-4 text-gray-700">
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Top Projects Requirement
              </h3>
              <p className="text-sm">
                You have to be in the top 5% of all projects based on total
                funds donated. So if there are 100 projects, you'd need to be in
                the top 5. If there are 10,000 projects, you'd need to be in the
                top 500.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Project Progress
              </h3>
              <p className="text-sm">
                You can track your progress on your account on reward pane. This
                will show your current rank and how much money you've
                contributed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                What happens if I make the leaderboard?
              </h3>
              <p className="text-sm">
                If you make the leaderboard, you'll get a special badge on your
                profile and depending on the points you make, you can unlock a
                special certificate of honor. You'll also be recognized globally
                as a philanthropist. This is a great way to show our
                appreciation for the impact you're making in the world.
              </p>
              <p className="text-sm mt-2">
                You'll also get a shout-out in our weekly newsletter. This goes
                out to thousands of people who love to discover new projects.
                It's a great way to show our appreciation to backers making the
                world a better place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardBackersPage;
