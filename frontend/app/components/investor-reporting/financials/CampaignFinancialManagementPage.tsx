'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/button/Button';
import {
  FiArrowLeft,
  FiBarChart2,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiSettings,
} from 'react-icons/fi';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import FinancialStatementsManager from './FinancialStatementsManager';
import FinancialDashboard from './FinancialDashboard';
import KPIManager from './KPIManager';
import InvestorReportsManager from './InvestorReportsManager';
import { Skeleton } from '../../ui/Skeleton';

const CampaignFinancialsPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id as string;
  const { userCampaigns, loading: campaignsLoading } = useCampaignContext();

  const [campaign, setCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (userCampaigns && campaignId) {
      const foundCampaign = userCampaigns.find(
        (c: any) => c.id === parseInt(campaignId),
      );
      setCampaign(foundCampaign);
    }
  }, [userCampaigns, campaignId]);

  if (campaignsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The campaign you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button onClick={() => router.push('/account/dashboard/campaigns')}>
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/account/dashboard/campaigns')}
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {campaign.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Financial Management & Investor Reporting
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-blue-700">Valuation</p>
            <p className="text-lg font-semibold text-blue-900">
              ${campaign.valuation?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-green-700">Equity Offered</p>
            <p className="text-lg font-semibold text-green-900">
              {campaign.equity_offered || 0}%
            </p>
          </div>
          <div className="bg-purple-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-purple-700">Total Raised</p>
            <p className="text-lg font-semibold text-purple-900">
              ${campaign.transferred_amount?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-orange-700">Investors</p>
            <p className="text-lg font-semibold text-orange-900">
              {campaign.total_investors || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <FiBarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center gap-2">
            <FiFileText className="h-4 w-4" />
            <span className="hidden sm:inline">Financials</span>
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FiUsers className="h-4 w-4" />
            <span className="hidden sm:inline">Investor Reports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <FiSettings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard campaignId={parseInt(campaignId)} />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialStatementsManager campaignId={parseInt(campaignId)} />
        </TabsContent>

        <TabsContent value="kpis">
          <KPIManager campaignId={parseInt(campaignId)} />
        </TabsContent>

        <TabsContent value="reports">
          <InvestorReportsManager campaignId={parseInt(campaignId)} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reporting Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Notification Preferences</h4>
                  <p className="text-sm text-gray-500">
                    Configure how investors are notified about new reports
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Report Templates</h4>
                  <p className="text-sm text-gray-500">
                    Customize report formats and branding
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Access Controls</h4>
                  <p className="text-sm text-gray-500">
                    Manage who can view financial information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignFinancialsPage;
