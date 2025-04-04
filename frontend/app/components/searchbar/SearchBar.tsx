'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import Link from 'next/link';
import { useIsMobile } from '@/app/hooks/use-mobile';
import { Skeleton } from '../ui/Skeleton';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { ScrollArea } from '../ui/scroll-area';

interface SearchBarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onExpandChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    CampaignResponseDataType[]
  >([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Debounce search term and fetch results
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch search results when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      setIsLoadingResults(true);
      //   fetchUserCampaigns(debouncedSearchTerm)
      //     .then(results => {
      //       setSearchResults(results);
      //       setIsLoadingResults(false);
      //     })
      //     .catch(() => {
      //       setIsLoadingResults(false);
      //     });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }

    // Notify parent component about expansion state
    if (onExpandChange) {
      onExpandChange(expanded);
    }
  }, [expanded, onExpandChange]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expanded &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  // Handle body scroll lock when overlay is active
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const toggleSearch = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative z-50">
      <div
        ref={dropdownRef}
        className={`relative ${isMobile && expanded ? 'w-full' : ''}`}
      >
        <div
          className={`flex items-center transition-all duration-300 ease-in-out ${expanded ? (isMobile ? 'w-full' : 'w-full sm:w-64 md:w-80 lg:w-96') : 'w-10'}`}
        >
          {expanded ? (
            <div className="flex items-center w-full relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-0 focus-visible:ring-0 bg-fundify-muted"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Search Results Dropdown - positioned on top of the overlay */}
        {expanded && (
          <Card className="absolute right-0 left-0 top-full mt-1 max-h-[80vh] z-50 shadow-lg bg-white border-0 animate-in fade-in slide-in-from-top-5 duration-300">
            <ScrollArea className="max-h-[80vh]">
              <div className="p-3">
                {/* Search Results Section */}
                {searchTerm ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 px-2 py-1.5">
                      {isLoadingResults
                        ? 'Searching...'
                        : searchResults?.length
                          ? `${searchResults.length} results`
                          : 'No results found'}
                    </h4>

                    <div className="space-y-2">
                      {isLoadingResults ? (
                        // Show skeletons while loading
                        Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="flex items-start p-2 hover:bg-gray-50 rounded"
                            >
                              <Skeleton className="h-12 w-12 rounded mr-3" />
                              <div className="flex-1">
                                <Skeleton className="h-4 w-3/4 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            </div>
                          ))
                      ) : searchResults?.length ? (
                        // Show search results
                        searchResults.map(
                          (
                            campaign: CampaignResponseDataType,
                            index: number,
                          ) => (
                            <SearchResultItem
                              key={campaign.id}
                              campaign={campaign}
                              onClick={() => setExpanded(false)}
                              style={{ animationDelay: `${index * 50}ms` }}
                            />
                          ),
                        )
                      ) : searchTerm ? (
                        <div className="px-2 py-4 text-center text-gray-500">
                          No matching campaigns found
                        </div>
                      ) : null}
                    </div>

                    {searchResults?.length ? (
                      <div className="mt-2 pt-2 border-t text-center">
                        <Button variant="link" className="text-xs">
                          View all results
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="px-2 py-4 text-center text-gray-500">
                    Start typing to search campaigns
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
};

const SearchResultItem = ({
  campaign,
  onClick,
  style,
}: {
  campaign: CampaignResponseDataType;
  onClick: () => void;
  style?: React.CSSProperties;
}) => {
  return (
    <Link href={`/campaign/${campaign.id}`} onClick={onClick}>
      <div
        className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer animate-fade-in"
        style={style}
      >
        <div className="h-12 w-12 rounded overflow-hidden mr-3 bg-gray-100">
          <img
            src={campaign.media}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium line-clamp-1">{campaign.title}</h4>
          <p className="text-xs text-gray-500">{campaign.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchBar;
