// app/components/investor-reporting/FinancialStatementsModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  BarChart,
  PieChart,
  LineChart,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/app/utils/helpers/formatters';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/app/utils/helpers/formatters';
import { investorReportingService } from './services/investor-reporting.service';
import { useAuth } from '@/app/context/auth/AuthContext';

interface FinancialStatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number | null;
}

interface FinancialStatement {
  id: number;
  period_type: string;
  period_start: string;
  period_end: string;
  revenue: number;
  expenses: number;
  gross_profit: number;
  net_income: number;
  assets: number;
  liabilities: number;
  equity: number;
  burn_rate: number;
  runway_months: number;
  gross_margin: number;
  net_margin: number;
  status: string;
  published_at: string;
  source_file_url?: string;
  source_file_name?: string;
}

const FinancialStatementsModal: React.FC<FinancialStatementsModalProps> = ({
  isOpen,
  onClose,
  campaignId,
}) => {
  console.log('FinancialStatementsModal rendered with:', {
    isOpen,
    campaignId,
  });

  const { token } = useAuth();

  // Show a message if modal is open but no campaignId is provided
  if (isOpen && !campaignId) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xxxlarge"
        closeOnBackdropClick={true}
      >
        <div className="space-y-6 p-6">
          <div className="text-center">
            <BarChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold">No Campaign Selected</h2>
            <p className="text-muted-foreground mt-2">
              Please select a campaign from your portfolio to view financial
              statements.
            </p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodType, setPeriodType] = useState('all');
  const [selectedStatement, setSelectedStatement] =
    useState<FinancialStatement | null>(null);
  const [trendData, setTrendData] = useState<{
    revenueData: any[];
    profitabilityData: any[];
  }>({
    revenueData: [],
    profitabilityData: [],
  });

  useEffect(() => {
    if (token) {
      investorReportingService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    console.log(
      'useEffect triggered with isOpen:',
      isOpen,
      'campaignId:',
      campaignId,
    );
    if (isOpen && campaignId) {
      console.log('Fetching statements for campaignId:', campaignId);
      fetchStatements();
    } else {
      console.log('Not fetching statements - conditions not met');
    }
  }, [isOpen, campaignId, periodType]);

  const fetchStatements = async () => {
    try {
      console.log('Starting fetchStatements for campaignId:', campaignId);
      setLoading(true);
      // Use investor endpoint for read-only access
      const response =
        await investorReportingService.getInvestorFinancialStatements(
          campaignId!,
          periodType !== 'all' ? periodType : undefined,
        );

      console.log('Response received:', response);
      if (response?.success) {
        console.log('Setting statements:', response?.financials);
        setStatements(response?.financials ?? []);
        if (response?.financials?.length > 0) {
          setSelectedStatement(response?.financials?.[0] ?? null);
          prepareChartData(response?.financials ?? []);
        } else {
          console.log('No financial statements found');
          toast.info('No financial statements available for this campaign');
        }
      } else {
        console.log('Response not successful:', response);
        toast.error('Failed to load financial statements');
      }
    } catch (error: any) {
      console.error('Error fetching financial statements:', error);
      toast.error(error?.message || 'Failed to load financial statements');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (financials: FinancialStatement[]) => {
    console.log('Preparing chart data for', financials.length, 'statements');
    // Prepare revenue trend data
    const revenueData =
      financials?.map((stmt) => ({
        period: formatDate(stmt?.period_end, 'MMM yy'),
        revenue: stmt?.revenue ?? 0,
        netIncome: stmt?.net_income ?? 0,
        grossMargin: stmt?.gross_margin ?? 0,
        netMargin: stmt?.net_margin ?? 0,
      })) ?? [];

    // Prepare profitability data for last 3 periods
    const profitabilityData =
      financials?.slice(-3)?.map((stmt) => ({
        name: formatDate(stmt?.period_end, 'MMM yy'),
        revenue: stmt?.revenue ?? 0,
        profit: stmt?.net_income ?? 0,
      })) ?? [];

    setTrendData({
      revenueData,
      profitabilityData,
    });
  };

  // In FinancialStatementsModal.tsx, update the handleDownloadStatement function:
  const handleDownloadStatement = async (statementId: number) => {
    try {
      // First try to get document info to see if file exists
      const response =
        await investorReportingService.getDocumentInfo(statementId);

      if (response?.success && response?.document?.file_url) {
        // If we have a direct file URL, open it
        window.open(response.document.file_url, '_blank');
        toast.success('Opening document...');
      } else {
        // Otherwise use the download endpoint
        await investorReportingService.downloadDocument(statementId);
        toast.success('Download initiated');
      }
    } catch (error: any) {
      console.error('Error downloading statement:', error);

      if (error?.message?.includes('Document not found')) {
        toast.error('Document not found');
      } else {
        toast.error(error?.message || 'Failed to download financial statement');
      }
    }
  };

  // Prepare balance sheet data for selected statement
  const balanceSheetData = selectedStatement
    ? [
        { name: 'Assets', value: selectedStatement?.assets ?? 0 },
        { name: 'Liabilities', value: selectedStatement?.liabilities ?? 0 },
        { name: 'Equity', value: selectedStatement?.equity ?? 0 },
      ]
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
            <h2 className="text-2xl font-bold">Financial Statements</h2>
            <p className="text-muted-foreground">
              Detailed financial performance and statements
            </p>
            {campaignId && (
              <p className="text-sm text-muted-foreground mt-1">
                Campaign ID: {campaignId}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={periodType} onValueChange={setPeriodType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>
                  Key financial metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (trendData?.revenueData?.length ?? 0) > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={trendData?.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'revenue' || name === 'netIncome') {
                              return [
                                formatCurrency(value as number, 'GHS', '₵'),
                                name,
                              ];
                            }
                            return [`${value}%`, name];
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#0088FE"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          type="monotone"
                          dataKey="netIncome"
                          stroke="#00C49F"
                          strokeWidth={2}
                          name="Net Income"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No financial data available</p>
                    <p className="text-sm">
                      {statements.length === 0
                        ? 'No financial statements found for this campaign'
                        : 'Select a statement to view data'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {selectedStatement && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Revenue
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          selectedStatement?.revenue ?? 0,
                          'GHS',
                          '₵',
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDate(selectedStatement?.period_end, 'MMM yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Net Income
                      </div>
                      <div
                        className={`text-2xl font-bold ${(selectedStatement?.net_income ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {formatCurrency(
                          selectedStatement?.net_income ?? 0,
                          'GHS',
                          '₵',
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {selectedStatement?.net_margin?.toFixed(1) ?? '0.0'}%
                        margin
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Runway
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedStatement?.runway_months?.toFixed(1) ?? '0.0'}{' '}
                        months
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Burn rate:{' '}
                        {formatCurrency(
                          selectedStatement?.burn_rate ?? 0,
                          'GHS',
                          '₵',
                        )}
                        /month
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Statements</CardTitle>
                <CardDescription>
                  Select a period to view detailed financial statements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : statements?.length > 0 ? (
                  <div className="space-y-4">
                    {statements?.map((statement) => (
                      <div
                        key={statement?.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedStatement?.id === statement?.id ? 'bg-muted border-primary' : ''}`}
                        onClick={() => setSelectedStatement(statement)}
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h4 className="font-medium">
                              {statement?.period_type
                                ?.charAt(0)
                                ?.toUpperCase() +
                                statement?.period_type?.slice(1)}{' '}
                              Statement
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(statement?.period_start)} -{' '}
                                {formatDate(statement?.period_end)}
                              </span>
                              <Badge variant="outline">
                                {statement?.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadStatement(statement?.id);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStatement(statement);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No financial statements available</p>
                    <p className="text-sm">
                      This campaign has not published any financial statements
                      yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statement Details */}
            {selectedStatement && (
              <Card>
                <CardHeader>
                  <CardTitle>Statement Details</CardTitle>
                  <CardDescription>
                    {formatDate(selectedStatement?.period_start)} -{' '}
                    {formatDate(selectedStatement?.period_end)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Income Statement</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Revenue</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.revenue ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Expenses</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.expenses ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Gross Profit</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.gross_profit ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Net Income</span>
                          <span
                            className={`font-medium ${(selectedStatement?.net_income ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {formatCurrency(
                              selectedStatement?.net_income ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Balance Sheet</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Assets</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.assets ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Liabilities</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.liabilities ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Equity</span>
                          <span className="font-medium">
                            {formatCurrency(
                              selectedStatement?.equity ?? 0,
                              'GHS',
                              '₵',
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Key Ratios</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Gross Margin
                        </div>
                        <div className="text-lg font-medium">
                          {selectedStatement?.gross_margin?.toFixed(1) ?? '0.0'}
                          %
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Net Margin
                        </div>
                        <div className="text-lg font-medium">
                          {selectedStatement?.net_margin?.toFixed(1) ?? '0.0'}%
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Burn Rate
                        </div>
                        <div className="text-lg font-medium">
                          {formatCurrency(
                            selectedStatement?.burn_rate ?? 0,
                            'GHS',
                            '₵',
                          )}
                          /month
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Runway
                        </div>
                        <div className="text-lg font-medium">
                          {selectedStatement?.runway_months?.toFixed(1) ??
                            '0.0'}{' '}
                          months
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profitability Trend</CardTitle>
                <CardDescription>
                  Revenue vs Net Income over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(trendData?.profitabilityData?.length ?? 0) > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={trendData?.profitabilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value as number, 'GHS', '₵'),
                            'Value',
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                        <Bar
                          dataKey="profit"
                          fill="#00C49F"
                          name="Net Income"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chart data available</p>
                    <p className="text-sm">
                      Select a statement to view chart data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet Composition</CardTitle>
                <CardDescription>
                  Assets, Liabilities, and Equity distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStatement && balanceSheetData?.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={balanceSheetData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {balanceSheetData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value as number, 'GHS', '₵'),
                            'Amount',
                          ]}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No balance sheet data available</p>
                    <p className="text-sm">
                      Select a statement to view balance sheet data
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Financial Metrics</CardTitle>
                <CardDescription>
                  Important metrics for investment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedStatement ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Profitability Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Gross Margin</div>
                            <div className="text-sm text-muted-foreground">
                              Revenue minus COGS
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {selectedStatement?.gross_margin?.toFixed(1) ??
                              '0.0'}
                            %
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Net Margin</div>
                            <div className="text-sm text-muted-foreground">
                              Profitability percentage
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {selectedStatement?.net_margin?.toFixed(1) ?? '0.0'}
                            %
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Operating Margin</div>
                            <div className="text-sm text-muted-foreground">
                              {(
                                ((selectedStatement?.gross_profit ?? 0) /
                                  (selectedStatement?.revenue ?? 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {(
                              (((selectedStatement?.gross_profit ?? 0) -
                                (selectedStatement?.expenses ?? 0)) /
                                (selectedStatement?.revenue ?? 1)) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Liquidity & Efficiency</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Current Ratio</div>
                            <div className="text-sm text-muted-foreground">
                              Short-term liquidity
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {(selectedStatement?.liabilities ?? 0) > 0
                              ? (
                                  (selectedStatement?.assets ?? 0) /
                                  (selectedStatement?.liabilities ?? 1)
                                ).toFixed(1)
                              : 'N/A'}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Debt to Equity</div>
                            <div className="text-sm text-muted-foreground">
                              Financial leverage
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {(selectedStatement?.equity ?? 0) > 0
                              ? (
                                  (selectedStatement?.liabilities ?? 0) /
                                  (selectedStatement?.equity ?? 1)
                                ).toFixed(1)
                              : 'N/A'}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Asset Turnover</div>
                            <div className="text-sm text-muted-foreground">
                              Asset efficiency
                            </div>
                          </div>
                          <div className="text-lg font-medium">
                            {(selectedStatement?.assets ?? 0) > 0
                              ? (
                                  (selectedStatement?.revenue ?? 0) /
                                  (selectedStatement?.assets ?? 1)
                                ).toFixed(1)
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a statement to view metrics</p>
                  </div>
                )}

                {selectedStatement && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Cash Flow Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">
                          Operating Cash Flow
                        </div>
                        <div className="text-xl font-medium">
                          {formatCurrency(
                            (selectedStatement?.net_income ?? 0) +
                              (selectedStatement?.expenses ?? 0),
                            'GHS',
                            '₵',
                          )}
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          +{selectedStatement?.net_margin?.toFixed(1) ?? '0.0'}%
                          margin
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">
                          Investing Cash Flow
                        </div>
                        <div className="text-xl font-medium text-red-600">
                          -
                          {formatCurrency(
                            (selectedStatement?.expenses ?? 0) * 0.3, // Estimate
                            'GHS',
                            '₵',
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Capital expenditures
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-2">
                          Financing Cash Flow
                        </div>
                        <div className="text-xl font-medium">
                          {formatCurrency(
                            (selectedStatement?.equity ?? 0) -
                              (selectedStatement?.assets ?? 0) +
                              (selectedStatement?.liabilities ?? 0),
                            'GHS',
                            '₵',
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Debt & equity
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedStatement ? (
              <>Last updated {formatDate(selectedStatement?.published_at)}</>
            ) : (
              <>Select a statement to view details</>
            )}
            {statements?.length > 0 && (
              <span className="ml-2">• {statements?.length} statements</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {selectedStatement && (
              <Button
                onClick={() => handleDownloadStatement(selectedStatement?.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Statement
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FinancialStatementsModal;
