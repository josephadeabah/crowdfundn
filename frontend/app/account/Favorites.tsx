import React, { useEffect } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import Image from 'next/image';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const Favorites = () => {
  const {
    favoritedCampaigns,
    loading,
    error,
    fetchFavoritedCampaigns,
    favoriteCampaign,
    unfavoriteCampaign,
  } = useCampaignContext();

  useEffect(() => {
    fetchFavoritedCampaigns();
  }, [fetchFavoritedCampaigns]);

  if (loading && favoritedCampaigns.length === 0) {
    return (
      <div className="py-8">
        <CampaignCardLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading favorites: {error}
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Favorites
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Keep track of your saved campaigns and monitor their performance.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoritedCampaigns.length === 0 ? (
          <div className="col-span-full text-center p-4 text-gray-500">
            You have not added any campaign as your favorite yet.
          </div>
        ) : (
          favoritedCampaigns.map((campaign) => (
            <div
              key={`fav-${campaign.id}`}
              className="relative bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/campaign/${campaign.id}?${generateRandomString()}`}>
                <div className="relative w-full h-48">
                  <Image
                    src={campaign.media || '/bantuhive.svg'}
                    alt={campaign.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                    className="rounded-t-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      (e.target as HTMLImageElement).src = '/bantuhive.svg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold truncate">
                    {campaign.title}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{campaign.total_donors} Backers</span>
                    <span className="mx-2">•</span>
                    <span>{campaign.remaining_days} days left</span>
                  </div>
                </div>
              </Link>
              
              <button
                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  unfavoriteCampaign(campaign.id.toString());
                }}
                aria-label={campaign.favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaBookmark className="text-orange-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;