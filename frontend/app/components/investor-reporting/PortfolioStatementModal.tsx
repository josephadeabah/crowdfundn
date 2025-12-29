// app/components/investor-reporting/PortfolioStatementModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  FileText,
  Printer,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  PieChart,
  BarChart3,
  Mail,
  Building,
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
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { formatDate, formatCurrency } from '@/app/utils/helpers/formatters';
import { InvestorReportingService } from './services/investor-reporting.service';
import { Skeleton } from '../ui/Skeleton';
import { useAuth } from '@/app/context/auth/AuthContext';

interface PortfolioStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_returns: number;
  roi: number;
  moic: number;
  irr: number;
  invested_campaigns: number;
  active_investments: number;
  currency: string;
  currency_symbol: string;
}

interface CampaignPerformance {
  campaign_id: number;
  campaign_name: string;
  company_name: string;
  invested: number;
  current_value: number;
  returns: number;
  roi: number;
  ownership_percentage: number;
  investment_count: number;
  latest_valuation: number;
}

interface StatementHistory {
  id: number;
  date: string;
  period: string;
  format: string;
  size: string;
  download_url: string;
}

const PortfolioStatementModal: React.FC<PortfolioStatementModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('current');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<{
    summary: PortfolioSummary | null;
    campaigns: CampaignPerformance[];
  }>({
    summary: null,
    campaigns: [],
  });
  const [statementHistory, setStatementHistory] = useState<StatementHistory[]>(
    [],
  );
  const [includeSections, setIncludeSections] = useState<string[]>([
    'summary',
    'performance',
    'campaigns',
    'risk',
  ]);

  const service = new InvestorReportingService();

  useEffect(() => {
    if (isOpen) {
      fetchPortfolioData();
      fetchStatementHistory();
    }
  }, [isOpen]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const response = await service.getPortfolio();

      if (response?.success && response?.portfolio) {
        setPortfolioData({
          summary: response?.portfolio?.summary ?? null,
          campaigns: response?.portfolio?.by_campaign ?? [],
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatementHistory = async () => {
    try {
      const response = await service.getStatementHistory();
      if (response?.success) {
        setStatementHistory(response?.statements ?? []);
      }
    } catch (error) {
      console.error('Error fetching statement history:', error);
      // This is okay, the endpoint might not be implemented yet
    }
  };

  const handleGenerateStatement = async () => {
    try {
      setGenerating(true);

      const options = {
        period: period,
        format: format,
        includeSections: includeSections,
      };

      const response = await service.generatePortfolioStatement(options);

      if (response?.success) {
        toast.success('Portfolio statement generated successfully');
        if (response?.url) {
          window.open(response?.url, '_blank');
        }
        onDownload();

        // Refresh statement history
        fetchStatementHistory();
      } else {
        toast.error('Failed to generate portfolio statement');
      }
    } catch (error: any) {
      console.error('Error generating statement:', error);
      toast.error(error?.message || 'Failed to generate portfolio statement');
    } finally {
      setGenerating(false);
    }
  };

  const handleSectionToggle = (section: string) => {
    setIncludeSections((prev) =>
      prev?.includes(section)
        ? prev?.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const periods = [
    {
      value: 'current',
      label: 'Current Month',
      description: 'Statement for current month',
    },
    {
      value: 'last_month',
      label: 'Last Month',
      description: 'Statement for previous month',
    },
    {
      value: 'quarter',
      label: 'This Quarter',
      description: 'Quarterly statement',
    },
    {
      value: 'year',
      label: 'Year to Date',
      description: 'Year-to-date statement',
    },
    {
      value: 'all',
      label: 'All Time',
      description: 'Complete portfolio history',
    },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', description: 'Standard PDF format' },
    { value: 'excel', label: 'Excel', description: 'Spreadsheet for analysis' },
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
  ];

  const sections = [
    {
      id: 'summary',
      name: 'Portfolio Summary',
      description: 'Investment overview and totals',
      required: true,
    },
    {
      id: 'performance',
      name: 'Performance Analysis',
      description: 'ROI, returns, and growth metrics',
      required: true,
    },
    {
      id: 'campaigns',
      name: 'Campaign Details',
      description: 'Individual investment breakdowns',
      required: false,
    },
    {
      id: 'risk',
      name: 'Risk Analysis',
      description: 'Portfolio risk metrics',
      required: false,
    },
    {
      id: 'cashflow',
      name: 'Cash Flow',
      description: 'Investment activity over time',
      required: false,
    },
    {
      id: 'projections',
      name: 'Future Projections',
      description: 'Portfolio growth projections',
      required: false,
    },
  ];

  // Calculate top 3 campaigns for preview
  const topCampaigns = portfolioData?.campaigns
    ?.sort((a, b) => (b?.invested ?? 0) - (a?.invested ?? 0))
    ?.slice(0, 3);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xlarge"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Statement</h2>
            <p className="text-muted-foreground">
              Generate and download your investment portfolio statement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print Preview
            </Button>
          </div>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Statement Configuration</CardTitle>
            <CardDescription>
              Customize your portfolio statement before generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">
                      Statement Period
                    </Label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((p) => (
                          <SelectItem key={p?.value} value={p?.value}>
                            <div>
                              <div className="font-medium">{p?.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {p?.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2">
                      Statement Format
                    </Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <FileText className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((f) => (
                          <SelectItem key={f?.value} value={f?.value}>
                            <div>
                              <div className="font-medium">{f?.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {f?.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">
                      Include Sections
                    </Label>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {sections.map((section) => (
                        <div
                          key={section?.id}
                          className="flex items-start space-x-3 cursor-pointer"
                          onClick={() =>
                            !section?.required && handleSectionToggle(section?.id)
                          }
                        >
                          <div
                            className={`mt-1 ${section?.required ? 'text-green-500' : includeSections?.includes(section?.id) ? 'text-green-500' : 'text-gray-300'}`}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {section?.name}
                              {section?.required && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {section?.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Statement Preview</CardTitle>
            <CardDescription>
              Preview of what your statement will include
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : portfolioData?.summary ? (
              <div className="border rounded-lg p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">
                      INVESTMENT PORTFOLIO STATEMENT
                    </h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Generated on {formatDate(new Date().toISOString())} |
                    Period:{' '}
                    {periods?.find((p) => p?.value === period)?.label ||
                      'Current Month'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Investor: {user?.full_name || user?.email}
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Total Invested
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        portfolioData?.summary?.total_invested ?? 0,
                        portfolioData?.summary?.currency,
                        portfolioData?.summary?.currency_symbol,
                      )}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Current Value
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        portfolioData?.summary?.current_value ?? 0,
                        portfolioData?.summary?.currency,
                        portfolioData?.summary?.currency_symbol,
                      )}
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Total Returns
                    </div>
                    <div
                      className={`text-2xl font-bold ${(portfolioData?.summary?.total_returns ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(
                        portfolioData?.summary?.total_returns ?? 0,
                        portfolioData?.summary?.currency,
                        portfolioData?.summary?.currency_symbol,
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance */}
                {includeSections?.includes('performance') && (
                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">
                          Return on Investment (ROI)
                        </span>
                        <span
                          className={`font-medium ${(portfolioData?.summary?.roi ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {(portfolioData?.summary?.roi?.toFixed(2) ?? '0.00')}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">
                          Internal Rate of Return (IRR)
                        </span>
                        <span className="font-medium">
                          {(portfolioData?.summary?.irr?.toFixed(2) ?? '0.00')}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">
                          Multiple on Invested Capital (MOIC)
                        </span>
                        <span className="font-medium">
                          {(portfolioData?.summary?.moic?.toFixed(2) ?? '0.00')}x
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Campaigns */}
                {includeSections?.includes('campaigns') &&
                  portfolioData?.campaigns?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Portfolio Holdings</h4>
                      <div className="space-y-2">
                        {topCampaigns?.map((campaign, index) => {
                          const percentage =
                            ((campaign?.invested ?? 0) /
                              (portfolioData?.summary?.total_invested ?? 1)) *
                            100;
                          return (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span className="flex items-center">
                                <Building className="h-3 w-3 mr-2 text-muted-foreground" />
                                {campaign?.company_name}
                              </span>
                              <span>
                                {formatCurrency(
                                  campaign?.invested ?? 0,
                                  portfolioData?.summary?.currency,
                                  portfolioData?.summary?.currency_symbol,
                                )}{' '}
                                ({percentage?.toFixed(1)}%)
                              </span>
                            </div>
                          );
                        })}
                        {portfolioData?.campaigns?.length > 3 && (
                          <div className="text-sm text-muted-foreground pt-2">
                            ...and {portfolioData?.campaigns?.length - 3} more
                            campaigns
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                  This is a preview. The full statement will include detailed
                  breakdowns and analysis.
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No portfolio data available</p>
                <p className="text-sm">
                  Start investing to generate portfolio statements
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generation Options */}
        <Card>
          <CardHeader>
            <CardTitle>Generation Options</CardTitle>
            <CardDescription>
              Choose how you want to generate your statement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={() => {
                  toast.info('Email delivery feature coming soon');
                }}
                disabled={!portfolioData?.summary}
              >
                <Mail className="h-8 w-8" />
                <div>
                  <div className="font-medium">Email Delivery</div>
                  <div className="text-xs text-muted-foreground">
                    Receive via email
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={handleGenerateStatement}
                disabled={generating || !portfolioData?.summary}
              >
                {generating ? (
                  <Clock className="h-8 w-8 animate-spin" />
                ) : (
                  <Download className="h-8 w-8" />
                )}
                <div>
                  <div className="font-medium">Download Now</div>
                  <div className="text-xs text-muted-foreground">
                    Direct download
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex-col gap-3"
                onClick={() => {
                  if (portfolioData?.summary) {
                    window.print();
                  } else {
                    toast.error('No portfolio data to print');
                  }
                }}
                disabled={!portfolioData?.summary}
              >
                <Printer className="h-8 w-8" />
                <div>
                  <div className="font-medium">Print Preview</div>
                  <div className="text-xs text-muted-foreground">
                    Print-friendly view
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Statements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Statements</CardTitle>
            <CardDescription>
              Access your previously generated statements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statementHistory?.length > 0 ? (
              <div className="space-y-4">
                {statementHistory?.map((stmt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {stmt?.period} Statement
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Generated {formatDate(stmt?.date)} • {stmt?.format} •{' '}
                          {stmt?.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(stmt?.download_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(stmt?.download_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No statements generated yet</p>
                <p className="text-sm">
                  Generate your first portfolio statement
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {portfolioData?.summary ? (
              <>
                Data as of {formatDate(new Date().toISOString())} •{' '}
                {portfolioData?.summary?.active_investments} active investments
              </>
            ) : (
              'No portfolio data available'
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateStatement}
              disabled={generating || !portfolioData?.summary}
              variant="success"
            >
              {generating ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Statement
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PortfolioStatementModal;