// app/account/dashboard/page.tsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/card/Card';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useAuth } from '../context/auth/AuthContext';
import MainDashboardLoader from '../loaders/MainDashboardLoader';
import ErrorPage from '../components/errorpage/ErrorPage';
import DonationByCountryCharts from '../components/charts/DonationByCountryChart';
import {
  Users,
  Target,
  Activity,
  BarChart2,
  TrendingUp,
  PieChart as PieChartIcon,
  Heart,
  TrendingUp as TrendingUpIcon,
  Coins,
} from 'lucide-react';
import { CampaignsByCategoryChart } from '../components/charts/CampaignsByCategoryChart';
import { FundingOverTimeChart } from '../components/charts/FundingOverTimeChart';
import { CampaignPerformanceChart } from '../components/charts/CampaignPerformanceChart';
// import BlurredChartContainer from '@/app/components/premiumplaceholder/BlurredChartContainer ';

export default function Dashboard() {
  const { statistics, loading, error, fetchCampaignStatistics } =
    useCampaignContext();
  const { user } = useAuth();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  useEffect(() => {
    setHasPremiumAccess(user?.subscription?.isActive || false);
  }, [user]);

  useEffect(() => {
    fetchCampaignStatistics();
  }, [fetchCampaignStatistics]);

  if (loading) {
    return <MainDashboardLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="px-2 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        View insights and track performance all in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Donations Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-blue-50 p-2 rounded-full">
            <Heart className="h-5 w-5 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Donations
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics?.donations?.total_amount?.toLocaleString() || '0'}
            </CardDescription>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {statistics?.donations?.count || '0'} donations
            </p>
          </CardHeader>
        </Card>

        {/* Total Investments Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-green-50 p-2 rounded-full">
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Investments
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics?.investments?.total_amount?.toLocaleString() || '0'}
            </CardDescription>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {statistics?.investments?.count || '0'} investments
            </p>
          </CardHeader>
        </Card>

        {/* Total Funding Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-purple-50 p-2 rounded-full">
            <Coins className="h-5 w-5 text-purple-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Funding
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics?.total_funds_raised?.toLocaleString() || '0'}
            </CardDescription>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Combined donations & investments
            </p>
          </CardHeader>
        </Card>

        {/* Total Backers Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-emerald-50 p-2 rounded-full">
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Backers
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {statistics?.total_backers} Supporters
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Fundraising Goal Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-orange-50 p-2 rounded-full">
            <Target className="h-5 w-5 text-orange-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Fundraising Goal
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics?.total_fundraising_goal?.toLocaleString() || '0'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Active Campaigns Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-gray-50 p-2 rounded-full">
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Active Campaigns
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              {statistics?.total_active_campaigns} Campaigns
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recent Activity Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-purple-50 p-2 rounded-full">
            <BarChart2 className="h-5 w-5 text-purple-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {statistics?.new_funding_this_week &&
                Object.keys(statistics.new_funding_this_week).length}{' '}
              new funding this week
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Campaign Performance Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-amber-50 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Performance Across Campaigns
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-500">
              {statistics?.total_performance_percentage}% of goal achieved
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Average Funding Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 relative">
          <div className="absolute top-2 right-2 bg-lime-50 p-2 rounded-full">
            <PieChartIcon className="h-5 w-5 text-lime-500" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Average Funding
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              {user?.currency?.toUpperCase()}{' '}
              {statistics?.average_funding_amount?.toLocaleString() || '0'}
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
                  <span className="text-base font-semibold text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className={`text-base font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardDescription>
        </Card>
        <CampaignsByCategoryChart
          statistics={statistics}
          user={user}
          fetchCampaignStatistics={fetchCampaignStatistics}
        />
      </div>

      {/* Funding over time chart */}
      <FundingOverTimeChart
        statistics={statistics}
        user={user}
        fetchCampaignStatistics={fetchCampaignStatistics}
      />

      {/* Campaign Performance Chart */}
      <CampaignPerformanceChart
        statistics={statistics}
        user={user}
        fetchCampaignStatistics={fetchCampaignStatistics}
      />

      {/* Funding by Country Chart */}
      <DonationByCountryCharts
        statistics={statistics}
        fetchCampaignStatistics={fetchCampaignStatistics}
      />

      {/* Equity Campaigns Section (if available) */}
      {statistics?.equity_campaigns &&
        statistics.equity_campaigns.total > 0 && (
          <Card className="p-6 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Equity Campaigns Overview
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                  Total Equity Campaigns
                </h3>
                <p className="text-2xl font-bold text-blue-500">
                  {statistics.equity_campaigns.total}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-green-600 dark:text-green-400">
                  Active Equity Campaigns
                </h3>
                <p className="text-2xl font-bold text-green-500">
                  {statistics.equity_campaigns.active}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-purple-600 dark:text-purple-400">
                  Total Equity Raised
                </h3>
                <p className="text-2xl font-bold text-purple-500">
                  {user?.currency?.toUpperCase()}{' '}
                  {statistics.equity_campaigns.total_funds_raised?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}
    </div>
  );
}