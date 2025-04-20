// app/invest/page.tsx
'use client';
import React from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useEffect, useMemo } from 'react';
import EquityCampaignCarousel from '../components/campaigns/EquityCampaignCarousel ';

const InvestPage = () => {
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();

  // Memoize params to prevent unnecessary fetches
  const fetchParams = useMemo(
    () => ({
      sortCriteria: 'created_at',
      sortOrder: 'desc',
      pageNumber: 1,
      itemsPerPage: 12,
    }),
    [],
  );

  useEffect(() => {
    const { sortCriteria, sortOrder, pageNumber, itemsPerPage } = fetchParams;
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, fetchParams]);

  const displayedCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.type === 'EquityCampaign' &&
        campaign.permissions.is_public
      );
    });
  }, [campaigns]);

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EquityCampaignCarousel
          title="Featured Investment Opportunities"
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default InvestPage;
