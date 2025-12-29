// app/components/investor-reporting/KPIDashboardModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Download,
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { investorReportingService } from './services/investor-reporting.service';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/app/utils/helpers/formatters';

interface KPIDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number | null;
}

interface KPI {
  id: number;
  name: string;
  kpi_type: string;
  unit: string;
  target_value: number;
  is_primary: boolean;
  latest_value?: {
    value: number;
    period_date: string;
  };
  trend: Record<string, number>;
  performance_vs_target?: {
    current_value: number;
    target_value: number;
    difference: number;
    percentage: number;
  };
}

const KPIDashboardModal: React.FC<KPIDashboardModalProps> = ({
  isOpen,
  onClose,
  campaignId,
}) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKpiType, setSelectedKpiType] = useState('all');
  const [timeRange, setTimeRange] = useState('90d');

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchKPIs();
    }
  }, [isOpen, campaignId, selectedKpiType]);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const response = await investorReportingService.getInvestorKPIs(
        campaignId!,
        selectedKpiType !== 'all' ? selectedKpiType : undefined,
      );

      if (response?.success) {
        setKpis(response?.kpis ?? []);
      }
    } catch (error: any) {
      console.error('Error fetching KPIs:', error);
      toast.error(error?.message || 'Failed to load KPI dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getKpiTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      financial: 'text-blue-600 bg-blue-100',
      operational: 'text-green-600 bg-green-100',
      growth: 'text-purple-600 bg-purple-100',
      engagement: 'text-orange-600 bg-orange-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getKpiIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      financial: <BarChart3 className="h-4 w-4" />,
      operational: <Target className="h-4 w-4" />,
      growth: <TrendingUp className="h-4 w-4" />,
      engagement: <PieChart className="h-4 w-4" />,
    };
    return icons[type] || <Target className="h-4 w-4" />;
  };

  // Prepare data for charts
  const primaryKpis = kpis?.filter((kpi) => kpi?.is_primary);

  const performanceData =
    primaryKpis?.map((kpi) => ({
      name: kpi?.name,
      current: kpi?.latest_value?.value ?? 0,
      target: kpi?.target_value ?? 0,
      achievement: kpi?.performance_vs_target?.percentage ?? 0,
    })) ?? [];

  const trendData =
    kpis
      ?.filter((kpi) => kpi?.trend && Object.keys(kpi?.trend)?.length > 0)
      ?.slice(0, 3)
      ?.flatMap((kpi) =>
        Object.entries(kpi?.trend ?? {})?.map(([date, value]) => ({
          date,
          value,
          name: kpi?.name,
        })),
      ) ?? [];

  const radarData =
    primaryKpis?.map((kpi) => ({
      subject: kpi?.name,
      A: kpi?.latest_value?.value ?? 0,
      B: kpi?.target_value ?? 0,
      fullMark: Math.max(
        (kpi?.target_value ?? 0) * 1.5,
        (kpi?.latest_value?.value ?? 0) * 1.5,
      ),
    })) ?? [];

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
            <h2 className="text-2xl font-bold">KPI Dashboard</h2>
            <p className="text-muted-foreground">
              Track key performance indicators and metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedKpiType} onValueChange={setSelectedKpiType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {primaryKpis?.slice(0, 3)?.map((kpi) => {
            const achievement = kpi?.performance_vs_target?.percentage ?? 0;
            const isOnTarget = achievement >= 90;
            const isBehind = achievement < 70;

            return (
              <Card key={kpi?.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-full ${getKpiTypeColor(kpi?.kpi_type)}`}
                      >
                        {getKpiIcon(kpi?.kpi_type)}
                      </div>
                      <div>
                        <p className="font-medium">{kpi?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {kpi?.kpi_type}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        isOnTarget
                          ? 'default'
                          : isBehind
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {achievement?.toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Current Value</span>
                        <span className="font-medium">
                          {kpi?.latest_value?.value?.toLocaleString() ?? 'N/A'}{' '}
                          {kpi?.unit}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(achievement, 100)}
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Target</span>
                      <span className="font-medium">
                        {kpi?.target_value?.toLocaleString() ?? 'N/A'}{' '}
                        {kpi?.unit}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Variance</span>
                      <span
                        className={`font-medium ${kpi?.performance_vs_target?.difference && kpi?.performance_vs_target?.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {kpi?.performance_vs_target?.difference ? (
                          <>
                            {kpi?.performance_vs_target?.difference >= 0
                              ? '+'
                              : ''}
                            {kpi?.performance_vs_target?.difference?.toLocaleString()}{' '}
                            {kpi?.unit}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="radar">Performance Radar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>KPI Performance</CardTitle>
                <CardDescription>
                  Primary KPI performance vs targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : performanceData?.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="current"
                          fill="#0088FE"
                          name="Current Value"
                        />
                        <Bar dataKey="target" fill="#00C49F" name="Target" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No KPI data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPI Status */}
            <Card>
              <CardHeader>
                <CardTitle>KPI Status</CardTitle>
                <CardDescription>Overview of all tracked KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : kpis?.length > 0 ? (
                  <div className="space-y-4">
                    {kpis?.map((kpi) => {
                      const achievement =
                        kpi?.performance_vs_target?.percentage ?? 0;
                      const isOnTarget = achievement >= 90;
                      const isBehind = achievement < 70;

                      return (
                        <div
                          key={kpi?.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-2 rounded-full ${getKpiTypeColor(kpi?.kpi_type)}`}
                            >
                              {getKpiIcon(kpi?.kpi_type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{kpi?.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span className="capitalize">
                                  {kpi?.kpi_type}
                                </span>
                                <span>•</span>
                                <span>Unit: {kpi?.unit}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-medium">
                                {kpi?.latest_value?.value?.toLocaleString() ??
                                  'N/A'}{' '}
                                {kpi?.unit}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Target:{' '}
                                {kpi?.target_value?.toLocaleString() ?? 'N/A'}
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              {isOnTarget ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : isBehind ? (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <div className="h-5 w-5 text-yellow-500" />
                              )}
                              <div
                                className={`text-xs mt-1 ${isOnTarget ? 'text-green-600' : isBehind ? 'text-red-600' : 'text-yellow-600'}`}
                              >
                                {achievement?.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No KPIs configured</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed KPI Analysis</CardTitle>
                <CardDescription>
                  Comprehensive view of all KPIs with historical data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : kpis?.length > 0 ? (
                  <div className="space-y-6">
                    {kpis?.map((kpi) => {
                      const achievement =
                        kpi?.performance_vs_target?.percentage ?? 0;
                      const trend = kpi?.trend ?? {};
                      const trendDates = Object.keys(trend)?.sort();
                      const latestValue = kpi?.latest_value?.value;
                      const previousValue =
                        trend?.[trendDates?.[trendDates?.length - 2]];
                      const growth = previousValue
                        ? (((latestValue ?? 0) - previousValue) /
                            previousValue) *
                          100
                        : 0;

                      return (
                        <Card key={kpi?.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-full ${getKpiTypeColor(kpi?.kpi_type)}`}
                                >
                                  {getKpiIcon(kpi?.kpi_type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-lg">
                                    {kpi?.name}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Badge
                                      variant="outline"
                                      className="capitalize"
                                    >
                                      {kpi?.kpi_type}
                                    </Badge>
                                    <span>•</span>
                                    <span>{kpi?.unit}</span>
                                    {kpi?.is_primary && (
                                      <>
                                        <span>•</span>
                                        <Badge variant="secondary">
                                          Primary
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    {latestValue?.toLocaleString() || 'N/A'}
                                    <span className="text-sm font-normal ml-1">
                                      {kpi?.unit}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                  >
                                    {growth >= 0 ? '+' : ''}
                                    {growth?.toFixed(1)}% from previous
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div
                                    className={`text-lg font-bold ${achievement >= 90 ? 'text-green-600' : achievement < 70 ? 'text-red-600' : 'text-yellow-600'}`}
                                  >
                                    {achievement?.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Target
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                              <div className="space-y-2">
                                <h5 className="font-medium">Target Details</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Target Value</span>
                                    <span className="font-medium">
                                      {kpi?.target_value?.toLocaleString() ??
                                        'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Current Value</span>
                                    <span className="font-medium">
                                      {latestValue?.toLocaleString() ?? 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Variance</span>
                                    <span
                                      className={`font-medium ${kpi?.performance_vs_target?.difference && kpi?.performance_vs_target?.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                      {kpi?.performance_vs_target
                                        ?.difference ? (
                                        <>
                                          {kpi?.performance_vs_target
                                            ?.difference >= 0
                                            ? '+'
                                            : ''}
                                          {kpi?.performance_vs_target?.difference?.toLocaleString()}
                                        </>
                                      ) : (
                                        'N/A'
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="font-medium">Trend Summary</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Periods Tracked</span>
                                    <span className="font-medium">
                                      {trendDates?.length}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Latest Update</span>
                                    <span className="font-medium">
                                      {kpi?.latest_value?.period_date
                                        ? formatDate(
                                            kpi?.latest_value?.period_date,
                                          )
                                        : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Average Value</span>
                                    <span className="font-medium">
                                      {(trendDates?.length ?? 0) > 0
                                        ? (
                                            Object.values(trend)?.reduce(
                                              (a, b) => a + b,
                                              0,
                                            ) / (trendDates?.length ?? 1)
                                          )?.toLocaleString()
                                        : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="font-medium">Performance</h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Target Achievement</span>
                                    <span className="font-medium">
                                      {achievement?.toFixed(1)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={Math.min(achievement, 100)}
                                    className="h-2"
                                  />
                                  <div className="text-xs text-muted-foreground">
                                    {achievement >= 90
                                      ? 'On Target'
                                      : achievement < 70
                                        ? 'Needs Attention'
                                        : 'Moderate Progress'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No KPIs configured</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Historical trends for selected KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : trendData?.length > 0 ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0088FE"
                          name="Value"
                          strokeWidth={2}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No trend data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>
                  Comparative analysis of primary KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : radarData?.length > 0 ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar
                          name="Current"
                          dataKey="A"
                          stroke="#0088FE"
                          fill="#0088FE"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Target"
                          dataKey="B"
                          stroke="#00C49F"
                          fill="#00C49F"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No radar chart data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {kpis?.length} KPIs tracked • Last updated{' '}
            {formatDate(new Date().toISOString())}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="success">
              <Download className="mr-2 h-4 w-4" />
              Export Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default KPIDashboardModal;
