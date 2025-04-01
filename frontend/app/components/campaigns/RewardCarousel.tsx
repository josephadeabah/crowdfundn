import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RewardCard from './RewardCard';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';

interface RewardCarouselProps {
  campaigns: CampaignResponseDataType[] | undefined;
  loading: boolean;
  error: string | null;
  title: string;
}

const RewardCarousel: React.FC<RewardCarouselProps> = ({
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

  // Filter rewards based on campaign status and permissions
  const rewards = campaigns
    ?.filter(
      (campaign) =>
        campaign.status !== 'completed' && campaign.permissions.is_public,
    )
    .flatMap((campaign) =>
      campaign.rewards.map((reward) => ({
        ...reward,
        campaign,
      })),
    );

  return (
    <div className="w-full my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
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
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-4 -mx-1 px-1 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          <div className="w-full h-full">
            <CampaignCardLoader />
          </div>
        ) : rewards && rewards.length > 0 ? (
          rewards.map((reward, index) => (
            <div
              key={reward.id}
              className="snap-start flex-none w-[280px] md:w-[350px]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RewardCard
                campaign={reward.campaign}
                reward={reward}
                loading={!loading && rewards.length > 0}
                error={error}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            No rewards found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardCarousel;
