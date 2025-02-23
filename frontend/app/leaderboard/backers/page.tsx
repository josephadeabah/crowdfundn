'use client';
import Avatar from '@/app/components/avatar/Avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/popover/Popover';
import { usePointRewardContext } from '@/app/context/pointreward/PointRewardContext';
import BackerLeaderboardLoader from '@/app/loaders/BackerLeaderboardLoader';
import { deslugify } from '@/app/utils/helpers/categories';
import {
  getCupIcon,
  getVerifiedBadge,
} from '@/app/utils/helpers/get.level.trophy';
import { getRankWithSuffix } from '@/app/utils/helpers/ranking.suffix';
import React, { useEffect } from 'react';
import LeaderboardChart from './LeaderboardChart';
import { Card } from '@material-tailwind/react'; // Import only what's needed

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
        <div className="px-4 py-3 mb-8">
          {loading ? (
            <BackerLeaderboardLoader />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No change makers yet. Be the first philanthropist!
            </p>
          ) : (
            <Card className="overflow-x-auto shadow-none rounded-none">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-gray-800 text-sm font-medium text-left">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-gray-800 text-sm font-medium text-left">
                      User
                    </th>
                    <th className="px-4 py-3 text-gray-800 text-sm font-medium text-left">
                      Backed
                    </th>
                    <th className="px-4 py-3 text-gray-800 text-sm font-medium text-left">
                      Score
                    </th>
                    <th className="px-4 py-3 text-gray-800 text-sm font-medium text-left">
                      Trophy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((backer) => (
                    <tr key={backer.id}>
                      <td className="px-4 py-2 text-gray-600 bg-gray-50">
                        {getRankWithSuffix(backer.rank)}
                      </td>
                      <td className="px-4 py-2 flex items-center space-x-3 bg-white">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="relative cursor-pointer">
                              <Avatar
                                name={backer.username}
                                size="sm"
                                imageUrl={backer.profile_picture}
                              />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4 shadow-lg">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <Avatar
                                  name={backer.username}
                                  size="xl"
                                  imageUrl={backer.profile_picture}
                                />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {backer.username}
                                    </h4>
                                    <span>
                                      {getVerifiedBadge(backer.level, 20)}
                                    </span>
                                  </div>
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
                        <div className="flex items-center gap-1">
                          <span className="text-gray-700">
                            {backer.username}
                          </span>
                          <span>{getVerifiedBadge(backer.level, 16)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-700 bg-gray-50">
                        {backer?.currency?.toUpperCase()}{' '}
                        {Number(backer?.total_donations || 0).toFixed(2) ||
                          'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700 bg-white">
                        {backer.score || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700 bg-gray-50 flex items-center gap-2">
                        {getCupIcon(backer.level)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Leaderboard Chart */}
        {!loading && leaderboard.length > 0 && (
          <LeaderboardChart leaderboard={leaderboard} />
        )}

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
                You can track your progress on your account on reward dashboard.
                This will show your current rank and how much money you've
                contributed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                What happens if I make the leaderboard?
              </h3>
              <p className="text-sm">
                If you make the leaderboard, you'll unlock a special badge on
                your profile and depending on the points you make, you can
                unlock a special certificate of honor. You'll also be recognized
                globally as a philanthropist. This is a great way to show our
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
