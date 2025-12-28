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
  LineChart
} from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
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
  Cell
} from 'recharts';
import { formatCurrency } from '@/app/utils/helpers/calculate.days';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/app/utils/helpers/formatters';
import { InvestorReportingService } from './services/investor-reporting.service';

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
}

const FinancialStatementsModal: React.FC<FinancialStatementsModalProps> = ({
  isOpen,
  onClose,
  campaignId
}) => {
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodType, setPeriodType] = useState('all');
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchStatements();
    }
  }, [isOpen, campaignId, periodType]);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      const service = new InvestorReportingService();
      const response = await service.getFinancialStatements(campaignId!, periodType);
      
      if (response.success) {
        setStatements(response.financials);
        if (response.financials.length > 0) {
          setSelectedStatement(response.financials[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      toast.error('Failed to load financial statements');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = async (statementId: number) => {
    try {
      const service = new InvestorReportingService();
      const response = await service.downloadFinancialStatement(statementId);
      
      if (response.success && response.url) {
        window.open(response.url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading statement:', error);
      toast.error('Failed to download financial statement');
    }
  };

  // Prepare data for charts
  const chartData = statements.map(stmt => ({
    period: formatDate(stmt.period_end, 'MMM yy'),
    revenue: stmt.revenue,
    netIncome: stmt.net_income,
    grossMargin: stmt.gross_margin,
    netMargin: stmt.net_margin
  }));

  const profitabilityData = statements.slice(-3).map(stmt => ({
    name: formatDate(stmt.period_end, 'MMM yy'),
    revenue: stmt.revenue,
    profit: stmt.net_income
  }));

  const balanceSheetData = selectedStatement ? [
    { name: 'Assets', value: selectedStatement.assets },
    { name: 'Liabilities', value: selectedStatement.liabilities },
    { name: 'Equity', value: selectedStatement.equity }
  ] : [];

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
                ) : chartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
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
                      <div className="text-sm font-medium text-muted-foreground mb-2">Revenue</div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(selectedStatement.revenue, 'GHS', '₵')}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDate(selectedStatement.period_end, 'MMM yyyy')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Net Income</div>
                      <div className={`text-2xl font-bold ${selectedStatement.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(selectedStatement.net_income, 'GHS', '₵')}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {selectedStatement.net_margin.toFixed(1)}% margin
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Runway</div>
                      <div className="text-2xl font-bold">
                        {selectedStatement.runway_months.toFixed(1)} months
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Burn rate: {formatCurrency(selectedStatement.burn_rate, 'GHS', '₵')}/month
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
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : statements.length > 0 ? (
                  <div className="space-y-4">
                    {statements.map((statement) => (
                      <div 
                        key={statement.id} 
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedStatement?.id === statement.id ? 'bg-muted border-primary' : ''}`}
                        onClick={() => setSelectedStatement(statement)}
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <h4 className="font-medium">
                              {statement.period_type.charAt(0).toUpperCase() + statement.period_type.slice(1)} Statement
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(statement.period_start)} - {formatDate(statement.period_end)}
                              </span>
                              <Badge variant="outline">
                                {statement.status}
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
                              handleDownloadStatement(statement.id);
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
                    {formatDate(selectedStatement.period_start)} - {formatDate(selectedStatement.period_end)}
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
                            {formatCurrency(selectedStatement.revenue, 'GHS', '₵')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Expenses</span>
                          <span className="font-medium">
                            {formatCurrency(selectedStatement.expenses, 'GHS', '₵')}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Gross Profit</span>
                          <span className="font-medium">
                            {formatCurrency(selectedStatement.gross_profit, 'GHS', '₵')}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Net Income</span>
                          <span className={`font-medium ${selectedStatement.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(selectedStatement.net_income, 'GHS', '₵')}
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
                            {formatCurrency(selectedStatement.assets, 'GHS', '₵')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Liabilities</span>
                          <span className="font-medium">
                            {formatCurrency(selectedStatement.liabilities, 'GHS', '₵')}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Equity</span>
                          <span className="font-medium">
                            {formatCurrency(selectedStatement.equity, 'GHS', '₵')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Key Ratios</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Gross Margin</div>
                        <div className="text-lg font-medium">{selectedStatement.gross_margin.toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Net Margin</div>
                        <div className="text-lg font-medium">{selectedStatement.net_margin.toFixed(1)}%</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Burn Rate</div>
                        <div className="text-lg font-medium">
                          {formatCurrency(selectedStatement.burn_rate, 'GHS', '₵')}/month
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Runway</div>
                        <div className="text-lg font-medium">{selectedStatement.runway_months.toFixed(1)} months</div>
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
                {profitabilityData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={profitabilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                        <Bar dataKey="profit" fill="#00C49F" name="Net Income" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No chart data available</p>
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
                {selectedStatement && balanceSheetData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={balanceSheetData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {balanceSheetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No balance sheet data available</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Profitability Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Gross Margin</div>
                          <div className="text-sm text-muted-foreground">Revenue minus COGS</div>
                        </div>
                        <div className="text-lg font-medium">
                          {selectedStatement?.gross_margin.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Net Margin</div>
                          <div className="text-sm text-muted-foreground">Profitability percentage</div>
                        </div>
                        <div className="text-lg font-medium">
                          {selectedStatement?.net_margin.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Operating Margin</div>
                          <div className="text-sm text-muted-foreground">Operational efficiency</div>
                        </div>
                        <div className="text-lg font-medium">15.2%</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Liquidity & Efficiency</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Current Ratio</div>
                          <div className="text-sm text-muted-foreground">Short-term liquidity</div>
                        </div>
                        <div className="text-lg font-medium">2.5</div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Debt to Equity</div>
                          <div className="text-sm text-muted-foreground">Financial leverage</div>
                        </div>
                        <div className="text-lg font-medium">0.8</div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Asset Turnover</div>
                          <div className="text-sm text-muted-foreground">Asset efficiency</div>
                        </div>
                        <div className="text-lg font-medium">1.2</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Cash Flow Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Operating Cash Flow</div>
                      <div className="text-xl font-medium">₵125,000</div>
                      <div className="text-sm text-green-600 mt-1">+12% YoY</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Investing Cash Flow</div>
                      <div className="text-xl font-medium text-red-600">-₵45,000</div>
                      <div className="text-sm text-muted-foreground mt-1">Capital expenditures</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">Financing Cash Flow</div>
                      <div className="text-xl font-medium">₵30,000</div>
                      <div className="text-sm text-muted-foreground mt-1">Debt & equity</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedStatement ? (
              <>Last updated {formatDate(selectedStatement.published_at)}</>
            ) : (
              <>Select a statement to view details</>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {selectedStatement && (
              <Button onClick={() => handleDownloadStatement(selectedStatement.id)}>
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