// components/charts/CampaignPerformanceChart.tsx
'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../card/Card';
import { DashboardChartsProps } from './chartTypes';

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

export const CampaignPerformanceChart = ({
  statistics,
}: DashboardChartsProps) => {
  const campaignPerformanceData = statistics?.campaign_performance?.map(
    (campaign) => ({
      name: campaign.title,
      performance: parseFloat(campaign.performance_percentage),
      totalDays: campaign.total_days,
      remainingDays: campaign.remaining_days,
    }),
  );

  return (
    <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Campaign Performance
        </CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={campaignPerformanceData}
          margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${value}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="performance" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
