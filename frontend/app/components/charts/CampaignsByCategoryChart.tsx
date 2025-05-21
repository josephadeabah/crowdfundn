// components/charts/CampaignsByCategoryChart.tsx
'use client';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../card/Card';
import { deslugify } from '@/app/utils/helpers/categories';
import { DashboardChartsProps } from './chartTypes';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CampaignsByCategoryChart = ({
  statistics,
  user,
  fetchCampaignStatistics,
}: DashboardChartsProps) => {
  const campaignsByCategoryData = Object.entries(
    statistics?.campaigns_by_category || {},
  ).map(([category, count]) => ({
    name: deslugify(category),
    value: count,
  }));

  return (
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
  );
};
