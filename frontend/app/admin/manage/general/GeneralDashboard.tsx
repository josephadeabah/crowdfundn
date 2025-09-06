'use client';
import React, { useEffect } from 'react';
import { useMetricsContext } from '@/app/context/admin/metrics/MetricsContext';
import moment from 'moment';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const GeneralDashboard = () => {
  const { metrics, loading, error, fetchMetrics } = useMetricsContext();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const convertToCSV = (metrics: any): string => {
    if (!metrics) return '';

    const csvRows = [];
    csvRows.push('Category,Key,Value');

    // Add all metrics to CSV
    Object.entries(metrics).forEach(([category, data]: [string, any]) => {
      if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              csvRows.push(`${category},${key}_${subKey},${subValue}`);
            });
          } else {
            csvRows.push(`${category},${key},${value}`);
          }
        });
      }
    });

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

  if (loading)
    return <div className="text-center py-8">Loading dashboard...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  const formatValue = (value: number, format?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GHS',
      }).format(value);
    }
    return value.toLocaleString();
  };

  const cardData = [
    {
      title: 'Total Users',
      value: metrics?.users.total || 0,
      tooltip: 'The total number of users registered on the platform.',
      tooltipId: 'tooltip-total-users',
    },
    {
      title: 'Active Campaigns',
      value: metrics?.campaigns.active || 0,
      tooltip: 'The number of campaigns currently marked as "active."',
      tooltipId: 'tooltip-active-campaigns',
    },
    {
      title: 'Total Raised (Combined)',
      value: metrics?.combined.total_raised || 0,
      format: 'currency',
      tooltip: 'Total funds raised from both donations and investments.',
      tooltipId: 'tooltip-total-raised',
    },
    {
      title: 'Platform Fees',
      value: metrics?.combined.platform_fees || 0,
      format: 'currency',
      tooltip:
        'Total platform fees accumulated from donations and investments.',
      tooltipId: 'tooltip-platform-fees',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">General Dashboard</h1>
        <button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-center mb-3">
              <FaInfoCircle
                data-tooltip-id={card.tooltipId}
                className="text-gray-400 text-sm mr-2 cursor-help"
              />
              <Tooltip id={card.tooltipId} className="max-w-xs">
                {card.tooltip}
              </Tooltip>
              <h3 className="text-sm font-semibold text-gray-600">
                {card.title}
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(card.value, card.format)}
            </p>
          </div>
        ))}
      </div>

      {/* Combined Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Donations Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Donations Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Donations</span>
              <span className="font-semibold">
                {formatValue(metrics?.donations.total_amount || 0, 'currency')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Donation</span>
              <span className="font-semibold">
                {formatValue(
                  metrics?.donations.average_donation || 0,
                  'currency',
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Donations Count</span>
              <span className="font-semibold">
                {metrics?.donations.total_count || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Repeat Donors</span>
              <span className="font-semibold">
                {metrics?.donations.repeat_donors || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Investments Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Investments Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Investments</span>
              <span className="font-semibold">
                {formatValue(
                  metrics?.equity.total_investment_amount || 0,
                  'currency',
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Investment</span>
              <span className="font-semibold">
                {formatValue(
                  metrics?.equity.average_investment || 0,
                  'currency',
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Investments Count</span>
              <span className="font-semibold">
                {metrics?.equity.total_count || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Repeat Investors</span>
              <span className="font-semibold">
                {metrics?.equity.repeat_investors || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Data - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Donations Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Donations Weekly
          </h2>
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(metrics?.donations.donations_over_time || {})
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, amount]) => (
                <div
                  key={date}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">
                    {moment(date).format('MMM DD, YYYY')}
                  </span>
                  <span className="font-semibold">
                    {formatValue(amount as number, 'currency')}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Investments Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Investments Over Time
          </h2>
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(metrics?.equity.investments_over_time || {})
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, amount]) => (
                <div
                  key={date}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">
                    {moment(date).format('MMM DD, YYYY')}
                  </span>
                  <span className="font-semibold">
                    {formatValue(amount as number, 'currency')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Top {metrics?.campaigns.top_performing?.length || 0} Performing
          Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.campaigns.top_performing?.map((campaign: any) => (
            <div key={campaign.id} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {campaign.name}
              </h3>
              <div className="space-y-1 text-sm">
                <p>Goal: {formatValue(campaign.goal_amount, 'currency')}</p>
                <p>
                  Raised: {formatValue(campaign.transferred_amount, 'currency')}
                </p>
                <p>Performance: {campaign.performance_percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equity Campaigns Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Equity Campaigns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                <p>Total: {metrics?.equity_campaigns.total}</p>
                <p>Active: {metrics?.equity_campaigns.active}</p>
                <p>
                  Total Valuation:{' '}
                  {formatValue(
                    metrics?.equity_campaigns.total_valuation || 0,
                    'currency',
                  )}
                </p>
                <p>
                  Total Equity Offered:{' '}
                  {metrics?.equity_campaigns.total_equity_offered}%
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Averages</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Average Valuation:{' '}
                  {formatValue(
                    metrics?.equity_campaigns.average_valuation || 0,
                    'currency',
                  )}
                </p>
                <p>
                  Average Equity Offered:{' '}
                  {metrics?.equity_campaigns.average_equity_offered}%
                </p>
                <p>
                  Total Funds Raised:{' '}
                  {formatValue(
                    metrics?.equity_campaigns.total_funds_raised || 0,
                    'currency',
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Status Distribution</h3>
            <div className="space-y-2">
              {metrics?.equity_campaigns.status_distribution &&
                Object.entries(
                  metrics.equity_campaigns.status_distribution,
                ).map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Investments Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Investment Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Investment Summary</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Total Investments: {metrics?.investments.total_investments}
                </p>
                <p>Successful: {metrics?.investments.successful_investments}</p>
                <p>
                  Total Amount:{' '}
                  {formatValue(
                    metrics?.investments.total_investment_amount || 0,
                    'currency',
                  )}
                </p>
                <p>
                  Average:{' '}
                  {formatValue(
                    metrics?.investments.average_investment || 0,
                    'currency',
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                Investment Size Distribution
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  Small (&lt; GHS1,000):{' '}
                  {metrics?.investments.investment_size_distribution.small}
                </p>
                <p>
                  Medium (GHS1,000-10,000):{' '}
                  {metrics?.investments.investment_size_distribution.medium}
                </p>
                <p>
                  Large (&ge; GHS10,000):{' '}
                  {metrics?.investments.investment_size_distribution.large}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Status Distribution</h3>
            <div className="space-y-2">
              {metrics?.investments.status_distribution &&
                Object.entries(metrics.investments.status_distribution).map(
                  ([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span className="text-gray-600">{status}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            User Engagement
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Active Users (7 days)</span>
              <span className="font-semibold">{metrics?.users.active}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Confirmation Rate</span>
              <span className="font-semibold">
                {metrics?.users.email_confirmation_rate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Logins</span>
              <span className="font-semibold">
                {metrics?.engagement.average_logins}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time to First Action</span>
              <span className="font-semibold">
                {metrics?.engagement.time_to_first_action
                  ? moment
                      .duration(
                        metrics.engagement.time_to_first_action,
                        'seconds',
                      )
                      .humanize()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Subscriptions
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Active Subscriptions</span>
              <span className="font-semibold">
                {metrics?.subscriptions.active}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Recurring Revenue</span>
              <span className="font-semibold">
                {formatValue(metrics?.subscriptions.mrr || 0, 'currency')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Churn Rate</span>
              <span className="font-semibold">
                {metrics?.subscriptions.churn_rate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Geography and Subaccounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Geography */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Geography
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Users by Country</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {metrics?.geography.users_by_country &&
                Object.entries(metrics.geography.users_by_country).map(
                  ([country, count]) => (
                    <div key={country} className="flex justify-between">
                      <span className="text-gray-600">{country}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ),
                )}
            </div>
          </div>
        </div>

        {/* Subaccounts */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Subaccounts
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span>Total Subaccounts</span>
              <span className="font-semibold">
                {metrics?.subaccounts.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate</span>
              <span className="font-semibold">
                {metrics?.subaccounts.success_rate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
