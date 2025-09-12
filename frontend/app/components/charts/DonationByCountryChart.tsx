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
import { getMonthOptions, getYearOptions } from './chartUtils';

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

  const fundingByCountryData = Object.entries(
    statistics?.funding_by_country || {},
  ).map(([country, amount]) => ({
    country: country || 'Unknown',
    funding: Number(amount) || 0,
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

  const hasData =
    fundingByCountryData.length > 0 &&
    fundingByCountryData.some((item) => item.funding > 0);

  return (
    <Card className="p-4 bg-white rounded-lg border-none shadow-none my-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-600">
          Funding by Country
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
          No funding data by country available for the selected period
        </div>
      ) : (
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
              <Tooltip
                formatter={(value) => [`${value}`, 'Contributions']}
                labelFormatter={(label) => `Country: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="funding"
                fill="#E9762B"
                name="Funding Contributions"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardDescription>
      )}
    </Card>
  );
};

export default DonationByCountryCharts;
