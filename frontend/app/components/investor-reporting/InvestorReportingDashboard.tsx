'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  Bell,
  TrendingUp,
  Download,
  Calendar,
  Eye,
  DollarSign,
  Users,
  Building,
  PieChart,
  LineChart,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
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
import { useAuth } from '@/app/context/auth/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '../ui/Skeleton';
import {
  formatCurrency,
  safeToFixed,
  safeToNumber,
} from '@/app/utils/helpers/formatters';
import InvestorReportsModal from './InvestorReportsModal';
import PortfolioOverviewModal from './PortfolioOverviewModal';
import FinancialStatementsModal from './FinancialStatementsModal';
import KPIDashboardModal from './KPIDashboardModal';
import NotificationPreferencesModal from './NotificationPreferencesModal';
import PortfolioStatementModal from './PortfolioStatementModal';
import { investorReportingService } from './services/investor-reporting.service';

interface PortfolioMetrics {
  total_invested: number | string;
  current_value: number | string;
  total_returns: number | string;
  roi: number | string;
  moic: number | string;
  irr: number | string;
  invested_campaigns: number;
  active_investments: number;
  currency: string;
  currency_symbol: string;
}

interface CampaignPerformance {
  campaign_id: number;
  campaign_name: string;
  company_name: string;
  invested: number | string;
  current_value: number | string;
  returns: number | string;
  roi: number | string;
  ownership_percentage: number | string;
  investment_count: number;
  latest_valuation: number | string;
}

interface PortfolioData {
  summary: PortfolioMetrics;
  by_campaign: CampaignPerformance[];
  performance_metrics?: any;
  risk_analysis?: any;
  cash_flow?: any[];
  projections?: any[];
}

const InvestorReportingDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null,
  );
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Modal states
  const [showPortfolioOverview, setShowPortfolioOverview] = useState(false);
  const [showFinancialStatements, setShowFinancialStatements] = useState(false);
  const [showKPIDashboard, setShowKPIDashboard] = useState(false);
  const [showInvestorReports, setShowInvestorReports] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] =
    useState(false);
  const [showPortfolioStatement, setShowPortfolioStatement] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (token) {
      investorReportingService.setToken(token);
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch portfolio data
      const portfolioResponse = await investorReportingService.getPortfolio();
      if (portfolioResponse?.success) {
        setPortfolioData(portfolioResponse.portfolio);
      } else {
        toast.error('Failed to load portfolio data');
      }

      // Fetch recent reports
      const reportsResponse =
        await investorReportingService.getRecentInvestorReports(5);
      if (reportsResponse?.success) {
        setRecentReports(reportsResponse.reports || []);
      }

      // Fetch notification count
      const notificationsResponse =
        await investorReportingService.getUnreadNotificationCount();
      setUnreadNotifications(notificationsResponse?.count || 0);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error?.message || 'Failed to load investor dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = async () => {
    try {
      const response =
        await investorReportingService.downloadPortfolioStatement();
      if (response?.success && response.url) {
        window.open(response.url, '_blank');
        toast.success('Portfolio statement downloaded successfully');
      } else {
        toast.error('Failed to download portfolio statement');
      }
    } catch (error: any) {
      console.error('Error downloading statement:', error);
      toast.error(error.message || 'Failed to download portfolio statement');
    }
  };

  const handleViewCampaignDetails = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setShowFinancialStatements(true);
  };

  // In InvestorReportingDashboard.tsx, update the handleDownloadReport function:
  const handleDownloadReport = async (reportId: number) => {
    try {
      // First try to get document info
      const response = await investorReportingService.getDocumentInfo(reportId);

      if (response?.success && response?.document?.file_url) {
        // If we have a direct file URL, open it
        window.open(response.document.file_url, '_blank');
        toast.success('Opening report...');
      } else {
        // Otherwise use the download endpoint
        await investorReportingService.downloadDocument(reportId);
        toast.success('Download initiated');
      }
    } catch (error: any) {
      console.error('Error downloading report:', error);

      if (error?.message?.includes('Document not found')) {
        toast.error('Document not found');
      } else {
        toast.error(error?.message || 'Failed to download report');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const portfolioMetrics = portfolioData?.summary;
  const campaignPerformance = portfolioData?.by_campaign || [];
  const riskAnalysis = portfolioData?.risk_analysis || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your investments, performance, and receive updates from
            portfolio companies
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPortfolioStatement(true)}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Download Statement</span>
          </Button>
          <Button
            onClick={() => setShowPortfolioOverview(true)}
            variant="success"
            className="w-full sm:w-auto"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Portfolio Analytics</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invested
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                safeToNumber(portfolioMetrics?.total_invested) || 0,
                portfolioMetrics?.currency || 'GHS',
                portfolioMetrics?.currency_symbol || '₵',
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {portfolioMetrics?.invested_campaigns || 0} campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                safeToNumber(portfolioMetrics?.current_value) || 0,
                portfolioMetrics?.currency || 'GHS',
                portfolioMetrics?.currency_symbol || '₵',
              )}
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`font-medium ${
                  safeToNumber(portfolioMetrics?.total_returns) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {safeToNumber(portfolioMetrics?.total_returns) >= 0 ? '+' : ''}
                {formatCurrency(
                  safeToNumber(portfolioMetrics?.total_returns) || 0,
                  portfolioMetrics?.currency || 'GHS',
                  portfolioMetrics?.currency_symbol || '₵',
                )}
              </span>
              <span
                className={`ml-2 ${
                  safeToNumber(portfolioMetrics?.roi) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                ({safeToFixed(portfolioMetrics?.roi, 2)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Metrics
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IRR</span>
                <span className="font-medium">
                  {safeToFixed(portfolioMetrics?.irr, 2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">MOIC</span>
                <span className="font-medium">
                  {safeToFixed(portfolioMetrics?.moic, 2)}x
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Top performing investments in your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.campaign_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Building className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{campaign.company_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {campaign.investment_count} investment
                          {campaign.investment_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(
                          safeToNumber(campaign.current_value),
                          portfolioMetrics?.currency || 'GHS',
                          portfolioMetrics?.currency_symbol || '₵',
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          safeToNumber(campaign.roi) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {safeToNumber(campaign.roi) >= 0 ? '+' : ''}
                        {safeToFixed(campaign.roi, 2)}% ROI
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleViewCampaignDetails(campaign.campaign_id)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {campaignPerformance.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No investment data available yet</p>
                    <p className="text-sm">
                      Start investing to see your portfolio performance
                    </p>
                  </div>
                )}
              </div>

              {campaignPerformance.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowPortfolioOverview(true)}
                  >
                    View Full Portfolio
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Latest updates from your portfolio companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-emerald-700" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {report.report_date
                              ? new Date(
                                  report.report_date,
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {report.report_type?.replace('_', ' ') || 'Report'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {report.download_count || 0} downloads
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {recentReports.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reports available yet</p>
                    <p className="text-sm">
                      Reports will appear here as companies publish them
                    </p>
                  </div>
                )}
              </div>

              {recentReports.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowInvestorReports(true)}
                  >
                    View All Reports
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>
                  Portfolio concentration and risk metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Portfolio Concentration</span>
                      <span className="font-medium">
                        {safeToFixed(
                          safeToNumber(riskAnalysis.concentration_risk) * 100,
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        safeToNumber(riskAnalysis.concentration_risk) * 100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {safeToNumber(riskAnalysis.concentration_risk) > 0.5
                        ? 'High concentration - Top holdings represent significant portion'
                        : safeToNumber(riskAnalysis.concentration_risk) > 0.3
                          ? 'Moderate concentration'
                          : 'Well diversified portfolio'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Category</span>
                      <Badge
                        variant={
                          riskAnalysis.risk_category === 'high'
                            ? 'destructive'
                            : riskAnalysis.risk_category === 'medium'
                              ? 'outline'
                              : 'secondary'
                        }
                      >
                        {riskAnalysis.risk_category?.toUpperCase() || 'MEDIUM'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Risk Score</span>
                      <span className="font-medium">
                        {safeToFixed(
                          safeToNumber(riskAnalysis.overall_risk_score) * 100,
                          1,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Activity</CardTitle>
                <CardDescription>Recent investment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData?.cash_flow
                    ?.slice(0, 3)
                    .map((cashflow, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{cashflow.month}</p>
                          <p className="text-sm text-muted-foreground">
                            Invested:{' '}
                            {formatCurrency(
                              safeToNumber(cashflow.invested),
                              portfolioMetrics?.currency || 'GHS',
                              portfolioMetrics?.currency_symbol || '₵',
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(
                              safeToNumber(cashflow.current_value),
                              portfolioMetrics?.currency || 'GHS',
                              portfolioMetrics?.currency_symbol || '₵',
                            )}
                          </p>
                          <p
                            className={`text-sm ${
                              safeToNumber(cashflow.returns) >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {safeToNumber(cashflow.returns) >= 0 ? '+' : ''}
                            {formatCurrency(
                              safeToNumber(cashflow.returns),
                              portfolioMetrics?.currency || 'GHS',
                              portfolioMetrics?.currency_symbol || '₵',
                            )}
                          </p>
                        </div>
                      </div>
                    ))}

                  {!portfolioData?.cash_flow?.length && (
                    <p className="text-center text-muted-foreground py-4">
                      No recent investment activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Types */}
            <Card>
              <CardHeader>
                <CardTitle>Report Types</CardTitle>
                <CardDescription>
                  Different types of investor reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: 'Quarterly Reports',
                      icon: FileText,
                      count: recentReports.filter(
                        (r) => r.report_type === 'quarterly',
                      ).length,
                      color: 'text-blue-500',
                    },
                    {
                      type: 'Annual Reports',
                      icon: FileText,
                      count: recentReports.filter(
                        (r) => r.report_type === 'annual',
                      ).length,
                      color: 'text-green-500',
                    },
                    {
                      type: 'Valuation Updates',
                      icon: TrendingUp,
                      count: recentReports.filter(
                        (r) => r.report_type === 'valuation_update',
                      ).length,
                      color: 'text-purple-500',
                    },
                    {
                      type: 'Financial Statements',
                      icon: BarChart3,
                      count: 0,
                      color: 'text-orange-500',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your investor reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowInvestorReports(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View All Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowPortfolioStatement(true)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Portfolio Statement
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (campaignPerformance.length > 0) {
                        setSelectedCampaignId(
                          campaignPerformance[0].campaign_id,
                        );
                        setShowFinancialStatements(true);
                      }
                    }}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Financial Statements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how and when you receive updates about your
                    investments
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowNotificationPreferences(true)}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Manage Preferences
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unreadNotifications > 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          {unreadNotifications} unread notification
                          {unreadNotifications !== 1 ? 's' : ''}
                        </h4>
                        <p className="text-sm text-blue-700">
                          You have unread updates from your portfolio companies
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-green-900">
                          All caught up!
                        </h4>
                        <p className="text-sm text-green-700">
                          You have no unread notifications
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Notifications</h4>
                  {recentReports.slice(0, 3).map((report, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="font-medium">{report.title}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.campaign?.company_name} published a new{' '}
                          {report.report_type} report
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {report.report_date
                            ? new Date(report.report_date).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {portfolioData && (
        <PortfolioOverviewModal
          isOpen={showPortfolioOverview}
          onClose={() => setShowPortfolioOverview(false)}
          portfolioData={portfolioData}
        />
      )}

      <FinancialStatementsModal
        isOpen={showFinancialStatements}
        onClose={() => {
          setShowFinancialStatements(false);
          setSelectedCampaignId(null);
        }}
        campaignId={selectedCampaignId}
      />

      <KPIDashboardModal
        isOpen={showKPIDashboard}
        onClose={() => setShowKPIDashboard(false)}
        campaignId={selectedCampaignId}
      />

      <InvestorReportsModal
        isOpen={showInvestorReports}
        onClose={() => setShowInvestorReports(false)}
      />

      <NotificationPreferencesModal
        isOpen={showNotificationPreferences}
        onClose={() => setShowNotificationPreferences(false)}
      />

      <PortfolioStatementModal
        isOpen={showPortfolioStatement}
        onClose={() => setShowPortfolioStatement(false)}
        onDownload={handleDownloadStatement}
      />
    </div>
  );
};

export default InvestorReportingDashboard;
