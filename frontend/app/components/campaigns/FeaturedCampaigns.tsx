'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import CampaignCarousel from './CampaignCarousel';
import RewardCarousel from './RewardCarousel';
import FundingTypes from '@/app/molecules/FundingTypes';
import EquityCampaignCarousel from './EquityCampaignCarousel ';
import Link from 'next/link';
import { Button } from '../ui/button';
import InvestorPitchSection from '@/app/molecules/InvestorPitchSection';

const FeaturedCampaigns = () => {
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();
  const isMounted = useRef(true);

  // Memoize params to prevent unnecessary fetches
  const fetchParams = useMemo(
    () => ({
      sortCriteria: 'created_at',
      sortOrder: 'desc',
      pageNumber: 1,
      itemsPerPage: 20, // Increased to ensure we have enough campaigns for all carousels
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

  // Filter campaigns for each carousel type
  const rewardCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.permissions.is_public
      );
    });
  }, [campaigns]);

  const equityCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.type === 'EquityCampaign' &&
        campaign.status !== 'completed' &&
        campaign.equity_status !== 'draft' &&
        campaign.equity_status !== 'pending_approval' &&
        campaign.equity_status !== 'failed' &&
        campaign.permissions.is_public
      );
    });
  }, [campaigns]);

  const trendingCampaigns = useMemo(() => {
    if (!campaigns) return [];
    // Filter for trending campaigns (you might want to add specific criteria)
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.permissions.is_public &&
        // Add trending criteria here, for example:
        (Number(campaign.total_donors) > 10 || Number(campaign.transferred_amount) > 1000)
      );
    });
  }, [campaigns]);

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RewardCarousel
          title="Featured Rewards"
          campaigns={rewardCampaigns}
          loading={loading}
          error={error}
        />
      </div>
      
      <div className="bg-gray-50 py-12">
        <InvestorPitchSection />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EquityCampaignCarousel
          title="Invest Now"
          campaigns={equityCampaigns}
          loading={loading}
          error={error}
          hasNextPage={false} // Set based on your pagination logic
          totalCount={equityCampaigns.length}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex justify-center">
        <Link href="/invest" passHref>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-sm md:text-lg whitespace-nowrap"
          >
            View More Startups
          </Button>
        </Link>
      </div>
      
      <div>
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
          campaigns={trendingCampaigns}
          loading={loading}
          error={error}
        />
        
        <div className="no-scrollbar"></div>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;