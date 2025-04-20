'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import CampaignCarousel from './CampaignCarousel';
import RewardCarousel from './RewardCarousel';
import FundingTypes from '@/app/molecules/FundingTypes';
import EquityCampaignCarousel from './EquityCampaignCarousel ';
import Link from 'next/link';
import { Button } from '../ui/button';

const FeaturedCampaigns = () => {
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();
  const isMounted = useRef(true);

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
    // Set up mount state
    isMounted.current = true;

    const { sortCriteria, sortOrder, pageNumber, itemsPerPage } = fetchParams;
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);

    return () => {
      // Clean up on unmount
      isMounted.current = false;
    };
  }, [fetchAllCampaigns, fetchParams]);

  const displayedCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
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
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EquityCampaignCarousel
          title="Invest Now"
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />
        <Link href="/invest" passHref>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-sm md:text-lg  whitespace-nowrap"
          >
            View More Investment Opportunities
          </Button>
        </Link>
      </div>
      <div className="bg-gray-50 py-12">
        <FundingTypes />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="animate-fade-up">
            <span className="inline-block px-3 py-1 mt-3 text-xs font-semibold bg-orange-500/10 text-orange-500 rounded-full">
              Trending Now
            </span>
          </div>
        </div>
        <CampaignCarousel
          title="Trending Hive Builders"
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />
        <div className="no-scrollbar"></div>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
