'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import CampaignCarousel from './CampaignCarousel';
import RewardCarousel from './RewardCarousel';

const FeaturedCampaigns = () => {
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();

  const isMounted = useRef(true);

  // Memoize params to prevent unnecessary fetches
  const fetchParams = useMemo(() => ({
    sortCriteria: 'created_at',
    sortOrder: 'desc',
    pageNumber: 1,
    itemsPerPage: 12
  }), []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    
    const { sortCriteria, sortOrder, pageNumber, itemsPerPage } = fetchParams;
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, fetchParams]);

  const displayedCampaigns = useMemo(() => {
    return campaigns?.filter((campaign) => {
      return campaign.status !== 'completed' && campaign.permissions.is_public;
    });
  }, [campaigns]);

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RewardCarousel
          title="Featured Rewards"
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div className="animate-fade-up">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-500 rounded-full mb-4">
              Trending Now
            </span>
          </div>
        </div>

        {/* Carousel */}
        <CampaignCarousel
          title="Trending Fundraisers"
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />

        {/* Applied CSS without using the style tag with jsx prop */}
        <div className="no-scrollbar"></div>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
