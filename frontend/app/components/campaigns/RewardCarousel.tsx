'use client';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardSkeleton from '@/app/loaders/CampaignCardSkeleton';
import RewardCard from './RewardCard';

export interface RewardCarouselProps {
  campaigns: CampaignResponseDataType[] | undefined;
  loading: boolean;
  error: string | null;
  title: string;
  onLoadMore?: (page: number) => Promise<CampaignResponseDataType[]>;
  hasNextPage?: boolean;
  totalCount?: number;
  initialItemsPerPage?: number;
  showProgress?: boolean;
  autoLoad?: boolean;
}

interface UniqueReward {
  id: number;
  title: string;
  description: string;
  image?: string;
  amount: number;
  campaign: CampaignResponseDataType;
  totalAvailable: number;
}

const RewardCarousel: React.FC<RewardCarouselProps> = ({
  campaigns = [],
  loading,
  error,
  title,
  onLoadMore,
  hasNextPage = false,
  totalCount = 0,
  initialItemsPerPage = 12, // Show more rewards since they're unique now
  showProgress = true,
  autoLoad = true,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  // Extract and group unique rewards
  const uniqueRewards = useMemo(() => {
    if (!campaigns) return [];
    
    const rewardMap = new Map<number, UniqueReward>();
    
    campaigns
      .filter(
        (campaign) =>
          campaign.status !== 'completed' &&
          campaign.permissions.is_public &&
          campaign.rewards &&
          campaign.rewards.length > 0,
      )
      .forEach((campaign) => {
        campaign.rewards.forEach((reward) => {
          if (rewardMap.has(reward.id)) {
            // Update count for existing reward
            const existing = rewardMap.get(reward.id)!;
            rewardMap.set(reward.id, {
              ...existing,
              totalAvailable: existing.totalAvailable + 1,
            });
          } else {
            // Add new unique reward
            rewardMap.set(reward.id, {
              id: reward.id,
              title: reward.title,
              description: reward.description,
              image: reward.image,
              amount: reward.amount,
              campaign: campaign,
              totalAvailable: 1,
            });
          }
        });
      });
    
    return Array.from(rewardMap.values());
  }, [campaigns]);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => carousel.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition, uniqueRewards]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const showContent = () => {
    if (loading) {
      return (
        <div className="flex space-x-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <CampaignCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full">
          <ErrorPage />
        </div>
      );
    }

    if (uniqueRewards.length > 0) {
      return (
        <>
          {uniqueRewards.map((reward, index) => (
            <div
              key={`${reward.id}-${index}`}
              className="snap-start flex-none w-[220px] md:w-[280px] my-3 mx-2"
            >
              <RewardCard
                campaign={reward.campaign}
                reward={{
                  id: reward.id,
                  title: reward.totalAvailable > 1 
                    ? `${reward.title} (${reward.totalAvailable} available)` 
                    : reward.title,
                  description: reward.description,
                  image: reward.image,
                  amount: reward.amount,
                  campaign_id: reward.campaign.id,
                }}
                loading={false}
                error={null}
              />
            </div>
          ))}
        </>
      );
    }

    return (
      <div className="w-full text-xl text-center py-6 text-muted-foreground">
        No rewards found.
      </div>
    );
  };

  return (
    <div className="w-full my-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          {showProgress && uniqueRewards.length > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {uniqueRewards.length} unique rewards available
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              'bg-white text-gray-800 hover:bg-white hover:text-gray-800 rounded-full transition-all duration-200',
              !canScrollLeft && 'opacity-50 cursor-not-allowed',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              'bg-white text-gray-800 hover:bg-white hover:text-gray-800 rounded-full transition-all duration-200',
              !canScrollRight && 'opacity-50 cursor-not-allowed',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-3 -mx-1 px-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showContent()}
      </div>

      {uniqueRewards.length > 0 && (
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500">
            Showing {uniqueRewards.length} unique rewards
          </p>
        </div>
      )}
    </div>
  );
};

export default RewardCarousel;