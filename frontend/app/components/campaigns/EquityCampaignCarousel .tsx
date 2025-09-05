'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import ErrorPage from '../errorpage/ErrorPage';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { cn } from '@/app/lib/utils';
import EquityCampaignCard from './EquityCampaignCard ';

interface EquityCarouselProps {
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

const EquityCampaignCarousel: React.FC<EquityCarouselProps> = ({
  campaigns = [],
  loading,
  error,
  title,
  onLoadMore,
  hasNextPage = false,
  totalCount = 0,
  initialItemsPerPage = 4,
  showProgress = true,
  autoLoad = true,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Progressive loading state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(hasNextPage);

  // Filter equity campaigns
  const equityCampaigns = campaigns?.filter(
    (campaign) =>
      campaign.status !== 'completed' &&
      campaign.equity_status !== 'draft' &&
      campaign.equity_status !== 'pending_approval' &&
      campaign.equity_status !== 'failed' &&
      campaign.type === 'EquityCampaign' &&
      campaign.permissions.is_public,
  );

  // Initialize displayed campaigns with the first batch
  useEffect(() => {
    if (equityCampaigns && equityCampaigns.length > 0) {
      const initialCampaigns = equityCampaigns?.slice(0, initialItemsPerPage);
      setDisplayedCampaigns(initialCampaigns);
      setHasMore(equityCampaigns?.length > initialItemsPerPage || hasNextPage);
    } else {
      setDisplayedCampaigns([]);
      setHasMore(false);
    }
  }, [equityCampaigns, initialItemsPerPage, hasNextPage]);

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
  }, [checkScrollPosition, displayedCampaigns]);

  // Load more campaigns when user scrolls right and reaches near the end
  const loadMoreCampaigns = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      if (onLoadMore) {
        // Custom load more function provided
        const newCampaigns = await onLoadMore(currentPage + 1);
        setDisplayedCampaigns((prev) => [...prev, ...newCampaigns]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(newCampaigns.length > 0);
      } else if (equityCampaigns) {
        // Load from existing campaigns array
        const nextPageStart = currentPage * initialItemsPerPage;
        const nextBatch = equityCampaigns?.slice(
          nextPageStart,
          nextPageStart + initialItemsPerPage,
        );

        if (nextBatch.length > 0) {
          setDisplayedCampaigns((prev) => [...prev, ...nextBatch]);
          setCurrentPage((prev) => prev + 1);
          setHasMore(nextPageStart + nextBatch.length < equityCampaigns.length);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Failed to load more campaigns:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    onLoadMore,
    currentPage,
    equityCampaigns,
    initialItemsPerPage,
  ]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = async () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isNearEnd = scrollLeft > scrollWidth - clientWidth - 500;

      // Load more if we're near the end and have more to load
      if (isNearEnd && hasMore && !isLoadingMore && autoLoad) {
        await loadMoreCampaigns();
        // Wait a bit for the new content to render, then scroll
        setTimeout(() => {
          carouselRef.current?.scrollBy({ left: 350, behavior: 'smooth' });
        }, 100);
      } else {
        carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
      }
    }
  };

  const showContent = () => {
    if (loading && displayedCampaigns.length === 0) {
      return (
        <div className="flex space-x-8 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="snap-start flex-none w-[280px] md:w-[350px]"
            >
              <CampaignCardLoader />
            </div>
          ))}
        </div>
      );
    }

    if (error && displayedCampaigns.length === 0) {
      return (
        <div className="w-full">
          <ErrorPage />
        </div>
      );
    }

    if (displayedCampaigns.length > 0) {
      return (
        <>
          {displayedCampaigns?.map((campaign, index) => (
            <div
              key={`${campaign.id}-${index}`}
              className="snap-start flex-none w-[280px] md:w-[350px]"
            >
              <EquityCampaignCard
                campaign={campaign}
                loading={false}
                error={error}
              />
            </div>
          ))}

          {/* Loading indicator for more campaigns */}
          {isLoadingMore && (
            <div className="flex-shrink-0 flex items-center justify-center w-[350px] h-full">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            </div>
          )}

          {/* Load more button as fallback */}
          {hasMore && !isLoadingMore && (
            <div className="flex-shrink-0 flex items-center justify-center w-[350px] h-full">
              <Button
                variant="outline"
                onClick={loadMoreCampaigns}
                className="flex flex-col items-center space-y-2 h-40 w-full"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="text-sm">Load More</span>
                {totalCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {displayedCampaigns.length} of {totalCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="w-full text-xl text-center py-8 text-gray-500">
        No Startups yet.
      </div>
    );
  };

  const progress =
    totalCount > 0 ? (displayedCampaigns.length / totalCount) * 100 : 0;

  return (
    <div className="w-full my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          {showProgress && totalCount > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {displayedCampaigns?.length} of {totalCount}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              'rounded-full h-8 w-8 md:h-10 md:w-10 transition-all duration-200',
              !canScrollLeft && 'opacity-50 cursor-not-allowed',
            )}
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight && !hasMore}
            className={cn(
              'rounded-full h-8 w-8 md:h-10 md:w-10 transition-all duration-200',
              !canScrollRight && !hasMore && 'opacity-50 cursor-not-allowed',
            )}
          >
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-8 pb-4 -mx-1 px-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {showContent()}
      </div>

      {/* Optional: Show total progress */}
      {hasMore && displayedCampaigns.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={loadMoreCampaigns}
            disabled={isLoadingMore}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load more startups ${totalCount > 0 ? `(${totalCount - displayedCampaigns.length} remaining)` : ''}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquityCampaignCarousel;