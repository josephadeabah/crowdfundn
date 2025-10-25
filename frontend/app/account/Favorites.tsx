'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import Image from 'next/image';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import {
  FaBookmark,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaHeart,
  FaRegHeart,
  FaTimes,
} from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Button } from '../components/button/Button';
import Avatar from '../components/avatar/Avatar';
import WatchlistSkeletonLoader from '../loaders/WatchlistSkeletonLoader';

const Favorites = () => {
  const {
    favoritedCampaigns,
    campaigns,
    loading,
    error,
    fetchFavoritedCampaigns,
    unfavoriteCampaign,
    favoriteCampaign,
    fetchAllCampaigns,
  } = useCampaignContext();

  const { user } = useAuth();
  const [isFavoriting, setIsFavoriting] = useState<string | null>(null);

  useEffect(() => {
    fetchFavoritedCampaigns();
    fetchAllCampaigns('created_at', 'desc', 1, 20);
  }, [fetchFavoritedCampaigns, fetchAllCampaigns]);

  // Filter campaigns using the same conditions as FeaturedCampaigns
  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.equity_status !== 'draft' &&
        campaign.equity_status !== 'pending_approval' &&
        campaign.permissions.is_public
      );
    });
  }, [campaigns]);

  // Filter favorited campaigns using the same conditions
  const filteredFavoritedCampaigns = useMemo(() => {
    if (!favoritedCampaigns) return [];
    return favoritedCampaigns.filter((campaign) => {
      return (
        campaign.status !== 'completed' &&
        campaign.equity_status !== 'draft' &&
        campaign.equity_status !== 'pending_approval' &&
        campaign.permissions.is_public
      );
    });
  }, [favoritedCampaigns]);

  const handleFavoriteClick = async (
    campaignId: string,
    isCurrentlyFavorited: boolean,
  ) => {
    if (!user) return;

    setIsFavoriting(campaignId);
    try {
      if (isCurrentlyFavorited) {
        await unfavoriteCampaign(campaignId);
      } else {
        await favoriteCampaign(campaignId);
      }
      await fetchFavoritedCampaigns();
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsFavoriting(null);
    }
  };

  const getProgressPercentage = (transferred: number, goal: number) => {
    return Math.min((transferred / goal) * 100, 100);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="py-8">
        <WatchlistSkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading watchlist: {error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <FaBookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Watchlist</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track campaigns you're interested in and discover new
                opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - All Campaigns */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Campaigns
              </h2>
              <p className="text-sm text-gray-600">
                Explore and add campaigns to your watchlist
              </p>
            </div>

            <div className="space-y-6">
              {filteredCampaigns.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-200">
                  <div className="text-gray-400 mb-3">
                    <FaBookmark className="w-16 h-16 mx-auto opacity-40" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Campaigns Available
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                    There are no campaigns to display at the moment.
                  </p>
                </div>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const progressPercentage = getProgressPercentage(
                    Number(campaign.transferred_amount || 0),
                    Number(campaign.goal_amount || 1),
                  );
                  const isFavorited = filteredFavoritedCampaigns.some(
                    (fav) => fav.id === campaign.id,
                  );
                  const isEquityCampaign = campaign.type === 'EquityCampaign';
                  const companyName =
                    campaign.company_info?.name ||
                    campaign.fundraiser?.profile?.name ||
                    'Unknown Company';

                  return (
                    <div
                      key={`campaign-${campaign.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Image Section */}
                      <div className="relative w-full h-48">
                        <Link
                          href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                          className="block relative w-full h-full"
                        >
                          <Image
                            src={campaign.media || '/bantuhive.svg'}
                            alt={campaign.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                '/bantuhive.svg';
                            }}
                          />

                          {/* Campaign Type Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                isEquityCampaign
                                  ? 'bg-green-100 text-green-700 border border-green-200'
                                  : 'bg-orange-100 text-orange-700 border border-orange-200'
                              }`}
                            >
                              {isEquityCampaign ? 'Equity' : 'Donation'}
                            </span>
                          </div>

                          {/* Favorite Button - Overlay */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleFavoriteClick(
                                campaign.id.toString(),
                                isFavorited,
                              );
                            }}
                            disabled={
                              isFavoriting === campaign.id.toString() || !user
                            }
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm disabled:opacity-50 hover:bg-white transition-colors"
                            aria-label={
                              isFavorited
                                ? 'Remove from watchlist'
                                : 'Add to watchlist'
                            }
                          >
                            {isFavoriting === campaign.id.toString() ? (
                              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            ) : isFavorited ? (
                              <FaHeart className="w-5 h-5 text-green-500" />
                            ) : (
                              <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-green-500 transition-colors" />
                            )}
                          </button>
                        </Link>
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        {/* Header */}
                        <div className="mb-3">
                          <Link
                            href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                            className="block"
                          >
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                              {campaign.title}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaBuilding className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="line-clamp-1 font-medium">
                              {companyName}
                            </span>
                            {isEquityCampaign && campaign.valuation && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(
                                    Number(campaign.valuation),
                                    campaign.currency,
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              {progressPercentage.toFixed(1)}% funded
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatCurrency(
                                Number(campaign.transferred_amount || 0),
                                campaign.currency,
                              )}{' '}
                              of{' '}
                              {formatCurrency(
                                Number(campaign.goal_amount || 0),
                                campaign.currency,
                              )}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-green-500 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${progressPercentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FaDollarSign className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Raised
                              </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                              {formatCurrency(
                                Number(campaign.transferred_amount || 0),
                                campaign.currency,
                              )}
                            </p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FiTarget className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Goal
                              </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                              {formatCurrency(
                                Number(campaign.goal_amount || 0),
                                campaign.currency,
                              )}
                            </p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FaUsers className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {isEquityCampaign ? 'Investors' : 'Supporters'}
                              </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                              {campaign.total_investors ||
                                campaign.total_donors ||
                                0}
                            </p>
                          </div>

                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FaClock className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Days Left
                              </span>
                            </div>
                            <p className="text-base font-bold text-gray-900">
                              {campaign.remaining_days || 0}
                            </p>
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={campaign.fundraiser?.profile?.name}
                              size="md"
                              imageUrl={campaign.fundraiser?.profile?.avatar}
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {campaign.fundraiser?.profile?.name ||
                                  'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Campaign Owner
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/campaign/${campaign.slug || campaign.id}?tab=${isEquityCampaign ? 'invest' : 'donate'}&${generateRandomString()}`}
                            className="flex-shrink-0"
                          >
                            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg min-w-[120px]">
                              {isEquityCampaign ? 'Invest Now' : 'Donate Now'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column - Favorites Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Sidebar Header - Fixed */}
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Watchlist
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredFavoritedCampaigns.length} campaign
                      {filteredFavoritedCampaigns.length !== 1 ? 's' : ''}{' '}
                      tracked
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaBookmark className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Scrollable Favorites List */}
              <div
                className="overflow-y-auto"
                style={{
                  maxHeight: 'calc(100vh - 200px)',
                  minHeight: '200px',
                }}
              >
                <div className="p-4">
                  {filteredFavoritedCampaigns.length === 0 ? (
                    <div className="text-center py-8">
                      <FaRegHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 mb-2">
                        No campaigns in watchlist
                      </p>
                      <p className="text-xs text-gray-400">
                        Click the heart icon to add campaigns
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredFavoritedCampaigns.map((campaign) => {
                        const isEquityCampaign =
                          campaign.type === 'EquityCampaign';
                        const companyName =
                          campaign.company_info?.name ||
                          campaign.fundraiser?.profile?.name ||
                          'Unknown Company';

                        return (
                          <div
                            key={`favorite-${campaign.id}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                          >
                            {/* Avatar */}
                            <Link
                              href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                              className="flex-shrink-0"
                            >
                              <Avatar
                                name={companyName}
                                size="sm"
                                imageUrl={campaign.fundraiser?.profile?.avatar}
                              />
                            </Link>

                            {/* Campaign Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                                className="block"
                              >
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {campaign.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {companyName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      isEquityCampaign
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}
                                  >
                                    {isEquityCampaign ? 'Equity' : 'Donation'}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatCurrency(
                                      Number(campaign.transferred_amount || 0),
                                      campaign.currency,
                                    )}
                                  </span>
                                </div>
                              </Link>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                handleFavoriteClick(
                                  campaign.id.toString(),
                                  true,
                                )
                              }
                              disabled={isFavoriting === campaign.id.toString()}
                              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors group-hover:bg-white rounded"
                              aria-label="Remove from watchlist"
                            >
                              {isFavoriting === campaign.id.toString() ? (
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FaTimes className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Footer - Fixed */}
              {filteredFavoritedCampaigns.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <p className="text-xs text-gray-500 text-center">
                    Click the X to remove from watchlist
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
