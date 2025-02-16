import React, { useContext, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/card/Card';
import { HiOutlinePlus } from 'react-icons/hi';
import Link from 'next/link';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useAuth } from '../context/auth/AuthContext';
import MainDashboardLoader from '../loaders/MainDashboardLoader';
import ErrorPage from '../components/errorpage/ErrorPage';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { deslugify } from '../utils/helpers/categories';
import moment from 'moment'; // Import moment

export default function Dashboard() {
  const { statistics, loading, error, fetchCampaignStatistics } =
    useCampaignContext();
  const { user } = useAuth();

  // Fetch statistics data when the component mounts
  useEffect(() => {
    fetchCampaignStatistics();
  }, [fetchCampaignStatistics]);

  // Display a loading state if data is still being fetched
  if (loading) {
    return <MainDashboardLoader />;
  }

  // Display an error message if there was an error fetching data
  if (error) {
    return <ErrorPage />;
  }

  // Format donations over time for Recharts
  const donationsOverTimeData = Object.entries(
    statistics?.donations_over_time || {},
  ).map(([date, amount]) => ({
    date: moment(date).format('MMM D'), // Format date using moment
    amount: parseFloat(amount as string),
  }));

  // Format campaigns by category for Recharts
  const campaignsByCategoryData = Object.entries(
    statistics?.campaigns_by_category || {},
  ).map(([category, count]) => ({
    name: deslugify(category),
    value: count,
  }));

  // Format campaign performance for Recharts
  const campaignPerformanceData = statistics?.campaign_performance?.map(
    (campaign) => ({
      name: campaign.title,
      performance: parseFloat(campaign.performance_percentage),
      totalDays: campaign.total_days,
      remainingDays: campaign.remaining_days,
    }),
  );

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Colors for the bars
  const barColors = ['#8884d8', '#82ca9d', '#ffc658'];

  // Custom Tooltip for Top Campaigns Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <p className="font-semibold">{label}</p>
          <p>Performance: {payload[0].value}%</p>
          <p>Total Days: {payload[0].payload.totalDays}</p>
          <p>Remaining Days: {payload[0].payload.remainingDays}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-2 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        View insights, manage your activities, and track performance all in one
        place.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 flex flex-col items-center justify-center">
          <CardHeader className="text-center"></CardHeader>
          <Link
            href="/account/dashboard/create"
            className="text-lg font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            <div className="mt-4 flex flex-col items-center">
              <HiOutlinePlus className="text-4xl text-green-500 dark:text-green-300 mb-2" />
              Add Campaign
            </div>
          </Link>
        </Card>

        {/* Total Backers Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Backers
            </CardTitle>
            <CardDescription className="text-purple-500 dark:text-purple-400">
              {statistics?.total_backers} Backers
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Fundraising Goal Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Fundraising Goal
            </CardTitle>
            <CardDescription className="text-yellow-500 dark:text-yellow-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics &&
                parseFloat(statistics.total_fundraising_goal).toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Active Campaigns Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Active Campaigns
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              {statistics?.total_active_campaigns} Campaigns
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Total Donations Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Donations
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics &&
                parseFloat(
                  statistics.total_donations_received,
                ).toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Pending Withdrawals Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Pending Withdrawals
            </CardTitle>
            <CardDescription className="text-yellow-600 dark:text-yellow-300">
              {user?.currency?.toUpperCase()}{' '}
              {statistics &&
                parseFloat(statistics?.total_donated_amount).toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recent Activity Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-purple-500 dark:text-purple-400">
              {statistics?.new_donations_this_week &&
                Object.keys(statistics?.new_donations_this_week).length}{' '}
              new donations this week
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Campaign Performance Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Performance Across Campaigns
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-400">
              {statistics?.total_performance_percentage}% of goal achieved
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Boost Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-gray-400">
              <InfoCircledIcon className="text-xl" />
              <span>Attention</span>
            </CardTitle>

            <CardDescription className="text-zinc-500 dark:text-neutral-400">
              You must withdraw your funds in chunks as you fundraise. Learn
              more{' '}
              <a
                href="/articles/how-to-withdraw-funds"
                target="_blank"
                className="no-underline text-blue-400"
              >
                about withdrawals
              </a>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Metrics Grid */}
        <Card className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Campaign Overview
            </CardTitle>
          </CardHeader>
          <CardDescription>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: 'Total Rewards Claimed',
                  value: statistics?.total_rewards_claimed,
                  color: 'text-purple-500 dark:text-purple-400',
                },
                {
                  label: 'Total Shares Across Campaigns',
                  value: statistics?.total_campaign_shares,
                  color: 'text-blue-500 dark:text-blue-400',
                },
                {
                  label: 'Total Comments Across Campaigns',
                  value: statistics?.total_comments,
                  color: 'text-green-500 dark:text-green-400',
                },
                {
                  label: 'Total Updates Across Campaigns',
                  value: statistics?.total_updates,
                  color: 'text-yellow-500 dark:text-yellow-400',
                },
                {
                  label: 'Total Bookmarks Across Campaigns',
                  value: statistics?.total_favorites,
                  color: 'text-red-500 dark:text-red-400',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 dark:bg-neutral-700 rounded-lg w-full flex justify-between items-center"
                >
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardDescription>
        </Card>
        {/* Campaigns by Category Chart */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Campaigns by Category
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={campaignsByCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {campaignsByCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => `${value} Campaigns in ${name}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* Donations Over Time Chart */}
      <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Donations Over Time
          </CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={donationsOverTimeData}
            margin={{
              top: 30, // Increase from 5 to 30
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) =>
                `${user?.currency?.toUpperCase()} ${value}`
              }
            />
            <Tooltip
              formatter={(value) => `${user?.currency?.toUpperCase()} ${value}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      {/* Campaign Performance Chart */}
      <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={campaignPerformanceData}
            margin={{
              top: 30, // Increase from 5 to 30
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="performance" fill={barColors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
