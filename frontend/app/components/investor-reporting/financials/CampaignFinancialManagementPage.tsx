// app/components/financials/CampaignFinancialsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
import Modal from '@/app/components/modal/Modal';

interface CampaignFinancialsPageProps {
  onBackToCampaigns?: () => void;
  selectedCampaignId?: number;
}

const CampaignFinancialsPage: React.FC<CampaignFinancialsPageProps> = ({
  onBackToCampaigns,
  selectedCampaignId,
}) => {
  const {
    userCampaigns,
    loading: campaignsLoading,
    fetchUserCampaigns,
  } = useCampaignContext();

  const [campaign, setCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  useEffect(() => {
    if (userCampaigns && selectedCampaignId) {
      const foundCampaign = userCampaigns.find(
        (c: any) => c.id === selectedCampaignId,
      );
      setCampaign(foundCampaign);
    }
  }, [userCampaigns, selectedCampaignId]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

  if (!campaign && selectedCampaignId) {
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
            <Button onClick={onBackToCampaigns}>
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
          {onBackToCampaigns && (
            <Button variant="outline" size="sm" onClick={onBackToCampaigns}>
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {campaign?.title || 'Financial Management'}
        </h1>
        <p className="text-gray-600 mb-6">
          Financial Management & Investor Reporting
        </p>

        {campaign && (
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
        )}
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
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2"
            onClick={() => setShowSettingsModal(true)}
          >
            <FiSettings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {selectedCampaignId && (
            <FinancialDashboard campaignId={selectedCampaignId} />
          )}
        </TabsContent>

        <TabsContent value="financials">
          {selectedCampaignId && (
            <FinancialStatementsManager campaignId={selectedCampaignId} />
          )}
        </TabsContent>

        <TabsContent value="kpis">
          {selectedCampaignId && <KPIManager campaignId={selectedCampaignId} />}
        </TabsContent>

        <TabsContent value="reports">
          {selectedCampaignId && (
            <InvestorReportsManager campaignId={selectedCampaignId} />
          )}
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Reporting Settings"
        size="large"
      >
        <div className="space-y-6">
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button>Save Settings</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignFinancialsPage;
