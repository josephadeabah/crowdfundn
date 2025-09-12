// components/charts/FundingOverTimeChart.tsx
'use client';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { Card, CardHeader, CardTitle } from '../card/Card';
import { DashboardChartsProps } from './chartTypes';
import { getMonthOptions, getYearOptions } from './chartUtils';

export const FundingOverTimeChart = ({
  statistics,
  user,
  fetchCampaignStatistics,
}: DashboardChartsProps) => {
  // Get stored values from sessionStorage or use current date as default
  const storedMonth = sessionStorage.getItem('selectedMonthFundingOverTime');
  const storedYear = sessionStorage.getItem('selectedYearFundingOverTime');
  const [selectedMonth, setSelectedMonth] = useState(
    storedMonth ? parseInt(storedMonth) : new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(
    storedYear ? parseInt(storedYear) : new Date().getFullYear(),
  );

  // Use funding_over_time instead of donations_over_time
  const fundingOverTimeData = Object.entries(
    statistics?.funding_over_time || {},
  ).map(([date, amount]) => ({
    date: moment(date).format('MMM D'),
    amount: Number(amount) || 0, // Ensure it's always a number
  }));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    sessionStorage.setItem('selectedMonthFundingOverTime', month.toString());
    fetchCampaignStatistics(month, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    sessionStorage.setItem('selectedYearFundingOverTime', year.toString());
    fetchCampaignStatistics(selectedMonth, year);
  };

  // Check if there's any data to display
  const hasData =
    fundingOverTimeData.length > 0 &&
    fundingOverTimeData.some((item) => item.amount > 0);

  return (
    <Card className="p-4 bg-white rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600">
          Funding Over Time
        </CardTitle>
        <div className="mt-2 flex gap-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            {getMonthOptions().map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded-md"
          >
            {getYearOptions().map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      {!hasData ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No funding data available for the selected period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={fundingOverTimeData}
            margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `${user?.currency?.toUpperCase()} ${value}`
              }
            />
            <Tooltip
              formatter={(value) => [
                `${user?.currency?.toUpperCase()} ${value}`,
                'Amount',
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#22c55e"
              strokeWidth={2}
              name="Total Funding"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#16a34a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
