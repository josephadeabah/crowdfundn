'use client';
import React, { useState, useEffect } from 'react';
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

interface DonationByCountryChartsProps {
  statistics: CampaignStatisticsDataType | null;
  fetchCampaignStatistics: (month: number, year: number) => void;
}

const DonationByCountryCharts = ({
  statistics,
  fetchCampaignStatistics,
}: DonationByCountryChartsProps) => {
  // Initialize selected month and year from sessionStorage, or default to current month/year
  const storedMonth = sessionStorage.getItem('selectedMonth');
  const storedYear = sessionStorage.getItem('selectedYear');
  const [selectedMonth, setSelectedMonth] = useState(
    storedMonth ? parseInt(storedMonth) : new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(
    storedYear ? parseInt(storedYear) : new Date().getFullYear(),
  );

  // Fetch statistics data when the component mounts or month/year changes
  useEffect(() => {
    fetchCampaignStatistics(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchCampaignStatistics]);

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    sessionStorage.setItem('selectedMonth', month.toString()); // Store selected month in sessionStorage
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    sessionStorage.setItem('selectedYear', year.toString()); // Store selected year in sessionStorage
  };

  // Prepare data for the bar chart
  const donationsByCountryData = Object.entries(
    statistics?.donations_by_country || {},
  ).map(([country, count]) => ({
    country: country || 'Unknown',
    donations: count,
  }));

  return (
    <Card className="p-4 bg-white dark:bg-neutral-800 rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          See Where You're Getting Donations From
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
            <Bar dataKey="donations" fill="#E9762B" />
          </BarChart>
        </ResponsiveContainer>
      </CardDescription>
    </Card>
  );
};

export default DonationByCountryCharts;
