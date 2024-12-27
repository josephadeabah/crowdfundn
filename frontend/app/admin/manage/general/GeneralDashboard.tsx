import { useMetricsContext } from '@/app/context/admin/metrics/MetricsContext';
import React, { useEffect } from 'react';
import { FaDollarSign, FaUsers, FaHeartbeat } from 'react-icons/fa';

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
      value: `$${metrics?.donations.total_amount}`,
      icon: <FaDollarSign className="text-lg text-blue-500" />,
    },
    {
      title: 'Total Users',
      value: `${metrics?.users.total}`,
      icon: <FaUsers className="text-lg text-blue-500" />,
    },
    {
      title: 'Active Campaigns',
      value: `${metrics?.campaigns.active}`,
      icon: <FaHeartbeat className="text-lg text-blue-500" />,
    },
    {
      title: 'Average Donation',
      value: `$${metrics?.donations.average_donation ? parseFloat(metrics.donations.average_donation).toFixed(2) : '0.00'}`,
      icon: <FaDollarSign className="text-lg text-blue-500" />,
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
                  Goal: ${campaign.goal_amount} | Amount Raised: $
                  {campaign.transferred_amount}
                </p>
                <p>Performance: {campaign.performance_percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-left">
            Donations Over Time
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg text-left">
            <div className="text-lg font-bold">Donations Over Time</div>
            <div>
              {Object.entries(metrics?.donations.donations_over_time || {}).map(
                ([date, amount]) => (
                  <div key={date} className="mb-2">
                    <p>
                      {date}: ${amount}
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
          <div className="font-semibold">
            Active Users: {metrics?.users.active}
          </div>
          <div className="font-semibold">
            Email Confirmation Rate: {metrics?.users.email_confirmation_rate}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
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
                  {country}: ${donation}
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
          <div className="font-semibold">
            Active Subscriptions: {metrics?.subscriptions.active}
          </div>
          <div className="font-semibold">
            MRR: ${metrics?.subscriptions.mrr}
          </div>
          <div className="font-semibold">
            Churn Rate: {metrics?.subscriptions.churn_rate}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
