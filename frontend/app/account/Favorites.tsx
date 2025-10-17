import React, { useEffect, useState } from 'react';
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
  FaRegHeart
} from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
import CampaignCardSkeleton from '../loaders/CampaignCardSkeleton';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Button } from '../components/button/Button';
import Avatar from '../components/avatar/Avatar';

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
  const [displayCampaigns, setDisplayCampaigns] = useState<any[]>([]);
  const [isFavoriting, setIsFavoriting] = useState<string | null>(null);

  useEffect(() => {
    fetchFavoritedCampaigns();
    // Fetch first 15 campaigns if no favorites exist
    if (favoritedCampaigns.length === 0) {
      fetchAllCampaigns('created_at', 'desc', 1, 15);
    }
  }, [fetchFavoritedCampaigns, fetchAllCampaigns]);

  useEffect(() => {
    // Show favorites if they exist, otherwise show first 15 campaigns
    if (favoritedCampaigns.length > 0) {
      setDisplayCampaigns(favoritedCampaigns);
    } else {
      setDisplayCampaigns(campaigns.slice(0, 15));
    }
  }, [favoritedCampaigns, campaigns]);

  const handleFavoriteClick = async (campaignId: string, isCurrentlyFavorited: boolean) => {
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

  if (loading && displayCampaigns.length === 0) {
    return (
      <div className="py-8">
        <CampaignCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error loading watchlist: {error}</div>
    );
  }

  return (
    <div className="px-2 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg">
            <FaBookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Watchlist Feed</h1>
            <p className="text-gray-600 mt-1">
              {favoritedCampaigns.length > 0 
                ? `Tracking ${favoritedCampaigns.length} campaign${favoritedCampaigns.length > 1 ? 's' : ''} you're interested in`
                : 'Discover trending campaigns to add to your watchlist'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {displayCampaigns.length === 0 ? (
          <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 mb-4">
              <FaBookmark className="w-20 h-20 mx-auto opacity-40" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">
              Your Watchlist is Empty
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg mb-6">
              Start exploring campaigns and click the heart icon to add them to your watchlist for easy tracking.
            </p>
            <Link href="/invest">
              <Button className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-3 rounded-xl">
                Explore Campaigns
              </Button>
            </Link>
          </div>
        ) : (
          displayCampaigns.map((campaign) => {
            const progressPercentage = getProgressPercentage(
              Number(campaign.transferred_amount || 0),
              Number(campaign.goal_amount || 1)
            );
            const isFavorited = favoritedCampaigns.some(fav => fav.id === campaign.id);
            const isEquityCampaign = campaign.type === 'EquityCampaign';
            const companyName = campaign.company_info?.name || campaign.fundraiser?.profile?.name || 'Unknown Company';

            return (
              <div
                key={`watchlist-${campaign.id}`}
                className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="relative lg:w-64 lg:flex-shrink-0">
                    <Link
                      href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                      className="block relative w-full h-48 lg:h-full"
                    >
                      <Image
                        src={campaign.media || '/bantuhive.svg'}
                        alt={campaign.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/bantuhive.svg';
                        }}
                      />
                      
                      {/* Campaign Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            isEquityCampaign
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}
                        >
                          {isEquityCampaign ? 'Equity' : 'Donation'}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link
                            href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
                            className="block"
                          >
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                              {campaign.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaBuilding className="w-4 h-4 text-gray-400" />
                            <span>{companyName}</span>
                            {isEquityCampaign && campaign.valuation && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="font-medium text-green-600">
                                  Valued at {formatCurrency(Number(campaign.valuation), campaign.currency)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={() => handleFavoriteClick(campaign.id.toString(), isFavorited)}
                          disabled={isFavoriting === campaign.id.toString() || !user}
                          className="ml-4 p-3 bg-gray-50 rounded-xl disabled:opacity-50"
                          aria-label={isFavorited ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          {isFavoriting === campaign.id.toString() ? (
                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          ) : isFavorited ? (
                            <FaHeart className="w-5 h-5 text-green-500" />
                          ) : (
                            <FaRegHeart className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <FaDollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Raised</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(Number(campaign.transferred_amount || 0), campaign.currency)}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <FiTarget className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">Goal</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(Number(campaign.goal_amount || 0), campaign.currency)}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <FaUsers className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                              {isEquityCampaign ? 'Investors' : 'Supporters'}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {campaign.total_investors || campaign.total_donors || 0}
                          </p>
                        </div>

                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <FaClock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">Time Left</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {campaign.remaining_days || 0} days
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress: {progressPercentage.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(Number(campaign.transferred_amount || 0), campaign.currency)} of{' '}
                            {formatCurrency(Number(campaign.goal_amount || 0), campaign.currency)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-orange-500 h-3 rounded-full"
                            style={{
                              width: `${progressPercentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={campaign.fundraiser?.profile?.name}
                            size="sm"
                            imageUrl={campaign.fundraiser?.profile?.avatar}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {campaign.fundraiser?.profile?.name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">Campaign Creator</p>
                          </div>
                        </div>
                        
                        <Link
                          href={`/campaign/${campaign.slug || campaign.id}?tab=${isEquityCampaign ? 'invest' : 'donate'}&${generateRandomString()}`}
                        >
                          <Button className="bg-gradient-to-r from-green-500 to-orange-500 text-white">
                            {isEquityCampaign ? 'Invest Now' : 'Donate Now'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Empty State when showing all campaigns */}
      {favoritedCampaigns.length === 0 && displayCampaigns.length > 0 && (
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl border border-green-200">
          <FaRegHeart className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No campaigns in your watchlist yet
          </h3>
          <p className="text-gray-600 mb-4">
            Click the heart icon on any campaign to add it to your watchlist and track its progress here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;