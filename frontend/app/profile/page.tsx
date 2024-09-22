'use client';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/card/Card';
import { HiOutlinePlus } from 'react-icons/hi';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Active Campaigns
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    3 Campaigns
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Total Donations
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    $12,300
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Pending Withdrawals
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    $2,400
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md flex flex-col items-center justify-center">
                <CardHeader className="text-center"></CardHeader>
                <div className="mt-4 flex flex-col items-center">
                  <HiOutlinePlus className="text-4xl text-gray-400 dark:text-gray-300 mb-2" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-white">
                    Add Campaign
                  </span>
                </div>
              </Card>

              {/* New Cards for Additional Features */}
              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Total Backers
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    150 Backers
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Fundraising Goal
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    $25,000
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    5 new donations this week
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md">
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
              <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700 dark:text-white">
                    Boost Your Campaign
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-neutral-400">
                    Reach more people with targeted promotions.{' '}
                    <span className="text-xs text-green-400 font-semibold">
                      Active campaign
                    </span>
                  </CardDescription>
                </CardHeader>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
                    Boost Now
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'Donations':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Donations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sample Donation Cards */}
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  John Doe
                </h3>
                <p className="text-gray-600 dark:text-neutral-300">
                  Amount: $500
                </p>
                <p className="text-gray-500 dark:text-neutral-400">
                  Date: Aug 20, 2024
                </p>
                <p className="text-green-500 dark:text-green-400">
                  Status: Completed
                </p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  Thank You
                </button>
              </div>

              {/* Additional Donation Cards */}
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Jane Smith
                </h3>
                <p className="text-gray-600 dark:text-neutral-300">
                  Amount: $300
                </p>
                <p className="text-gray-500 dark:text-neutral-400">
                  Date: Aug 18, 2024
                </p>
                <p className="text-green-500 dark:text-green-400">
                  Status: Completed
                </p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  Thank You
                </button>
              </div>

              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Jane Smith
                </h3>
                <p className="text-gray-600 dark:text-neutral-300">
                  Amount: $300
                </p>
                <p className="text-gray-500 dark:text-neutral-400">
                  Date: Aug 18, 2024
                </p>
                <p className="text-green-500 dark:text-green-400">
                  Status: Completed
                </p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                  Thank You
                </button>
              </div>

              {/* Add more donation cards as needed */}
            </div>
          </div>
        );

      case 'Transfers':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Transfers
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Review your transfer history or request new transfers.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700 mb-6">
              Request Transfer
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Payout Card */}
              <div className="p-4 bg-offwhite rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Payout
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Total: $3,500
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Pending: $1,200
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Completed: $2,300
                </p>
              </div>

              {/* Activity Card */}
              <div className="p-4 bg-offwhite rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Activity
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Mobile Money</span>
                    <span>$1,200</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bank Transfer</span>
                    <span>$1,500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Digital Payment (PayPal)</span>
                    <span>$800</span>
                  </li>
                </ul>
              </div>

              {/* Breakdown Card */}
              <div className="p-4 bg-offwhite rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Breakdown
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Mobile Money Fees</span>
                    <span className="text-red-500">-$50</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Bank Transfer Fees</span>
                    <span className="text-red-500">-$30</span>
                  </li>
                  <li className="flex justify-between">
                    <span>PayPal Fees</span>
                    <span className="text-red-500">-$20</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Transaction History Table */}
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Transaction History
              </h3>
              <table className="min-w-full table-auto bg-white dark:bg-neutral-800 rounded-lg">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      $1,200
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      Aug 15, 2024
                    </td>
                    <td className="px-4 py-2 text-yellow-500 dark:text-yellow-400">
                      Pending
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      $1,500
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      Aug 10, 2024
                    </td>
                    <td className="px-4 py-2 text-green-500 dark:text-green-400">
                      Completed
                    </td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Rewards':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Your Rewards for Donors
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-6">
              Offer exciting rewards to your supporters and engage them in your
              campaign.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Rewards You Can Offer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Personalized Thank You Video
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For donations over $20
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Send a heartfelt video message to your supporters expressing
                  gratitude.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Exclusive Merchandise
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For donations over $50
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Provide exclusive campaign merchandise such as T-shirts or
                  stickers.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  VIP Event Access
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For donations over $100
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Invite supporters to exclusive events where they can meet you
                  and others.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Early Bird Discounts
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For donations over $150
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Offer discounts on future products or campaigns to your top
                  supporters.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-8 mb-4">
              Platform-Supported Rewards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Gamification Badge
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For any donation
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Automatically earn a digital badge for each contribution to
                  showcase your support.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Community Recognition
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For any donation
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Receive shout-outs on our platform for your generosity.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg shadow-md">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Special Updates
                </h4>
                <p className="text-gray-500 dark:text-neutral-400">
                  For any donation
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  Get exclusive updates and insights about the campaign.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Campaigns':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Campaigns
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Manage your active and past campaigns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Active Campaign 1
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Ongoing fundraising for community development.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Active Campaign 2
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Fundraising for educational supplies.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Past Campaign 1
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Successfully funded school supplies.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Past Campaign 2
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Community park renovation completed.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Updates':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Post Updates
            </h2>
            <p className="text-gray-500 dark:text-neutral-400 mb-4">
              Share the latest updates with your backers.
            </p>
            <textarea
              className="w-full p-3 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-red-500"
              rows={1}
              placeholder="Write your update here..."
            ></textarea>
            <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
              Post Update
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-screen">
      {/* Tabs Menu */}
      <div className="w-full md:w-[15%] border-b md:border-b-0 md:border-r-2 border-dashed border-red-200 dark:border-neutral-700">
        <nav
          className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible"
          aria-label="Tabs"
          role="tablist"
        >
          {[
            'Dashboard',
            'Donations',
            'Transfers',
            'Rewards',
            'Campaigns',
            'Updates',
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`py-2 px-3 whitespace-nowrap text-sm font-medium md:text-base ${activeTab === tab ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-4 md:border-r-0 border-red-200 text-red-600 dark:text-red-600' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-500'} flex items-center focus:outline-none`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              aria-controls={`vertical-tab-${tab}`}
              role="tab"
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="w-full p-4 md:m-3 overflow-auto flex-1">
        <div
          role="tabpanel"
          id={`vertical-tab-${activeTab}`}
          className="h-full"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
