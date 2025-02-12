'use client';
import Avatar from '@/app/components/avatar/Avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/popover/Popover';
import { LeaderboardEntry, usePointRewardContext } from '@/app/context/pointreward/PointRewardContext';
import BackerLeaderboardLoader from '@/app/loaders/BackerLeaderboardLoader';
import { deslugify } from '@/app/utils/helpers/categories';
import {
  getCupIcon,
  getVerifiedBadge,
} from '@/app/utils/helpers/get.level.trophy';
import { getRankWithSuffix } from '@/app/utils/helpers/ranking.suffix';
import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CustomizedDot = (props: { cx: any; cy: any; stroke: any; payload: any; value: any; }) => {
  const { cx, cy, stroke, payload, value } = props;

  if (value > 2500) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="red" viewBox="0 0 1024 1024">
        <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
      </svg>
    );
  }

  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">
      <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
    </svg>
  );
};

const LeaderboardChart = ({ leaderboard }: any) => {
  // Transform leaderboard data for the chart
  const chartData = leaderboard.map((backer: { rank: number; score: any; total_donations: any; }) => ({
    rank: getRankWithSuffix(backer.rank), // Use rank as the X-axis label
    score: backer.score, // Use score as one data line
    totalDonations: Number(backer.total_donations || 0), // Use total donations as another data line
  }));

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rank" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            dot={<CustomizedDot cx={undefined} cy={undefined} stroke={undefined} payload={undefined} value={undefined} />}
          />
          <Line
            type="monotone"
            dataKey="totalDonations"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
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
            <BackerLeaderboardLoader />
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
                      <td className="px-4 py-2 text-gray-700">
                        {backer?.currency?.toUpperCase()}{' '}
                        {Number(backer?.total_donations || 0).toFixed(2) ||
                          'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {backer.score || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-700 flex items-center gap-2">
                        {getCupIcon(backer.level)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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