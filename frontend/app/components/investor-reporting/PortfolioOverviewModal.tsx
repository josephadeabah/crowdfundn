// app/components/investor-reporting/PortfolioOverviewModal.tsx
'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  Filter,
  Calendar,
  Building,
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
import { toast } from 'sonner';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
  formatNumber,
} from '@/app/utils/helpers/formatters';

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
  if (!portfolioData) return null;

  const summary = portfolioData.summary || {};
  const campaigns = portfolioData.by_campaign || [];
  const riskAnalysis = portfolioData.risk_analysis || {};
  const projections = portfolioData.projections || [];

  const handleExportData = () => {
    toast.info('Export feature coming soon');
  };

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
                      summary.total_invested || 0,
                      summary.currency,
                      summary.currency_symbol,
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
                      summary.current_value || 0,
                      summary.currency,
                      summary.currency_symbol,
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
                    className={`text-2xl font-bold ${
                      (summary.total_returns || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(
                      summary.total_returns || 0,
                      summary.currency,
                      summary.currency_symbol,
                    )}
                  </p>
                </div>
                {(summary.total_returns || 0) >= 0 ? (
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
                    className={`text-2xl font-bold ${
                      (summary.roi || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatPercentage(summary.roi || 0, 2)}
                  </p>
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Detailed performance metrics for each investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign: any) => (
                    <div
                      key={campaign.campaign_id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Building className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">
                            {campaign.company_name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>
                              {campaign.investment_count} investment
                              {campaign.investment_count !== 1 ? 's' : ''}
                            </span>
                            <span>•</span>
                            <span>
                              {formatNumber(
                                campaign.ownership_percentage || 0,
                                2,
                              )}
                              % ownership
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(
                            campaign.current_value || 0,
                            summary.currency,
                            summary.currency_symbol,
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Invested:{' '}
                          {formatCurrency(
                            campaign.invested || 0,
                            summary.currency,
                            summary.currency_symbol,
                          )}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            (campaign.roi || 0) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {(campaign.roi || 0) >= 0 ? '+' : ''}
                          {formatPercentage(campaign.roi || 0, 2)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {campaigns.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No investment data available</p>
                    </div>
                  )}
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
                  {riskAnalysis && (
                    <>
                      <div>
                        <h4 className="font-medium mb-3">Risk Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-3">
                            <div className="text-sm text-muted-foreground mb-1">
                              Portfolio Concentration
                            </div>
                            <div className="text-lg font-medium">
                              {formatPercentage(
                                (riskAnalysis.concentration_risk || 0) * 100,
                                1,
                              )}
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
                              {formatPercentage(
                                (riskAnalysis.overall_risk_score || 0) * 100,
                                1,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {riskAnalysis.risk_category?.toUpperCase() ||
                                'MEDIUM'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
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
