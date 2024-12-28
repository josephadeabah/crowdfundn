import { useMetricsContext } from '@/app/context/admin/metrics/MetricsContext';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FaDollarSign, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const GeneralDashboard = () => {
  const { metrics, loading, error, fetchMetrics } = useMetricsContext();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const cardData = [
    {
      title: 'Total Donations',
      value: `${
        metrics?.donations.total_amount
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'GHS',
            }).format(parseFloat(metrics.donations.total_amount))
          : '0.00'
      }`,
      icon: <FaDollarSign className="text-sm text-blue-500" />,
      tooltip: 'The total amount donated across all campaigns.',
      tooltipId: 'tooltip-total-donations',
    },
    {
      title: 'Total Users',
      value: `${metrics?.users.total}`,
      icon: <FaUsers className="text-sm text-blue-500" />,
      tooltip: 'The total number of users registered on the platform.',
      tooltipId: 'tooltip-total-users',
    },
    {
      title: 'Active Campaigns',
      value: `${metrics?.campaigns.active}`,
      icon: <FaHeartbeat className="text-sm text-blue-500" />,
      tooltip: 'The number of campaigns currently marked as "active."',
      tooltipId: 'tooltip-active-campaigns',
    },
    {
      title: 'Average Donation',
      value: `${
        metrics?.donations.average_donation
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'GHS',
            }).format(parseFloat(metrics.donations.average_donation))
          : '0.00'
      }`,
      icon: <FaDollarSign className="text-sm text-blue-500" />,
      tooltip: 'The average amount of a single donation.',
      tooltipId: 'tooltip-average-donation',
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-left">General Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-start mb-4">
              {card.icon}
              <h2 className="text-xl font-semibold ml-2">{card.title}</h2>
              <Tooltip id={card.tooltipId} content={card.tooltip}>
                <span className="ml-2 text-gray-400 text-sm">?</span>
              </Tooltip>
            </div>
            <p className="text-2xl font-bold text-left">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-left">
            Campaign Performance
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg text-left">
            <div className="text-lg font-bold">Top Performing Campaigns</div>
            {metrics?.campaigns.top_performing.map((campaign) => (
              <div key={campaign.id} className="mb-2">
                <p className="font-semibold">{campaign.name}</p>
                <p>
                  Goal: GHS{campaign.goal_amount} | Amount Raised: GHS
                  {campaign.transferred_amount}
                </p>
                <p>Performance: {campaign.performance_percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-left">
            Donations Weekly
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg text-left">
            <div>
              {Object.entries(metrics?.donations.donations_over_time || {}).map(
                ([date, amount]) => (
                  <div key={date} className="mb-2">
                    <p>
                      {moment(date).format('MMM DD, YYYY')}: GHS
                      {amount}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      {/* User Engagement */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">
          User Engagement
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold">
            Active Users: {metrics?.users.active}
            <Tooltip
              id="tooltip-active-users"
              content="The number of users who signed in at least once in the past 7 days."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            Email Confirmation Rate: {metrics?.users.email_confirmation_rate}%
            <Tooltip
              id="tooltip-email-confirmation-rate"
              content="The percentage of users who have confirmed their email addresses."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            Average Logins: {metrics?.engagement.average_logins || '0'}
            <Tooltip
              id="tooltip-average-logins"
              content="The average number of logins per user."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            Time to First Action:{' '}
            {metrics?.engagement.time_to_first_action
              ? moment
                  .duration(metrics.engagement.time_to_first_action, 'seconds')
                  .humanize()
              : 'N/A'}
            <Tooltip
              id="tooltip-time-to-first-action"
              content="The average time it takes a user to create a campaign after signing up."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Geography Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">Geography</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="text-lg font-bold">Users by Country</div>
          <ul>
            {Object.entries(metrics?.geography.users_by_country || {}).map(
              ([country, count]) => (
                <li key={country}>
                  {country}: {count}
                </li>
              ),
            )}
          </ul>
          <div className="text-lg font-bold mt-4">
            Top Countries by Donations
          </div>
          <ul>
            {metrics?.geography.top_countries_by_donations.map(
              ([country, donation]) => (
                <li key={country}>
                  {country}: GHS{donation}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* Subscription Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">
          Subscription Info
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold">
            Active Subscriptions: {metrics?.subscriptions.active}
            <Tooltip
              id="tooltip-active-subscriptions"
              content="The number of currently active subscriptions."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            MRR: GHS{metrics?.subscriptions.mrr}
            <Tooltip
              id="tooltip-mrr"
              content="Monthly Recurring Revenue (MRR) from subscriptions in the last month."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            Churn Rate: {metrics?.subscriptions.churn_rate}%
            <Tooltip
              id="tooltip-churn-rate"
              content="The percentage of canceled subscriptions over the last month."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Subaccounts Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-left">Subaccounts</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold">
            Total Subaccounts: {metrics?.subaccounts.total}
            <Tooltip
              id="tooltip-total-subaccounts"
              content="The total number of subaccounts created."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
          <div className="font-semibold">
            Success Rate: {metrics?.subaccounts.success_rate}%
            <Tooltip
              id="tooltip-success-rate"
              content="The percentage of successful subaccount setups."
            >
              <span className="ml-2 text-gray-400 text-sm">?</span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
