import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardSkeleton from '@/app/loaders/CampaignCardSkeleton';
import EquityCampaignCard from './EquityCampaignCard ';
import { CampaignCarouselProps } from './CampaignCarousel';

const EquityCampaignCarousel: React.FC<CampaignCarouselProps> = ({
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

  // Progressive loading state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(hasNextPage);

  // Initialize displayed campaigns with the first batch
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const initialCampaigns = campaigns.slice(0, initialItemsPerPage);
      setDisplayedCampaigns(initialCampaigns);
      setHasMore(campaigns.length > initialItemsPerPage || hasNextPage);
    } else {
      setDisplayedCampaigns([]);
      setHasMore(false);
    }
  }, [campaigns, initialItemsPerPage, hasNextPage]);

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
      } else if (campaigns) {
        // Load from existing campaigns array
        const nextPageStart = currentPage * initialItemsPerPage;
        const nextBatch = campaigns.slice(
          nextPageStart,
          nextPageStart + initialItemsPerPage,
        );

        if (nextBatch.length > 0) {
          setDisplayedCampaigns((prev) => [...prev, ...nextBatch]);
          setCurrentPage((prev) => prev + 1);
          setHasMore(nextPageStart + nextBatch.length < campaigns.length);
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
    campaigns,
    initialItemsPerPage,
  ]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = async () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const isNearEnd = scrollLeft > scrollWidth - clientWidth - 400;

      // Load more if we're near the end and have more to load
      if (isNearEnd && hasMore && !isLoadingMore && autoLoad) {
        await loadMoreCampaigns();
        // Wait a bit for the new content to render, then scroll
        setTimeout(() => {
          carouselRef.current?.scrollBy({ left: 380, behavior: 'smooth' });
        }, 100);
      } else {
        carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      }
    }
  };

  const showContent = () => {
    if (loading && displayedCampaigns.length === 0) {
      return (
        <div className="flex space-x-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <CampaignCardSkeleton key={index} />
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
          {displayedCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="snap-start flex-none w-[300px] md:w-[380px] my-4 mx-3" // Increased width
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
            <div className="flex-shrink-0 flex items-center justify-center w-[380px] h-full">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            </div>
          )}

          {/* Load more button as fallback */}
          {hasMore && !isLoadingMore && (
            <div className="flex-shrink-0 flex items-center justify-center w-[380px] h-full">
              <Button
                variant="outline"
                onClick={loadMoreCampaigns}
                className="flex flex-col items-center space-y-2 h-32 w-full"
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
      <div className="w-full text-xl text-center py-6 text-muted-foreground">
        No campaigns found.
      </div>
    );
  };

  const progress =
    totalCount > 0 ? (displayedCampaigns.length / totalCount) * 100 : 0;

  return (
    <div className="w-full my-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          {showProgress && totalCount > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-trust transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {displayedCampaigns.length} of {totalCount}
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
      {hasMore && displayedCampaigns.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={loadMoreCampaigns}
            disabled={isLoadingMore}
            className="bg-white text-sm text-gray-800"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              `Load more campaigns ${totalCount > 0 ? `(${totalCount - displayedCampaigns.length} remaining)` : ''}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EquityCampaignCarousel;
