'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../card/Card';
import { CampaignStatisticsDataType } from '@/app/types/campaigns.types';

interface DonationByCountryChartsProps {
  statistics: CampaignStatisticsDataType | null;
}

const DonationByCountryCharts = ({
  statistics,
}: DonationByCountryChartsProps) => {
  // Prepare data for the bar chart
  const donationsByCountryData = Object.entries(
    statistics?.donations_by_country || {},
  ).map(([country, count]) => ({
    country,
    donations: count,
  }));

  return (
    <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Donations by Country
        </CardTitle>
      </CardHeader>
      <CardDescription>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={donationsByCountryData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip formatter={(value) => `${value} Donations`} />
            <Legend />
            <Bar dataKey="donations" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardDescription>
    </Card>
  );
};

export default DonationByCountryCharts;
