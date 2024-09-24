import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/card/Card';
import { HiOutlinePlus } from 'react-icons/hi';

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-red-300">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 flex flex-col items-center justify-center">
          <CardHeader className="text-center"></CardHeader>
          <div className="mt-4 flex flex-col items-center">
            <HiOutlinePlus className="text-4xl text-green-500 dark:text-green-300 mb-2" />
            <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Add Campaign
            </span>
          </div>
        </Card>

        {/* Total Backers Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Total Backers
            </CardTitle>
            <CardDescription className="text-purple-500 dark:text-purple-400">
              150 Backers
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
              $25,000
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
              3 Campaigns
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
              $12,300
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
              $2,400
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
              5 new donations this week
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Campaign Performance Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-400">
              75% of goal achieved
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Boost Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Boost Your Campaign
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-neutral-400">
              Reach more people with targeted promotions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
