import { useMetricsContext } from '@/app/context/admin/metrics/MetricsContext';
import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const GeneralDashboard = () => {
  const { metrics, loading, error, fetchMetrics } = useMetricsContext();
  const [filter, setFilter] = useState('daily');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      icon: <FaDollarSign />,
    },
    {
      title: 'Total Users',
      value: `${metrics?.users.total}`,
      icon: <FaUsers />,
    },
    {
      title: 'Active Campaigns',
      value: `${metrics?.campaigns.active}`,
      icon: <FaHeartbeat />,
    },
    {
      title: 'Average Donation',
      value: `$${(parseFloat(metrics?.donations.average_donation) ?? 0).toFixed(2)}`,
      icon: <FaDollarSign />,
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">General Dashboard</h1>

      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <label htmlFor="filter" className="mr-2">
            Filter by:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="w-5 h-5 text-gray-500" />
            </span>
            <input
              className="w-32 sm:w-64 rounded-md pl-10 pr-4 py-2 border border-gray-200 text-sm text-gray-300 focus:outline-none focus:border-gray-500"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <span className="text-3xl text-blue-500">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
          <div className="bg-gray-200 p-6 rounded-lg text-center">
            {/* Placeholder for bar chart */}
            {/* Ideally, you would use a chart library to visualize the campaign data */}
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
          <h2 className="text-xl font-semibold mb-4">Donations Over Time</h2>
          <div className="bg-gray-200 p-6 rounded-lg text-center">
            {/* Placeholder for line chart */}
            <div className="text-lg font-bold">Donations Over Time</div>
            {/* Ideally, you would use a chart library to visualize the donations data */}
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
        <h2 className="text-xl font-semibold mb-4">User Engagement</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-center">
          <div className="font-semibold">
            Active Users: {metrics?.users.active}
          </div>
          <div className="font-semibold">
            Email Confirmation Rate: {metrics?.users.email_confirmation_rate}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Geography</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-center">
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
        <h2 className="text-xl font-semibold mb-4">Subscription Info</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-center">
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
