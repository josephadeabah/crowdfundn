import {
  Metrics,
  useMetricsContext,
} from '@/app/context/admin/metrics/MetricsContext';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const GeneralDashboard = () => {
  const { metrics, loading, error, fetchMetrics } = useMetricsContext();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const convertToCSV = (metrics: Metrics | null): string => {
    if (!metrics) return '';

    const csvRows = [];

    // Add headers
    csvRows.push('Category,Key,Value');

    // Users
    csvRows.push(`Users,Total,${metrics.users.total}`);
    csvRows.push(`Users,New Last Week,${metrics.users.new_last_week}`);
    csvRows.push(`Users,Active,${metrics.users.active}`);
    csvRows.push(
      `Users,Email Confirmation Rate,${metrics.users.email_confirmation_rate}`,
    );

    // Campaigns
    csvRows.push(`Campaigns,Total,${metrics.campaigns.total}`);
    csvRows.push(`Campaigns,Active,${metrics.campaigns.active}`);
    csvRows.push(
      `Campaigns,Average Goal Amount,${metrics.campaigns.average_goal_amount}`,
    );
    csvRows.push(
      `Campaigns,Average Current Amount,${metrics.campaigns.average_current_amount}`,
    );
    csvRows.push(
      `Campaigns,Performance Percentage,${metrics.campaigns.performance_percentage}`,
    );
    csvRows.push(
      `Campaigns,Average Donors Per Campaign,${metrics.campaigns.average_donors_per_campaign}`,
    );

    // Donations
    csvRows.push(`Donations,Total Amount,${metrics.donations.total_amount}`);
    csvRows.push(
      `Donations,Average Donation,${metrics.donations.average_donation}`,
    );
    csvRows.push(`Donations,Repeat Donors,${metrics.donations.repeat_donors}`);

    // Platform Fees
    csvRows.push(`Platform Fees,Total,${metrics.platform_fees}`);

    // Subscriptions
    csvRows.push(`Subscriptions,Active,${metrics.subscriptions.active}`);
    csvRows.push(`Subscriptions,MRR,${metrics.subscriptions.mrr}`);
    csvRows.push(
      `Subscriptions,Churn Rate,${metrics.subscriptions.churn_rate}`,
    );

    // Geography
    Object.entries(metrics.geography.users_by_country).forEach(
      ([country, count]) => {
        csvRows.push(`Geography,Users by Country - ${country},${count}`);
      },
    );

    metrics.geography.top_countries_by_donations.forEach(
      ([country, donation]) => {
        csvRows.push(
          `Geography,Top Countries by Donations - ${country},${donation}`,
        );
      },
    );

    // Engagement
    csvRows.push(
      `Engagement,Average Logins,${metrics.engagement.average_logins}`,
    );
    csvRows.push(
      `Engagement,Time to First Action,${metrics.engagement.time_to_first_action}`,
    );

    // Subaccounts
    csvRows.push(`Subaccounts,Total,${metrics.subaccounts.total}`);
    csvRows.push(
      `Subaccounts,Success Rate,${metrics.subaccounts.success_rate}`,
    );

    // Equity Campaigns
    csvRows.push(`Equity Campaigns,Total,${metrics.equity_campaigns.total}`);
    csvRows.push(`Equity Campaigns,Active,${metrics.equity_campaigns.active}`);
    csvRows.push(
      `Equity Campaigns,Total Valuation,${metrics.equity_campaigns.total_valuation}`,
    );
    csvRows.push(
      `Equity Campaigns,Total Equity Offered,${metrics.equity_campaigns.total_equity_offered}`,
    );
    csvRows.push(
      `Equity Campaigns,Total Funds Raised,${metrics.equity_campaigns.total_funds_raised}`,
    );
    csvRows.push(
      `Equity Campaigns,Average Valuation,${metrics.equity_campaigns.average_valuation}`,
    );
    csvRows.push(
      `Equity Campaigns,Average Equity Offered,${metrics.equity_campaigns.average_equity_offered}`,
    );

    Object.entries(metrics.equity_campaigns.status_distribution).forEach(
      ([status, count]) => {
        csvRows.push(
          `Equity Campaigns,Status Distribution - ${status},${count}`,
        );
      },
    );

    // Investments
    csvRows.push(
      `Investments,Total Investments,${metrics.investments.total_investments}`,
    );
    csvRows.push(
      `Investments,Successful Investments,${metrics.investments.successful_investments}`,
    );
    csvRows.push(
      `Investments,Total Investment Amount,${metrics.investments.total_investment_amount}`,
    );
    csvRows.push(
      `Investments,Average Investment,${metrics.investments.average_investment}`,
    );

    Object.entries(metrics.investments.status_distribution).forEach(
      ([status, count]) => {
        csvRows.push(`Investments,Status Distribution - ${status},${count}`);
      },
    );

    csvRows.push(
      `Investments,Small Investments,${metrics.investments.investment_size_distribution.small}`,
    );
    csvRows.push(
      `Investments,Medium Investments,${metrics.investments.investment_size_distribution.medium}`,
    );
    csvRows.push(
      `Investments,Large Investments,${metrics.investments.investment_size_distribution.large}`,
    );

    return csvRows.join('\n');
  };

  const handleExportCSV = () => {
    const csvData = convertToCSV(metrics);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_metrics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      {/* Add the Export CSV button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">General Dashboard</h1>
        <button
          onClick={handleExportCSV}
          className="p-2 bg-green-500 text-white rounded"
        >
          Export CSV
        </button>
      </div>
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

      {/*Add Platform fees here */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-base font-semibold mb-4 text-left">
          Currently accumulated platform fees to be sent to the company's bank
          account as profit.
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <p>
            <span className="mr-1">Total Platform Fees:</span>
            {`${
              metrics?.platform_fees
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'GHS',
                  }).format(parseFloat(metrics.platform_fees))
                : '0.00'
            }`}
          </p>
        </div>
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
                      {moment(date).format('MMM DD, YYYY')}:
                      {`${
                        amount
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'GHS',
                            }).format(parseFloat(amount as string))
                          : '0.00'
                      }`}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equity Campaigns Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">
          Equity Campaigns
        </h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="font-semibold">
                Total Equity Campaigns: {metrics?.equity_campaigns.total}
              </div>
              <div className="font-semibold">
                Active Campaigns: {metrics?.equity_campaigns.active}
              </div>
              <div className="font-semibold">
                Total Valuation: GHS
                {metrics?.equity_campaigns.total_valuation?.toLocaleString()}
              </div>
              <div className="font-semibold">
                Total Equity Offered:{' '}
                {metrics?.equity_campaigns.total_equity_offered}%
              </div>
            </div>
            <div>
              <div className="font-semibold">
                Total Funds Raised: GHS
                {metrics?.equity_campaigns.total_funds_raised?.toLocaleString()}
              </div>
              <div className="font-semibold">
                Average Valuation: GHS
                {metrics?.equity_campaigns.average_valuation?.toLocaleString()}
              </div>
              <div className="font-semibold">
                Average Equity Offered:{' '}
                {metrics?.equity_campaigns.average_equity_offered}%
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Status Distribution</h3>
            <ul>
              {metrics?.equity_campaigns.status_distribution &&
                Object.entries(
                  metrics.equity_campaigns.status_distribution,
                ).map(([status, count]) => (
                  <li key={status}>
                    {status}: {count}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Top Performing Equity Campaigns
            </h3>
            {metrics?.equity_campaigns.top_performing.map((campaign) => (
              <div key={campaign.id} className="mb-2 p-2 bg-white rounded">
                <p className="font-semibold">
                  {campaign.name} ({campaign.company_name})
                </p>
                <p>Valuation: GHS{campaign.valuation?.toLocaleString()}</p>
                <p>Equity Offered: {campaign.equity_offered}%</p>
                <p>
                  Total Raised: GHS{campaign.total_raised?.toLocaleString()}
                </p>
                <p>Percentage Raised: {campaign.percentage_raised}%</p>
                <p>Status: {campaign.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investments Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-left">Investments</h2>
        <div className="bg-gray-200 p-6 rounded-lg text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="font-semibold">
                Total Investments: {metrics?.investments.total_investments}
              </div>
              <div className="font-semibold">
                Successful Investments:{' '}
                {metrics?.investments.successful_investments}
              </div>
              <div className="font-semibold">
                Total Investment Amount: GHS
                {metrics?.investments.total_investment_amount?.toLocaleString()}
              </div>
              <div className="font-semibold">
                Average Investment: GHS
                {metrics?.investments.average_investment?.toLocaleString()}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Investment Size Distribution
              </h3>
              <div>
                Small (&lt; GHS1,000):{' '}
                {metrics?.investments.investment_size_distribution.small}
              </div>
              <div>
                Medium (GHS1,000 - GHS10,000):{' '}
                {metrics?.investments.investment_size_distribution.medium}
              </div>
              <div>
                Large (&ge; GHS10,000):{' '}
                {metrics?.investments.investment_size_distribution.large}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Status Distribution</h3>
            <ul>
              {metrics?.investments.status_distribution &&
                Object.entries(metrics.investments.status_distribution).map(
                  ([status, count]) => (
                    <li key={status}>
                      {status}: {count}
                    </li>
                  ),
                )}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Investments Over Time</h3>
            <div className="max-h-40 overflow-y-auto">
              {metrics?.investments.investments_over_time &&
                Object.entries(metrics.investments.investments_over_time).map(
                  ([date, amount]) => (
                    <div key={date} className="mb-1">
                      {moment(date).format('MMM DD, YYYY')}: GHS
                      {Number(amount).toLocaleString()}
                    </div>
                  ),
                )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Top Investors</h3>
            {metrics?.investments.top_investors.map((investor) => (
              <div key={investor.id} className="mb-2 p-2 bg-white rounded">
                <p className="font-semibold">{investor.name}</p>
                <p>Total Investments: {investor.investment_count}</p>
                <p>
                  Total Invested: GHS{investor.total_invested?.toLocaleString()}
                </p>
              </div>
            ))}
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
