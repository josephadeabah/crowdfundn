import { useMetricsContext } from '@/app/context/admin/metrics/MetricsContext';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
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
      tooltip: 'The total amount donated across all campaigns.',
      tooltipId: 'tooltip-total-donations',
    },
    {
      title: 'Total Users',
      value: `${metrics?.users.total}`,
      tooltip: 'The total number of users registered on the platform.',
      tooltipId: 'tooltip-total-users',
    },
    {
      title: 'Active Campaigns',
      value: `${metrics?.campaigns.active}`,
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
              <FaInfoCircle
                data-tooltip-id={card.tooltipId}
                data-tooltip-content={card.tooltip}
                className="text-gray-400 text-sm cursor-pointer mr-2"
              />
              <Tooltip
                id={card.tooltipId}
                className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded"
              />
              <h2 className="text-xl font-semibold">{card.title}</h2>
            </div>
            <p className="text-2xl font-bold text-left">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-left">
            Top {metrics?.campaigns.top_performing.length} Performing Campaigns
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg text-left">
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

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">
          User Engagement
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-active-users"
              data-tooltip-content="The number of users who signed in at least once in the past 7 days."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-active-users"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Active Users: {metrics?.users.active}
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-email-confirmation-rate"
              data-tooltip-content="The percentage of users who have confirmed their email addresses."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-email-confirmation-rate"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Email Confirmation Rate: {metrics?.users.email_confirmation_rate}%
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-average-logins"
              data-tooltip-content="The average number of logins per user."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-average-logins"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Average Logins: {metrics?.engagement.average_logins || '0'}
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-time-to-first-action"
              data-tooltip-content="The average time it takes a user to create a campaign after signing up."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-time-to-first-action"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Time to First Action:{' '}
            {metrics?.engagement.time_to_first_action
              ? moment
                  .duration(metrics.engagement.time_to_first_action, 'seconds')
                  .humanize()
              : 'N/A'}
          </div>
        </div>
      </div>

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

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">
          Subscription Info
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-active-subscriptions"
              data-tooltip-content="The number of currently active subscriptions."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-active-subscriptions"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Active Subscriptions: {metrics?.subscriptions.active}
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-mrr"
              data-tooltip-content="Monthly Recurring Revenue (MRR) from subscriptions in the last month."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-mrr"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            MRR: GHS{metrics?.subscriptions.mrr}
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-churn-rate"
              data-tooltip-content="The percentage of canceled subscriptions over the last month."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-churn-rate"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Churn Rate: {metrics?.subscriptions.churn_rate}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-left">Subaccounts</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-total-subaccounts"
              data-tooltip-content="The total number of subaccounts created."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-total-subaccounts"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Total Subaccounts: {metrics?.subaccounts.total}
          </div>
          <div className="font-semibold flex items-center justify-start">
            <FaInfoCircle
              data-tooltip-id="tooltip-success-rate"
              data-tooltip-content="The percentage of subaccounts successfully verified."
              className="text-gray-400 text-sm cursor-pointer mr-2"
            />
            <Tooltip
              id="tooltip-success-rate"
              className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded z-10"
            />
            Success Rate: {metrics?.subaccounts.success_rate}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
