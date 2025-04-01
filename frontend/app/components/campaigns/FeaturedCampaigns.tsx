'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import CampaignCarousel from './CampaignCarousel';
import RewardCarousel from './RewardCarousel';

const FeaturedCampaigns = () => {
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();
  // States for sorting and pagination
  const [sortCriteria, setSortCriteria] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, sortCriteria, pageNumber, itemsPerPage]);

  const displayedCampaigns = campaigns?.filter((campaign) => {
    return campaign.status !== 'completed' && campaign.permissions.is_public;
  });

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
          title="Trending Campaigns"
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
