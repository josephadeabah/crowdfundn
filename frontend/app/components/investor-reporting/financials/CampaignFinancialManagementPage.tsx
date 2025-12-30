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
import {
  FiArrowLeft,
  FiBarChart2,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiGrid,
} from 'react-icons/fi';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import FinancialStatementsManager from './FinancialStatementsManager';
import FinancialDashboard from './FinancialDashboard';
import KPIManager from './KPIManager';
import InvestorReportsManager from './InvestorReportsManager';
import { Skeleton } from '../../ui/Skeleton';
import Modal from '@/app/components/modal/Modal';
import CampaignSelector from './CampaignSelector';
import { Button } from '../../ui/button';

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCampaignSelector, setShowCampaignSelector] = useState(false);
  const [localSelectedCampaignId, setLocalSelectedCampaignId] = useState<
    number | undefined
  >(selectedCampaignId);

  useEffect(() => {
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  useEffect(() => {
    if (userCampaigns && localSelectedCampaignId) {
      const foundCampaign = userCampaigns.find(
        (c: any) => c.id === localSelectedCampaignId,
      );
      setCampaign(foundCampaign);
    } else {
      setCampaign(null);
    }
  }, [userCampaigns, localSelectedCampaignId]);

  const handleSelectCampaign = (campaignId: number) => {
    setLocalSelectedCampaignId(campaignId);
    setShowCampaignSelector(false);
    setActiveTab('dashboard');
  };

  const handleBackToCampaigns = () => {
    setLocalSelectedCampaignId(undefined);
    setCampaign(null);
    if (onBackToCampaigns) {
      onBackToCampaigns();
    }
  };

  // If no campaign is selected, show the selector
  if (!localSelectedCampaignId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Management
          </h1>
          <p className="text-gray-600 mb-6">
            Select a campaign to manage financial reports and investor updates
          </p>
        </div>
        <CampaignSelector onSelectCampaign={handleSelectCampaign} />
      </div>
    );
  }

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
            <FiGrid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The campaign you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="success" 
                onClick={() => setLocalSelectedCampaignId(undefined)}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCampaignSelector(true)}
              >
                <FiGrid className="mr-2 h-4 w-4" />
                Select Another Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Selector Modal */}
        <Modal
          isOpen={showCampaignSelector}
          onClose={() => setShowCampaignSelector(false)}
          title="Select a Campaign"
          size="xlarge"
        >
          <CampaignSelector onSelectCampaign={handleSelectCampaign} />
        </Modal>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocalSelectedCampaignId(undefined)}
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCampaignSelector(true)}
            >
              <FiGrid className="mr-2 h-4 w-4" />
              Switch Campaign
            </Button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {campaign.title}
        </h1>
        <p className="text-gray-600 mb-6">
          Financial Management & Investor Reporting
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          {campaign.valuation && campaign.valuation > 0 && (
            <div className="bg-gray-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-700">Valuation</p>
              <p className="text-lg font-semibold text-gray-900">
                ${parseInt(campaign.valuation).toLocaleString()}
              </p>
            </div>
          )}

          {campaign.equity_offered && campaign.equity_offered > 0 ? (
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-green-700">Equity Offered</p>
              <p className="text-lg font-semibold text-green-900">
                {campaign.equity_offered}%
              </p>
            </div>
          ) : (
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-green-700">Goal</p>
              <p className="text-lg font-semibold text-green-900">
                ${parseInt(campaign.goal_amount || '0').toLocaleString()}
              </p>
            </div>
          )}

          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-700">Total Raised</p>
            <p className="text-lg font-semibold text-gray-900">
              $
              {parseInt(
                campaign.transferred_amount || campaign.current_amount || '0',
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-orange-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-orange-700">Investors</p>
            <p className="text-lg font-semibold text-orange-900">
              {campaign.total_investors || campaign.total_donors || 0}
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

          {/* Settings as a button, not a tab trigger */}
          <button
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              showSettingsModal
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setShowSettingsModal(true)}
          >
            <FiSettings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard campaignId={localSelectedCampaignId} />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialStatementsManager campaignId={localSelectedCampaignId} />
        </TabsContent>

        <TabsContent value="kpis">
          <KPIManager campaignId={localSelectedCampaignId} />
        </TabsContent>

        <TabsContent value="reports">
          <InvestorReportsManager campaignId={localSelectedCampaignId} />
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
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In-app notifications</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS notifications</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Report Templates</h4>
              <p className="text-sm text-gray-500 mb-2">
                Customize report formats and branding
              </p>
              <select className="w-full p-2 border rounded">
                <option>Default Template</option>
                <option>Professional Template</option>
                <option>Minimal Template</option>
                <option>Custom Template</option>
              </select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Access Controls</h4>
              <p className="text-sm text-gray-500 mb-2">
                Manage who can view financial information
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">All investors</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lead investors only</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Board members only</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Report Frequency</h4>
              <p className="text-sm text-gray-500 mb-2">
                How often should reports be generated?
              </p>
              <select className="w-full p-2 border rounded">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Semi-annually</option>
                <option>Annually</option>
              </select>
            </div>

            <div>
              <h4 className="font-medium mb-2">Data Retention</h4>
              <p className="text-sm text-gray-500 mb-2">
                How long should financial data be kept?
              </p>
              <select className="w-full p-2 border rounded">
                <option>1 year</option>
                <option>3 years</option>
                <option>5 years</option>
                <option>Indefinitely</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success">Save Settings</Button>
          </div>
        </div>
      </Modal>

      {/* Campaign Selector Modal */}
      <Modal
        isOpen={showCampaignSelector}
        onClose={() => setShowCampaignSelector(false)}
        title="Select a Campaign"
        size="xlarge"
      >
        <CampaignSelector onSelectCampaign={handleSelectCampaign} />
      </Modal>
    </div>
  );
};

export default CampaignFinancialsPage;