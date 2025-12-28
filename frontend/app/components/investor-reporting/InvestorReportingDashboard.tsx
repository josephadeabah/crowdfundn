// app/components/investor-reporting/InvestorReportingDashboard.tsx
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
  Filter,
  MoreHorizontal,
  PieChart,
  LineChart,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Building,
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
import Modal from '@/app/components/modal/Modal';
import { toast } from 'sonner';
import { Skeleton } from '../ui/Skeleton';
import { formatCurrency } from '@/app/utils/helpers/calculate.days';
import InvestorReportsModal from './InvestorReportsModal';
import PortfolioOverviewModal from './PortfolioOverviewModal';
import FinancialStatementsModal from './FinancialStatementsModal';
import KPIDashboardModal from './KPIDashboardModal';
import NotificationPreferencesModal from './NotificationPreferencesModal';
import PortfolioStatementModal from './PortfolioStatementModal';
import { InvestorReportingService } from './services/investor-reporting.service';
import { formatDate } from '@/app/utils/helpers/formatters';

interface PortfolioMetrics {
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

interface InvestorReport {
  id: number;
  title: string;
  report_type: string;
  report_date: string;
  period_description: string;
  status: string;
  download_count: number;
  campaign: {
    id: number;
    name: string;
  };
}

const InvestorReportingDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolioMetrics, setPortfolioMetrics] =
    useState<PortfolioMetrics | null>(null);
  const [campaignPerformance, setCampaignPerformance] = useState<
    CampaignPerformance[]
  >([]);
  const [recentReports, setRecentReports] = useState<InvestorReport[]>([]);
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
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const service = new InvestorReportingService();

      // Fetch portfolio data
      const portfolioData = await service.getPortfolio();
      if (portfolioData.success) {
        setPortfolioMetrics(portfolioData.portfolio.summary);
        setCampaignPerformance(portfolioData.portfolio.by_campaign || []);
      }

      // Fetch recent reports
      const reportsData = await service.getRecentReports();
      if (reportsData.success) {
        setRecentReports(reportsData.reports.slice(0, 5));
      }

      // Fetch notification count
      const notificationsData = await service.getUnreadNotificationCount();
      setUnreadNotifications(notificationsData.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load investor dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = async () => {
    try {
      const service = new InvestorReportingService();
      const response = await service.downloadPortfolioStatement();

      if (response.success && response.url) {
        window.open(response.url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading statement:', error);
      toast.error('Failed to download portfolio statement');
    }
  };

  const handleViewCampaignDetails = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setShowFinancialStatements(true);
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPortfolioStatement(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Statement
          </Button>
          <Button onClick={() => setShowPortfolioOverview(true)} variant='success'>
            <BarChart3 className="mr-2 h-4 w-4" />
            Portfolio Analytics
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
              {portfolioMetrics
                ? formatCurrency(
                    portfolioMetrics.total_invested,
                    portfolioMetrics.currency,
                    portfolioMetrics.currency_symbol,
                  )
                : '₵0.00'}
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
              {portfolioMetrics
                ? formatCurrency(
                    portfolioMetrics.current_value,
                    portfolioMetrics.currency,
                    portfolioMetrics.currency_symbol,
                  )
                : '₵0.00'}
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`font-medium ${portfolioMetrics?.total_returns && portfolioMetrics.total_returns >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {portfolioMetrics?.total_returns &&
                portfolioMetrics.total_returns >= 0
                  ? '+'
                  : ''}
                {portfolioMetrics
                  ? formatCurrency(
                      portfolioMetrics.total_returns,
                      portfolioMetrics.currency,
                      portfolioMetrics.currency_symbol,
                    )
                  : '₵0.00'}
              </span>
              <span
                className={`ml-2 ${portfolioMetrics?.roi && portfolioMetrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                (
                {portfolioMetrics?.roi
                  ? portfolioMetrics.roi.toFixed(2)
                  : '0.00'}
                %)
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
                  {portfolioMetrics?.irr
                    ? portfolioMetrics.irr.toFixed(2)
                    : '0.00'}
                  %
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">MOIC</span>
                <span className="font-medium">
                  {portfolioMetrics?.moic
                    ? portfolioMetrics.moic.toFixed(2)
                    : '0.00'}
                  x
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
                          campaign.current_value,
                          portfolioMetrics?.currency,
                          portfolioMetrics?.currency_symbol,
                        )}
                      </div>
                      <div
                        className={`text-sm ${campaign.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {campaign.roi >= 0 ? '+' : ''}
                        {campaign.roi.toFixed(2)}% ROI
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
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(report.report_date)}</span>
                          <Badge variant="outline">{report.report_type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {report.download_count} downloads
                      </Badge>
                      <Button size="sm" variant="outline">
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
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Moderate concentration - Top 3 holdings represent 35% of
                      portfolio
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sector Diversification</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        Good
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Liquidity Risk</span>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700"
                      >
                        Medium
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow</CardTitle>
                <CardDescription>Investment activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'Jan 2024', invested: 5000, current: 5500 },
                    { month: 'Feb 2024', invested: 3000, current: 3200 },
                    { month: 'Mar 2024', invested: 7000, current: 7500 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Invested: {formatCurrency(item.invested, 'GHS', '₵')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.current, 'GHS', '₵')}
                        </p>
                        <p className="text-sm text-green-600">
                          +
                          {formatCurrency(
                            item.current - item.invested,
                            'GHS',
                            '₵',
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      count: 12,
                      color: 'text-blue-500',
                    },
                    {
                      type: 'Annual Reports',
                      icon: FileText,
                      count: 3,
                      color: 'text-green-500',
                    },
                    {
                      type: 'Valuation Updates',
                      icon: TrendingUp,
                      count: 8,
                      color: 'text-purple-500',
                    },
                    {
                      type: 'Financial Statements',
                      icon: BarChart3,
                      count: 24,
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
                    onClick={() => setShowFinancialStatements(true)}
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
                  {[
                    {
                      title: 'Valuation Update: TechStart Inc.',
                      message: 'Company valuation increased by 15%',
                      time: '2 hours ago',
                      read: false,
                    },
                    {
                      title: 'Q3 Report Published',
                      message: 'Financial statements are now available',
                      time: '1 day ago',
                      read: true,
                    },
                    {
                      title: 'Monthly KPI Update',
                      message: 'New KPIs have been added to dashboard',
                      time: '3 days ago',
                      read: true,
                    },
                  ].map((notification, index) => (
                    <div
                      key={index}
                      className={`flex items-start p-3 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="font-medium">{notification.title}</h5>
                          {!notification.read && (
                            <Badge
                              variant="default"
                              className="ml-2 bg-blue-600"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {notification.time}
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
      <PortfolioOverviewModal
        isOpen={showPortfolioOverview}
        onClose={() => setShowPortfolioOverview(false)}
        portfolioData={{
          summary: portfolioMetrics,
          by_campaign: campaignPerformance,
          performance_metrics: {},
          risk_analysis: {},
          cash_flow: [],
          projections: [],
        }}
      />

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
