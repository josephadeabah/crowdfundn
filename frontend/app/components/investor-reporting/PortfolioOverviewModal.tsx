// app/components/investor-reporting/PortfolioOverviewModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Download,
  Filter,
  Calendar,
  Building,
  Users,
  DollarSign,
  Percent,
} from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
import { formatCurrency } from '@/app/utils/helpers/formatters';
import { InvestorReportingService } from './services/investor-reporting.service';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/app/utils/helpers/formatters';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

interface PortfolioOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: any;
}

const PortfolioOverviewModal: React.FC<PortfolioOverviewModalProps> = ({
  isOpen,
  onClose,
  portfolioData,
}) => {
  const [timePeriod, setTimePeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [detailedData, setDetailedData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [service] = useState(new InvestorReportingService());

  useEffect(() => {
    if (isOpen && portfolioData) {
      fetchDetailedData();
    }
  }, [isOpen, timePeriod]);

  const fetchDetailedData = async () => {
    try {
      setLoading(true);

      // Fetch portfolio analysis data
      const analysisResponse = await service.getPortfolioAnalysis();
      if (analysisResponse?.success) {
        setAnalysisData(analysisResponse);
      }

      // Fetch portfolio metrics for the selected time period
      const metricsResponse = await service.getPortfolioMetrics(timePeriod);
      if (metricsResponse?.success) {
        setDetailedData(metricsResponse);
      }
    } catch (error) {
      console.error('Error fetching detailed portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const service = new InvestorReportingService();
      const response = await service.generatePortfolioStatement({
        period: timePeriod,
        format: 'pdf',
        includeSections: ['summary', 'performance', 'breakdown', 'risk'],
      });

      if (response?.success && response?.url) {
        window.open(response?.url, '_blank');
        toast.success('Portfolio statement generated successfully');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export portfolio data');
    }
  };

  if (!portfolioData?.summary) return null;

  const summary = portfolioData?.summary;
  const campaigns = portfolioData?.by_campaign || [];
  const performanceMetrics = portfolioData?.performance_metrics || {};
  const riskAnalysis = portfolioData?.risk_analysis || {};
  const projections = portfolioData?.projections || [];

  // Prepare real chart data
  const performanceData = (campaigns || [])?.map((campaign: any) => ({
    name:
      (campaign?.company_name || '')?.substring(0, 15) +
      ((campaign?.company_name || '')?.length > 15 ? '...' : ''),
    invested: campaign?.invested ?? 0,
    current: campaign?.current_value ?? 0,
    returns: campaign?.returns ?? 0,
    roi: campaign?.roi ?? 0,
  }));

  const concentrationData = campaigns?.slice(0, 5)?.map((campaign: any) => ({
    name: campaign?.company_name,
    value: ((campaign?.invested ?? 0) / (summary?.total_invested ?? 1)) * 100,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Analytics</h2>
            <p className="text-muted-foreground">
              Comprehensive analysis of your investment portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Invested
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      summary?.total_invested ?? 0,
                      summary?.currency,
                      summary?.currency_symbol,
                    )}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Value
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      summary?.current_value ?? 0,
                      summary?.currency,
                      summary?.currency_symbol,
                    )}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Returns
                  </p>
                  <p
                    className={`text-2xl font-bold ${(summary?.total_returns ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(
                      summary?.total_returns ?? 0,
                      summary?.currency,
                      summary?.currency_symbol,
                    )}
                  </p>
                </div>
                {(summary?.total_returns ?? 0) >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ROI
                  </p>
                  <p
                    className={`text-2xl font-bold ${(summary?.roi ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {summary?.roi?.toFixed(2) ?? '0.00'}%
                  </p>
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
                <CardDescription>
                  ROI and returns across your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : campaigns?.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'roi') return [`${value}%`, 'ROI'];
                            return [
                              formatCurrency(
                                value as number,
                                summary?.currency,
                                summary?.currency_symbol,
                              ),
                              name,
                            ];
                          }}
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="returns"
                          fill="#00C49F"
                          name="Returns"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="roi"
                          stroke="#0088FE"
                          strokeWidth={2}
                          name="ROI"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No investment data available for chart</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Detailed performance metrics for each investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns?.map((campaign: any) => (
                      <div
                        key={campaign?.campaign_id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Building className="h-10 w-10 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">
                              {campaign?.company_name}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>
                                {campaign?.investment_count} investment
                                {campaign?.investment_count !== 1 ? 's' : ''}
                              </span>
                              <span>•</span>
                              <span>
                                {campaign?.ownership_percentage?.toFixed(2) ??
                                  '0.00'}
                                % ownership
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(
                              campaign?.current_value ?? 0,
                              summary?.currency,
                              summary?.currency_symbol,
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Invested:{' '}
                            {formatCurrency(
                              campaign?.invested ?? 0,
                              summary?.currency,
                              summary?.currency_symbol,
                            )}
                          </div>
                          <div
                            className={`text-sm font-medium ${(campaign?.roi ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {(campaign?.roi ?? 0) >= 0 ? '+' : ''}
                            {campaign?.roi?.toFixed(2) ?? '0.00'}% ROI
                          </div>
                        </div>
                      </div>
                    ))}

                    {campaigns?.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No investment data available</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key metrics for portfolio evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Internal Rate of Return (IRR)</span>
                        <span className="font-medium">
                          {summary?.irr?.toFixed(2) ?? '0.00'}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(summary?.irr ?? 0, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Multiple on Invested Capital (MOIC)</span>
                        <span className="font-medium">
                          {summary?.moic?.toFixed(2) ?? '0.00'}x
                        </span>
                      </div>
                      <Progress
                        value={Math.min((summary?.moic ?? 0) * 50, 100)}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Active Investments</span>
                      <Badge variant="secondary">
                        {summary?.active_investments}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Campaigns Invested</span>
                      <Badge variant="secondary">
                        {summary?.invested_campaigns}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Average Investment Size</span>
                      <span className="font-medium">
                        {formatCurrency(
                          (summary?.total_invested ?? 0) /
                            Math.max(summary?.active_investments ?? 1, 1),
                          summary?.currency,
                          summary?.currency_symbol,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Breakdown</CardTitle>
                <CardDescription>
                  Distribution of investments across campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Pie Chart */}
                  {campaigns?.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={concentrationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${((percent ?? 0) * 100)?.toFixed(1)}%`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {concentrationData?.map(
                              (entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ),
                            )}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, 'Allocation']}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No investment data available for breakdown</p>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    {campaigns?.map((campaign: any) => {
                      const percentage =
                        ((campaign?.invested ?? 0) /
                          (summary?.total_invested ?? 1)) *
                        100;
                      return (
                        <div key={campaign?.campaign_id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{campaign?.company_name}</span>
                            <span className="font-medium">
                              {percentage?.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {formatCurrency(
                                campaign?.invested ?? 0,
                                summary?.currency,
                                summary?.currency_symbol,
                              )}
                            </span>
                            <span>
                              {campaign?.ownership_percentage?.toFixed(2) ??
                                '0.00'}
                              % ownership
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>
                  Portfolio risk metrics and concentration analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Concentration Risk</h4>
                    <div className="space-y-3">
                      {campaigns
                        ?.slice(0, 3)
                        ?.map((campaign: any, index: number) => {
                          const percentage =
                            ((campaign?.invested ?? 0) /
                              (summary?.total_invested ?? 1)) *
                            100;
                          return (
                            <div
                              key={campaign?.campaign_id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-blue-600">
                                    {index + 1}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  {campaign?.company_name}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {percentage?.toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatCurrency(
                                    campaign?.invested ?? 0,
                                    summary?.currency,
                                    summary?.currency_symbol,
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Risk Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">
                          Portfolio Concentration
                        </div>
                        <div className="text-lg font-medium">
                          {(
                            (riskAnalysis?.concentration_risk ?? 0) * 100
                          )?.toFixed(1)}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Herfindahl-Hirschman Index
                        </div>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">
                          Overall Risk Score
                        </div>
                        <div className="text-lg font-medium">
                          {(
                            (riskAnalysis?.overall_risk_score ?? 0) * 100
                          )?.toFixed(1)}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {riskAnalysis?.risk_category?.toUpperCase() ||
                            'MEDIUM'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {riskAnalysis && (
                    <div>
                      <h4 className="font-medium mb-3">
                        Detailed Risk Analysis
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sector Diversification</span>
                          <span className="font-medium">
                            {(
                              (riskAnalysis?.sector_diversification ?? 0) * 100
                            )?.toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Liquidity Risk</span>
                          <span className="font-medium">
                            {(
                              (riskAnalysis?.liquidity_risk ?? 0) * 100
                            )?.toFixed(1)}
                            %
                          </span>
                        </div>
                        {riskAnalysis?.volatility && (
                          <div className="flex justify-between text-sm">
                            <span>Volatility</span>
                            <span className="font-medium">
                              {((riskAnalysis?.volatility ?? 0) * 100)?.toFixed(
                                1,
                              )}
                              %
                            </span>
                          </div>
                        )}
                        {riskAnalysis?.sharpe_ratio && (
                          <div className="flex justify-between text-sm">
                            <span>Sharpe Ratio</span>
                            <span className="font-medium">
                              {riskAnalysis?.sharpe_ratio?.toFixed(2) ?? '0.00'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Future Projections</CardTitle>
                <CardDescription>
                  Projected portfolio growth based on current performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.isArray(projections) && projections.length > 0 ? (
                      projections.slice(0, 3).map((projection: any) => (
                        <Card key={projection?.years}>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-sm font-medium text-muted-foreground mb-2">
                                {projection?.years} Year
                                {projection?.years !== 1 ? 's' : ''} Projection
                              </div>
                              <div className="text-2xl font-bold mb-1">
                                {formatCurrency(
                                  projection?.projected_value ?? 0,
                                  summary?.currency,
                                  summary?.currency_symbol,
                                )}
                              </div>
                              <div
                                className={`text-sm ${
                                  (projection?.projected_returns ?? 0) >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {(projection?.projected_returns ?? 0) >= 0
                                  ? '+'
                                  : ''}
                                {formatCurrency(
                                  projection?.projected_returns ?? 0,
                                  summary?.currency,
                                  summary?.currency_symbol,
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                {projection?.annual_growth?.toFixed(2) ??
                                  '0.00'}
                                % annual growth
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No projection data available</p>
                        <p className="text-sm">
                          Projections will be available with more data
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Assumptions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        Current ROI of {summary?.roi?.toFixed(2) ?? '0.00'}%
                        remains constant
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        No additional investments or withdrawals
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        Company valuations grow at current rate
                      </li>
                      {Array.isArray(projections) && projections.length > 0 && (
                        <li className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          Based on {projections.length} projection models
                        </li>
                      )}
                    </ul>
                  </div>

                  {Array.isArray(projections) && projections.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Detailed Projections</h4>
                      <div className="space-y-3">
                        {projections.map((proj: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {proj?.scenario || `Scenario ${index + 1}`}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(
                                proj?.projected_value ?? 0,
                                summary?.currency,
                                summary?.currency_symbol,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Data as of {formatDate(new Date().toISOString())}
            {detailedData?.calculation_date && (
              <span className="ml-2">
                • Last calculated: {formatDate(detailedData?.calculation_date)}
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleExportData} variant="success">
              <Download className="mr-2 h-4 w-4" />
              Export Full Report
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PortfolioOverviewModal;
