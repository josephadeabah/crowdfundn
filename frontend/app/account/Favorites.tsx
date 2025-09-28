import React, { useEffect } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import Image from 'next/image';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { FaBookmark, FaUsers, FaClock } from 'react-icons/fa';
import CampaignCardSkeleton from '../loaders/CampaignCardSkeleton';

const Favorites = () => {
  const {
    favoritedCampaigns,
    loading,
    error,
    fetchFavoritedCampaigns,
    unfavoriteCampaign,
  } = useCampaignContext();

  useEffect(() => {
    fetchFavoritedCampaigns();
  }, [fetchFavoritedCampaigns]);

  if (loading && favoritedCampaigns.length === 0) {
    return (
      <div className="py-8">
        <CampaignCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading favorites: {error}</div>
    );
  }

  return (
    <div className="px-2 py-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Favorites</h2>
      <p className="text-gray-600 mb-8 text-lg">
        Keep track of your saved campaigns and monitor their performance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoritedCampaigns.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-4">
              <FaBookmark className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start exploring campaigns and click the bookmark icon to save them
              here for easy access.
            </p>
          </div>
        ) : (
          favoritedCampaigns.map((campaign) => (
            <div
              key={`fav-${campaign.id}`}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
            >
              <Link
                href={`/campaign/${campaign.id}?${generateRandomString()}`}
                className="block"
              >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={campaign.media || '/bantuhive.svg'}
                    alt={campaign.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                    className="group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      (e.target as HTMLImageElement).src = '/bantuhive.svg';
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-green-600 transition-colors duration-200 text-base leading-tight">
                    {campaign.title}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaUsers className="w-3 h-3 text-green-500" />
                      <span>
                        {campaign?.type === 'EquityCampaign'
                          ? `${campaign.total_investors || 0} Investors`
                          : `${campaign.total_donors || 0} Supporters`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="w-3 h-3 text-orange-500" />
                      <span>{campaign.remaining_days || 0} days left</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {campaign.goal_amount && campaign.transferred_amount && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (Number(campaign.transferred_amount) /
                                Number(campaign.goal_amount)) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {campaign.currency_symbol ||
                            campaign.currency?.toUpperCase()}
                          {parseFloat(
                            campaign.transferred_amount?.toString() || '0',
                          ).toLocaleString()}
                        </span>
                        <span>
                          {campaign.currency_symbol ||
                            campaign.currency?.toUpperCase()}
                          {parseFloat(
                            campaign.goal_amount?.toString() || '0',
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Favorite Button */}
              <button
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group/fav"
                onClick={(e) => {
                  e.preventDefault();
                  unfavoriteCampaign(campaign.id.toString());
                  fetchFavoritedCampaigns();
                }}
                aria-label="Remove from favorites"
              >
                <FaBookmark className="text-green-500 w-4 h-4 group-hover/fav:scale-110 transition-transform" />
              </button>

              {/* Campaign Type Badge */}
              {campaign.type && (
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      campaign.type === 'EquityCampaign'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {campaign.type === 'EquityCampaign' ? 'Equity' : 'Donation'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
