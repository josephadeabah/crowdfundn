import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CampaignCard from './CampaignCard';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';

interface CampaignCarouselProps {
  campaigns: CampaignResponseDataType[] | undefined;
  loading: boolean;
  error: string | null;
  title: string;
}

const CampaignCarousel: React.FC<CampaignCarouselProps> = ({
  campaigns,
  loading,
  error,
  title,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // States for sorting and pagination
  const [sortCriteria, setSortCriteria] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

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

  // Create pairs of campaigns for the two-row grid
  const createCampaignPairs = (campaignList: CampaignResponseDataType[]) => {
    const pairs = [];
    for (let i = 0; i < campaignList.length; i += 2) {
      pairs.push(campaignList.slice(i, i + 2));
    }
    return pairs;
  };

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
          <div>
            <CampaignCardLoader />
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          // Actual campaigns when loaded
          createCampaignPairs(campaigns).map((pair, pairIndex) => (
            <div
              key={`pair-${pairIndex}`}
              className="flex-shrink-0 grid grid-rows-2 gap-3 h-full"
            >
              {pair.map((campaign) => (
                <div
                  key={campaign.id}
                  className="snap-start flex-none w-[280px] md:w-[350px]"
                  style={{ animationDelay: `${pairIndex * 100}ms` }}
                >
                  <CampaignCard
                    campaign={campaign}
                    loading={loading}
                    error={error}
                    onPageChange={handlePageChange}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-gray-500">
            No campaigns found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCarousel;
