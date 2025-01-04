'use client';

import React, { useEffect } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import Image from 'next/image';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { CampaignResponseDataType } from '../types/campaigns.types';
import EmptyPage from '../components/emptypage/EmptyPage';

const Favorites = () => {
  const { campaigns, loading, error, fetchFavoritedCampaigns } =
    useCampaignContext();

  // Trigger fetch for favorited campaigns when the component mounts
  useEffect(() => {
    const loadFavoritedCampaigns = async () => {
      await fetchFavoritedCampaigns(); // Fetch favorited campaigns from context
    };

    loadFavoritedCampaigns();
  }, [fetchFavoritedCampaigns]);

  // Show loader while campaigns are being fetched
  if (loading) {
    return <CampaignCardLoader />;
  }

  // Handle case when no favorited campaigns are found
  if (campaigns.length === 0) {
    return <EmptyPage />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {campaigns
        .filter((campaign: CampaignResponseDataType) => campaign.favorited) // Only show favorited campaigns
        .map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <Link href={`/campaign/${campaign.id}?${generateRandomString()}`}>
              <div className="relative w-full h-48">
                <Image
                  src={campaign.media || '/bantuhive.svg'}
                  alt={campaign.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold truncate">{campaign.title}</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <span>{campaign.total_donors} Backers</span>
                  <span className="mx-2">•</span>
                  <span>{campaign.remaining_days} days left</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Favorites;
