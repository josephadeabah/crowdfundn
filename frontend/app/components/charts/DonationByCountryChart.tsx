// components/charts/DonationByCountryChart.tsx
'use client';
import React, { useState } from 'react';
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
import { getMonthOptions, getYearOptions } from './DashboardCharts';

interface DonationByCountryChartsProps {
  statistics: CampaignStatisticsDataType | null;
  fetchCampaignStatistics: (month: number, year: number) => void;
}

const DonationByCountryCharts = ({
  statistics,
  fetchCampaignStatistics,
}: DonationByCountryChartsProps) => {
  const storedMonth = sessionStorage.getItem('selectedMonthDonationsByCountry');
  const storedYear = sessionStorage.getItem('selectedYearDonationsByCountry');
  const [selectedMonth, setSelectedMonth] = useState(
    storedMonth ? parseInt(storedMonth) : new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(
    storedYear ? parseInt(storedYear) : new Date().getFullYear(),
  );

  // Use funding_by_country instead of donations_by_country
  const fundingByCountryData = Object.entries(
    statistics?.funding_by_country || {},
  ).map(([country, count]) => ({
    country: country || 'Unknown',
    funding: count, // Changed from donations to funding
  }));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    sessionStorage.setItem('selectedMonthDonationsByCountry', month.toString());
    fetchCampaignStatistics(month, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    sessionStorage.setItem('selectedYearDonationsByCountry', year.toString());
    fetchCampaignStatistics(selectedMonth, year);
  };

  return (
    <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Funding by Country
        </CardTitle>
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
      <CardDescription>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={fundingByCountryData}
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
            <Tooltip formatter={(value) => `${value} Contributions`} />
            <Legend />
            <Bar
              dataKey="funding"
              fill="#E9762B"
              name="Funding Contributions"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardDescription>
    </Card>
  );
};

export default DonationByCountryCharts;
