import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/card/Card';
import { HiOutlinePlus } from 'react-icons/hi';
import Link from 'next/link';

export default function DashboardLoader() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-red-300">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200 flex flex-col items-center justify-center">
          <CardHeader className="text-center"></CardHeader>
          <Link
            href="/account/dashboard/create"
            className="text-lg font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            <div className="mt-4 flex flex-col items-center">
              <Skeleton circle height={60} width={60} />
              <Skeleton width={80} height={20} className="mt-2" />
            </div>
          </Link>
        </Card>

        {/* Total Backers Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-purple-500 dark:text-purple-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Fundraising Goal Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-yellow-500 dark:text-yellow-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Active Campaigns Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-neutral-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Total Donations Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Pending Withdrawals Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-yellow-600 dark:text-yellow-300">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recent Activity Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-purple-500 dark:text-purple-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Campaign Performance Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-green-500 dark:text-green-400">
              <Skeleton width={50} />
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Boost Campaign Card */}
        <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow hover:bg-gray-100 transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              <Skeleton width={150} />
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-neutral-400">
              <Skeleton width={100} />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
