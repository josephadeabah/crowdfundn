// app/components/financials/CampaignSelector.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { FiArrowRight, FiBarChart2 } from 'react-icons/fi';
import { Skeleton } from '../../ui/Skeleton';
import { Button } from '../../ui/button';

interface CampaignSelectorProps {
  onSelectCampaign: (campaignId: number) => void;
}

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  onSelectCampaign,
}) => {
  const { userCampaigns, loading: campaignsLoading } = useCampaignContext();

  if (campaignsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!userCampaigns || userCampaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FiBarChart2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Campaigns Found
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have any campaigns yet. Create a campaign to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Campaign
        </h2>
        <p className="text-gray-600">
          Choose a campaign to manage financial reports and investor updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userCampaigns.map((campaign: any) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="capitalize">
                      {campaign.category?.replace('-', ' ') || 'General'}
                    </span>
                    <span>•</span>
                    <span>{campaign.location || 'Not specified'}</span>
                  </div>
                </div>
                {campaign.type === 'EquityCampaign' && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Equity
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {campaign.valuation && campaign.valuation > 0 ? (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-700">Valuation</p>
                    <p className="font-semibold text-gray-900">
                      ${parseInt(campaign.valuation).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-700">Goal</p>
                    <p className="font-semibold text-gray-900">
                      ${parseInt(campaign.goal_amount || '0').toLocaleString()}
                    </p>
                  </div>
                )}

                {campaign.equity_offered && campaign.equity_offered > 0 ? (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-700">Equity Offered</p>
                    <p className="font-semibold text-green-900">
                      {campaign.equity_offered}%
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-700">Raised</p>
                    <p className="font-semibold text-green-900">
                      $
                      {parseInt(
                        campaign.current_amount || '0',
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-700">Total Raised</p>
                  <p className="font-semibold text-gray-900">
                    $
                    {parseInt(
                      campaign.transferred_amount ||
                        campaign.current_amount ||
                        '0',
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-700">Investors</p>
                  <p className="font-semibold text-orange-900">
                    {campaign.total_investors || campaign.total_donors || 0}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Status:{' '}
                  <span className="capitalize">
                    {campaign.status || 'draft'}
                  </span>
                </div>
                <Button
                  variant="success"
                  onClick={() => onSelectCampaign(campaign.id)}
                >
                  <FiArrowRight className="mr-2 h-4 w-4" />
                  Manage Financials
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignSelector;
