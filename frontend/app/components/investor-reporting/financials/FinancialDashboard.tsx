// app/components/financials/FinancialDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiPieChart,
  FiFileText,
  FiBarChart2,
} from 'react-icons/fi';
import { Skeleton } from '../../ui/Skeleton';
import { financialManagementService } from '../services/financial-management.service';
import Modal from '@/app/components/modal/Modal';
import { Button } from '../../ui/button';
import { useAuth } from '@/app/context/auth/AuthContext';

interface FinancialDashboardProps {
  campaignId: number;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  campaignId,
}) => {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<
    'monthly' | 'quarterly' | 'yearly'
  >('quarterly');
  const [quickActionModal, setQuickActionModal] = useState<{
    open: boolean;
    type?: 'statement' | 'kpi' | 'report';
  }>({ open: false });

  useEffect(() => {
    if (token) {
      financialManagementService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setError('Authentication required. Please log in.');
      setLoading(false);
    }
  }, [campaignId, timeframe, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response =
        await financialManagementService.getCampaignFinancialDashboard(
          campaignId,
        );
      if (response.success) {
        setDashboardData(response.dashboard);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (type: 'statement' | 'kpi' | 'report') => {
    // This would typically open the specific component's modal
    // For now, we'll show a generic modal
    setQuickActionModal({ open: true, type });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error Loading Dashboard</p>
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchDashboardData}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>No financial data available</p>
            <p className="text-sm mt-2">
              Start by adding financial statements and KPIs
            </p>
            <div className="mt-4 space-x-2">
              <Button
                variant="success"
                onClick={() => handleQuickAction('statement')}
              >
                Add Financial Statement
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickAction('kpi')}
              >
                Create KPI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryCards = [
    {
      title: 'Total Invested',
      value: `${user?.currency?.toUpperCase()}${dashboardData.summary.total_invested.toLocaleString()}`,
      change: '+12.5%',
      icon: <FiDollarSign className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Investors',
      value: dashboardData.summary.investors_count.toString(),
      change: '+3 this month',
      icon: <FiUsers className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Valuation',
      value: `${user?.currency?.toUpperCase()}${dashboardData.summary.valuation.toLocaleString()}`,
      change: '+8.2%',
      icon: <FiTrendingUp className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Equity Offered',
      value: `${dashboardData.summary.equity_offered}%`,
      change: 'Remaining',
      icon: <FiPieChart className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your campaign's financial performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeframe === 'monthly' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeframe === 'quarterly' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('quarterly')}
          >
            Quarterly
          </Button>
          <Button
            variant={timeframe === 'yearly' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                  <p
                    className={`text-xs mt-1 ${
                      card.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {card.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiBarChart2 className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Last 6 periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.performance.revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="period"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${user?.currency?.toUpperCase()}${value.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${user?.currency?.toUpperCase()}${value.toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expenses vs Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiDollarSign className="h-5 w-5" />
              Expenses vs Revenue
            </CardTitle>
            <CardDescription>Last 6 periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.performance.revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="period"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${user?.currency?.toUpperCase()}${value.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${user?.currency?.toUpperCase()}${value.toLocaleString()}`,
                      'Amount',
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="#10B981"
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#EF4444"
                    name="Expenses"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPIs and Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top KPIs */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Primary KPIs to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.kpis.slice(0, 4).map((kpi: any, index: number) => (
                <div
                  key={kpi.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{kpi.name}</p>
                    <p className="text-sm text-gray-500">{kpi.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {kpi.latest_value?.value || 'N/A'} {kpi.unit}
                    </p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All KPIs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiFileText className="h-5 w-5" />
              Recent Investor Reports
            </CardTitle>
            <CardDescription>Latest published reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recent_reports.map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-500">
                      {report.period_description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {report.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(report.report_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
