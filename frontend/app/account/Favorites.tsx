import React, { useEffect } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import Image from 'next/image';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Import bookmark icons
import { CampaignResponseDataType } from '../types/campaigns.types';

const Favorites = () => {
  const {
    campaigns,
    loading,
    error,
    fetchFavoritedCampaigns,
    favoriteCampaign,
    unfavoriteCampaign,
  } = useCampaignContext();

  // Trigger fetch for favorited campaigns when the component mounts
  useEffect(() => {
    fetchFavoritedCampaigns(); // Fetch favorited campaigns from context
  }, [fetchFavoritedCampaigns]);

  // Show loader while campaigns are being fetched
  if (loading) {
    return <div className='py-8'><CampaignCardLoader /></div>;
  }

  // Handle favorite/unfavorite action
  const handleFavorite = async (campaignId: string) => {
    await favoriteCampaign(campaignId);
  };

  const handleUnfavorite = async (campaignId: string) => {
    await unfavoriteCampaign(campaignId);
  };

  // Filter favorited campaigns
  const favoritedCampaigns = campaigns.filter(
    (campaign: CampaignResponseDataType) => campaign.favorited,
  );

  return (
    <div className="px-2 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Favorites
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Keep track of your saved campaigns and monitor their performance.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Check if any campaigns are favorited */}
        {favoritedCampaigns.length === 0 ? (
          <div className="col-span-full text-center p-4 text-gray-500">
            You have not added any campaign as your favorite yet.
          </div>
        ) : (
          // Render the favorite campaigns
          favoritedCampaigns.map((campaign) => (
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
              {/* Favorite/Unfavorite Icon */}
              <div
                className="absolute top-2 right-2 p-2 bg-transparent rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault(); // Prevent link navigation
                  campaign.favorited
                    ? handleUnfavorite(campaign.id.toString())
                    : handleFavorite(campaign.id.toString());
                }}
              >
                {campaign.favorited ? (
                  <FaBookmark className="text-orange-500" />
                ) : (
                  <FaRegBookmark className="text-gray-50" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
