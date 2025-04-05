'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '../ui/Skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { fetchAllCampaigns, campaigns, loading } = useCampaignContext();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clear search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Fetch results when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length > 0 && isOpen) {
      fetchAllCampaigns(
        'created_at',
        'desc',
        1,
        5, // Show fewer results in the dropdown
        'all_time',
        'all',
        'all',
        debouncedSearchTerm,
      );
    }
  }, [debouncedSearchTerm, isOpen, fetchAllCampaigns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex flex-col animate-in fade-in duration-200">
      <div className="w-full bg-white shadow-md">
        <div className="container mx-auto py-4">
          <div className="relative max-w-3xl mx-auto w-full">
            <div className="relative flex items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-12 py-6 h-14 rounded-full border-2 border-fundify-primary/70 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-fundify-primary shadow-md bg-white text-lg"
              />
              <div className="absolute left-4">
                <Search className="h-5 w-5 text-fundify-primary" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-h-[calc(100vh-140px)]">
            <ScrollArea className="h-full max-h-[calc(100vh-140px)]">
              <div className="p-6">
                {searchTerm ? (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 px-2 py-1.5 mb-2">
                      {loading
                        ? 'Searching...'
                        : campaigns?.length
                          ? `${campaigns.length} results for "${searchTerm}"`
                          : 'No results found'}
                    </h4>

                    <div className="space-y-2">
                      {loading ? (
                        Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="flex items-start p-3 hover:bg-gray-50 rounded"
                            >
                              <Skeleton className="h-16 w-16 rounded mr-4" />
                              <div className="flex-1">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            </div>
                          ))
                      ) : campaigns?.length ? (
                        campaigns.map((campaign: CampaignResponseDataType) => (
                          <SearchResultItem
                            key={campaign.id}
                            campaign={campaign}
                            onClick={onClose}
                          />
                        ))
                      ) : (
                        <div className="px-2 py-6 text-center text-gray-500">
                          No matching campaigns found for "{searchTerm}"
                        </div>
                      )}
                    </div>

                    {campaigns?.length ? (
                      <div className="mt-4 pt-3 border-t text-center">
                        <Link
                          href={`/search?q=${encodeURIComponent(searchTerm)}`}
                          onClick={onClose}
                        >
                          <Button
                            variant="link"
                            className="text-fundify-primary"
                          >
                            View all {campaigns.length} results
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="px-2 py-6 text-center text-gray-500">
                    Start typing to search campaigns
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

const SearchResultItem = ({
  campaign,
  onClick,
}: {
  campaign: CampaignResponseDataType;
  onClick: () => void;
}) => {
  return (
    <Link href={`/campaign/${campaign.id}`} onClick={onClick}>
      <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer animate-fade-in transition-colors">
        <div className="h-16 w-16 rounded overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
          <img
            src={campaign.media}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-medium line-clamp-1">
            {campaign.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{campaign.category}</p>
          <div className="flex items-center mt-1">
            <div className="bg-fundify-muted text-xs px-2 py-0.5 rounded-full">
              Campaign
            </div>
            <div className="text-sm font-medium text-fundify-primary ml-auto">
              $
              {(
                campaign.current_amount || campaign.transferred_amount
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchBar;
