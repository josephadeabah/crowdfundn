'use client';
import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import ErrorPage from '../errorpage/ErrorPage';
import Link from 'next/link';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import EquityCampaignCard from './EquityCampaignCard ';

interface EquityCarouselProps {
  campaigns: CampaignResponseDataType[] | undefined;
  loading: boolean;
  error: string | null;
  title: string;
}

const EquityCampaignCarousel: React.FC<EquityCarouselProps> = ({
  campaigns,
  loading,
  error,
  title,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Filter campaigns based on status and permissions
  const equityCampaigns = campaigns?.filter(
    (campaign) =>
      campaign.status !== 'completed' && campaign.type === 'EquityCampaign' && campaign.permissions.is_public,
  );

  // Determine what to show
  const showContent = () => {
    if (error) {
      return (
        <div className="w-full">
          <ErrorPage />
        </div>
      );
    }

    if (loading && (!equityCampaigns || equityCampaigns.length === 0)) {
      return (
        <div className="flex space-x-4 w-full">
          <div className="snap-start flex-none w-full max-w-full">
            <CampaignCardLoader />
          </div>
        </div>
      );
    }

    if (equityCampaigns && equityCampaigns.length > 0) {
      return equityCampaigns.map((campaign, index) => (
        <div
          key={campaign.id}
          className="snap-start flex-none w-[280px] md:w-[350px]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EquityCampaignCard
            campaign={campaign}
            loading={false}
            error={error}
          />
        </div>
      ));
    }

    return (
      <div className="w-full text-xl text-center py-8 text-gray-500">
        No investment opportunities found.
      </div>
    );
  };

  return (
    <div className="w-full my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Link href="/invest" passHref>
            <Button
              variant="outline"
              className="rounded-full text-sm px-4 py-2"
            >
              View More Opportunities
            </Button>
          </Link>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-8 pb-4 -mx-1 px-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showContent()}
      </div>
    </div>
  );
};

export default EquityCampaignCarousel;
