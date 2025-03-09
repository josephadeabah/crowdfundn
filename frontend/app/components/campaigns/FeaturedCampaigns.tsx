'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CampaignCard from './CampaignCard';
import { useCampaignContext } from '../../context/account/campaign/CampaignsContext';
import RewardCard from './RewardCard';

const FeaturedCampaigns = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentFilter, setCurrentFilter] = useState('All');
  const filters = ['All', 'Tech', 'Creative', 'Community', 'Green'];

  const [isVisible, setIsVisible] = useState(false);
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();

  // States for sorting and pagination
  const [sortCriteria, setSortCriteria] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  useEffect(() => {
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, sortCriteria, pageNumber, itemsPerPage]);

  const displayedCampaigns = campaigns?.filter((campaign) => {
    return campaign.status !== 'completed' && campaign.permissions.is_public;
  });

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

  return (
    <div className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RewardCard
          campaigns={displayedCampaigns}
          loading={loading}
          error={error}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div className="animate-fade-up">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-500 rounded-full mb-4">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Campaigns
            </h2>
          </div>

          <div className="flex mt-6 md:mt-0 gap-2 animate-fade-up">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 animate-fade-up">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                currentFilter === filter
                  ? 'bg-orange-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayedCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="snap-start flex-none w-[280px] md:w-[350px]"
              style={{ animationDelay: `${index * 100}ms` }}
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

        {/* Applied CSS without using the style tag with jsx prop */}
        <div className="no-scrollbar"></div>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
