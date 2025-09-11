'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import CampaignCarousel from './CampaignCarousel';
import RewardCarousel from './RewardCarousel';
import FundingTypes from '@/app/molecules/FundingTypes';
import Link from 'next/link';
import { Button } from '../ui/button';
import InvestorPitchSection from '@/app/molecules/InvestorPitchSection';
import EquityCampaignCarousel from './EquityCampaignCarousel';

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
    isMounted.current = true;
    const { sortCriteria, sortOrder, pageNumber, itemsPerPage } = fetchParams;
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);

    return () => {
      isMounted.current = false;
    };
  }, [fetchAllCampaigns, fetchParams]);

  // Filter campaigns for each carousel type
  const rewardCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.equity_status !== 'draft' &&
        campaign.equity_status !== 'pending_approval' &&
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
        campaign.permissions.is_public
      );
    });
  }, [campaigns]);

  const trendingCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.equity_status !== 'draft' &&
        campaign.equity_status !== 'pending_approval' &&
        campaign.permissions.is_public
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
          totalCount={rewardCampaigns.length}
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
          totalCount={equityCampaigns.length}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 flex justify-center">
        <Link href="/invest" passHref>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full bg-white text-gray-900 text-sm md:text-lg whitespace-nowrap"
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
          title="Trending Creators"
          campaigns={trendingCampaigns}
          loading={loading}
          error={error}
          totalCount={trendingCampaigns.length}
        />

        <div className="no-scrollbar"></div>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
