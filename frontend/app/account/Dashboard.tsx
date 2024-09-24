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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Active Campaigns
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              3 Campaigns
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Total Donations
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              $12,300
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Pending Withdrawals
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              $2,400
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 flex flex-col items-center justify-center">
          <CardHeader className="text-center"></CardHeader>
          <div className="mt-4 flex flex-col items-center">
            <HiOutlinePlus className="text-4xl text-gray-400 dark:text-gray-300 mb-2" />
            <span className="text-lg font-semibold text-gray-700 dark:text-white">
              Add Campaign
            </span>
          </div>
        </Card>

        {/* New Cards for Additional Features */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Total Backers
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              150 Backers
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Fundraising Goal
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              $25,000
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              5 new donations this week
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              75% of goal achieved
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Boost Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
              Boost Your Campaign
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              Reach more people with targeted promotions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
