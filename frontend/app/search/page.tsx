'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search } from 'lucide-react';
import { CampaignResponseDataType } from '../types/campaigns.types';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import FullscreenLoader from '../loaders/FullscreenLoader';
import { deslugify } from '../utils/helpers/categories';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';


// Wrap the component that uses useSearchParams in Suspense
const SearchResultsWrapper = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <SearchResults />
    </Suspense>
  );
};

const SearchResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const { fetchAllCampaigns, campaigns, loading } = useCampaignContext();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(initialQuery);
    setDebouncedSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.length > 0) {
        try {
          await fetchAllCampaigns(
            'created_at',
            'desc',
            1,
            20,
            'all_time',
            'all',
            'all',
            debouncedSearchTerm,
          );
        } catch (error) {
          console.error('Search error:', error);
        }
      }
    };

    fetchResults();
  }, [debouncedSearchTerm, fetchAllCampaigns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>

          <div className="relative max-w-xl">
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns..."
                className="pr-10 border-fundify-primary/30 focus-visible:border-fundify-primary"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="w-full">
          {loading ? (
            <CampaignCardLoader />
          ) : campaigns && campaigns.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-500">
                Showing {campaigns.length} results for "{debouncedSearchTerm}"
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {campaigns.map((campaign: CampaignResponseDataType) => (
                  <SearchResultCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-fundify-primary mb-4">
                <Search className="h-12 w-12 mx-auto opacity-40" />
              </div>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any campaigns matching "{debouncedSearchTerm}"
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  router.push('/search');
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultCard = ({
  campaign,
}: {
  campaign: CampaignResponseDataType;
}) => {
  return (
    <Link href={`/campaign/${campaign.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 h-full">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={campaign.media}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1">{campaign.title}</h3>
          <p className="text-sm text-gray-500 mb-2">
            {deslugify(campaign.category)}
          </p>

          <div className="flex items-center justify-between">
            <div className="bg-fundify-muted text-xs px-2 py-0.5 rounded-full">
              Campaign
            </div>
            <div className="text-sm font-medium text-fundify-primary">
              $
              {(
                campaign.current_amount || campaign.transferred_amount
              ).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SearchResultsWrapper;
