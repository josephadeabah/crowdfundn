// components/charts/DashboardCharts.tsx
'use client';
import React, { useEffect, useState } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import moment from 'moment';
import { deslugify } from '@/app/utils/helpers/categories';
import { Card, CardHeader, CardTitle } from '../card/Card';
import { CampaignStatisticsDataType } from '@/app/types/campaigns.types';
import { LoginUserType } from '@/app/types/auth.login.types';

// Helper function to generate month options
const getMonthOptions = () => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months.map((month, index) => ({
    value: index + 1, // Months are 1-indexed (January = 1)
    label: month,
  }));
};

// Helper function to generate year options
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));
};

interface DashboardChartsProps {
  statistics: CampaignStatisticsDataType | null; // Replace `any` with the correct type for your statistics
  user: LoginUserType | null; // Replace `any` with the correct type for your user
  fetchCampaignStatistics: (month: number, year: number) => void;
}

export default function DashboardCharts({
  statistics,
  user,
  fetchCampaignStatistics,
}: DashboardChartsProps) {
  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  // Handle month and year selection
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value));
    fetchCampaignStatistics(parseInt(e.target.value), selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
    fetchCampaignStatistics(selectedMonth, parseInt(e.target.value));
  };
  // Format donations over time for Recharts
  const donationsOverTimeData = Object.entries(
    statistics?.donations_over_time || {},
  ).map(([date, amount]) => ({
    date: moment(date).format('MMM D'), // Format date using moment
    amount: parseFloat(amount as string),
  }));

  // Format campaigns by category for Recharts
  const campaignsByCategoryData = Object.entries(
    statistics?.campaigns_by_category || {},
  ).map(([category, count]) => ({
    name: deslugify(category),
    value: count,
  }));

  // Format campaign performance for Recharts
  const campaignPerformanceData = statistics?.campaign_performance?.map(
    (campaign) => ({
      name: campaign.title,
      performance: parseFloat(campaign.performance_percentage),
      totalDays: campaign.total_days,
      remainingDays: campaign.remaining_days,
    }),
  );

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Colors for the bars
  const barColors = ['#8884d8', '#82ca9d', '#ffc658'];

  // Custom Tooltip for Top Campaigns Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <p className="font-semibold">{label}</p>
          <p>Performance: {payload[0].value}%</p>
          <p>Total Days: {payload[0].payload.totalDays}</p>
          <p>Remaining Days: {payload[0].payload.remainingDays}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Campaigns by Category Chart */}
      <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Campaigns by Category
          </CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={campaignsByCategoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {campaignsByCategoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => `${value} Campaigns in ${name}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Donations Over Time Chart */}
      <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Donations Over Time
          </CardTitle>
          {/* Dropdown for Month and Year */}
          <div className="mt-2 flex gap-2">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:text-white"
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
              className="p-2 border border-gray-300 rounded-md dark:bg-neutral-700 dark:text-white"
            >
              {getYearOptions().map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={donationsOverTimeData}
            margin={{
              top: 30,
              right: 10,
              left: 10,
              bottom: 10,
            }}
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
              formatter={(value) => `${user?.currency?.toUpperCase()} ${value}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#22c55e"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Campaign Performance Chart */}
      <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={campaignPerformanceData}
            margin={{
              top: 30,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="performance" fill={barColors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
