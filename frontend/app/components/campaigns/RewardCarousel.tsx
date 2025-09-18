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

interface GroupedReward {
  id: number;
  title: string;
  description: string;
  image?: string;
  amount: number;
  campaign: CampaignResponseDataType;
  count: number; // Number of rewards with this ID
}

const RewardCarousel: React.FC<RewardCarouselProps> = ({
  campaigns = [],
  loading,
  error,
  title,
  onLoadMore,
  hasNextPage = false,
  totalCount = 0,
  initialItemsPerPage = 6,
  showProgress = true,
  autoLoad = true,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Progressive loading state for GROUPED rewards
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedGroupedRewards, setDisplayedGroupedRewards] = useState<GroupedReward[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(hasNextPage);

  // Group rewards by their ID to avoid duplicates
  const allGroupedRewards = useMemo(() => {
    if (!campaigns) return [];
    
    // First, get all rewards from eligible campaigns
    const allRewards = campaigns
      .filter(
        (campaign) =>
          campaign.status !== 'completed' &&
          campaign.permissions.is_public &&
          campaign.rewards &&
          campaign.rewards.length > 0,
      )
      .flatMap((campaign) =>
        campaign.rewards.map((reward) => ({
          ...reward,
          campaign,
        })),
      );

    // Group rewards by their ID
    const rewardGroups = new Map<number, GroupedReward>();
    
    allRewards.forEach((reward) => {
      if (rewardGroups.has(reward.id)) {
        // If reward ID already exists, increment the count
        const existing = rewardGroups.get(reward.id)!;
        rewardGroups.set(reward.id, {
          ...existing,
          count: existing.count + 1,
        });
      } else {
        // Create new grouped reward
        rewardGroups.set(reward.id, {
          id: reward.id,
          title: reward.title,
          description: reward.description,
          image: reward.image,
          amount: reward.amount,
          campaign: reward.campaign,
          count: 1,
        });
      }
    });

    return Array.from(rewardGroups.values());
  }, [campaigns]);

  // Initialize displayed GROUPED rewards with the first batch
  useEffect(() => {
    if (allGroupedRewards.length > 0) {
      const initialGroupedRewards = allGroupedRewards.slice(0, initialItemsPerPage);
      setDisplayedGroupedRewards(initialGroupedRewards);
      setHasMore(allGroupedRewards.length > initialItemsPerPage || hasNextPage);
    } else {
      setDisplayedGroupedRewards([]);
      setHasMore(false);
    }
  }, [allGroupedRewards, initialItemsPerPage, hasNextPage]);

  // Check scroll position to enable/disable scroll buttons
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
      checkScrollPosition(); // Initial check

      return () => carousel.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition, displayedGroupedRewards]);

  // Load more GROUPED rewards when user scrolls right and reaches near the end
  const loadMoreGroupedRewards = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      if (onLoadMore) {
        // Custom load more function provided - we need to handle this differently
        // since we're working with grouped rewards now
        const newCampaigns = await onLoadMore(currentPage + 1);
        
        // If new campaigns are loaded, we need to regroup all rewards
        // This is a bit complex, so for now we'll just set hasMore to false
        // or implement a more sophisticated loading strategy
        setHasMore(false);
      } else {
        // Load from existing grouped rewards array
        const nextPageStart = currentPage * initialItemsPerPage;
        const nextBatch = allGroupedRewards.slice(
          nextPageStart,
          nextPageStart + initialItemsPerPage,
        );

        if (nextBatch.length > 0) {
          setDisplayedGroupedRewards((prev) => [...prev, ...nextBatch]);
          setCurrentPage((prev) => prev + 1);
          setHasMore(nextPageStart + nextBatch.length < allGroupedRewards.length);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Failed to load more rewards:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    onLoadMore,
    currentPage,
    allGroupedRewards,
    initialItemsPerPage,
  ]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = async () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isNearEnd = scrollLeft > scrollWidth - clientWidth - 400;

      // Load more if we're near the end and have more to load
      if (isNearEnd && hasMore && !isLoadingMore && autoLoad) {
        await loadMoreGroupedRewards();
        // Wait a bit for the new content to render, then scroll
        setTimeout(() => {
          carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
        }, 100);
      } else {
        carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  };

  const showContent = () => {
    if (loading && displayedGroupedRewards.length === 0) {
      return (
        <div className="flex space-x-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <CampaignCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error && displayedGroupedRewards.length === 0) {
      return (
        <div className="w-full">
          <ErrorPage />
        </div>
      );
    }

    if (displayedGroupedRewards.length > 0) {
      return (
        <>
          {displayedGroupedRewards.map((groupedReward, index) => (
            <div
              key={`${groupedReward.id}-${index}`}
              className="snap-start flex-none w-[220px] md:w-[280px] my-3 mx-2"
            >
              <RewardCard
                campaign={groupedReward.campaign}
                reward={{
                  id: groupedReward.id,
                  title: groupedReward.count > 1 
                    ? `${groupedReward.title} (${groupedReward.count} available)` 
                    : groupedReward.title,
                  description: groupedReward.description,
                  image: groupedReward.image,
                  amount: groupedReward.amount,
                  campaign_id: groupedReward.campaign.id,
                }}
                loading={false}
                error={null}
              />
            </div>
          ))}

          {/* Loading indicator for more rewards */}
          {isLoadingMore && (
            <div className="flex-shrink-0 flex items-center justify-center w-[280px] h-full">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            </div>
          )}

          {/* Load more button as fallback */}
          {hasMore && !isLoadingMore && (
            <div className="flex-shrink-0 flex items-center justify-center w-[280px] h-full">
              <Button
                variant="outline"
                onClick={loadMoreGroupedRewards}
                className="flex flex-col items-center space-y-2 h-32 w-full"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="text-sm">Load More</span>
                {allGroupedRewards.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {displayedGroupedRewards.length} of {allGroupedRewards.length}
                  </span>
                )}
              </Button>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="w-full text-xl text-center py-6 text-muted-foreground">
        No rewards found.
      </div>
    );
  };

  const progress =
    allGroupedRewards.length > 0 
      ? (displayedGroupedRewards.length / allGroupedRewards.length) * 100 
      : 0;

  return (
    <div className="w-full my-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          {showProgress && allGroupedRewards.length > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-trust transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {displayedGroupedRewards.length} of {allGroupedRewards.length}
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
            disabled={!canScrollRight && !hasMore}
            className={cn(
              'bg-white text-gray-800 hover:bg-white hover:text-gray-800 rounded-full transition-all duration-200',
              !canScrollRight && !hasMore && 'opacity-50 cursor-not-allowed',
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

      {/* Optional: Show total progress */}
      {hasMore && displayedGroupedRewards.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={loadMoreGroupedRewards}
            disabled={isLoadingMore}
            className="bg-white text-sm text-gray-800"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load more rewards ${allGroupedRewards.length > 0 ? `(${allGroupedRewards.length - displayedGroupedRewards.length} remaining)` : ''}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RewardCarousel;