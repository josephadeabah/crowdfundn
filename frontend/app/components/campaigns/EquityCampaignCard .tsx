'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { cn } from '@/app/lib/utils';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import InfoTooltip from '../tooltip/tooltip';
import Avatar from '../avatar/Avatar';
import { Button } from '../ui/button';
import ToastComponent from '../toast/Toast';

interface EquityCardProps {
  campaign: CampaignResponseDataType;
  loading: boolean;
  error: string | null;
}

const EquityCampaignCard: React.FC<EquityCardProps> = ({
  campaign,
  loading,
  error,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(campaign.favorited || false);
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const { user } = useAuth();
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Sync with campaign prop changes
  useEffect(() => {
    setIsFavorited(campaign.favorited || false);
  }, [campaign.favorited]);

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const handleFavoriteClick = async (
    e: React.MouseEvent,
    campaignId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }

    try {
      if (isFavorited) {
        await unfavoriteCampaign(campaignId);
        setIsFavorited(false);
        showToast('Success', 'Campaign removed from favorites', 'success');
      } else {
        await favoriteCampaign(campaignId);
        setIsFavorited(true);
        showToast('Success', 'Campaign added to favorites', 'success');
      }
    } catch (error) {
      showToast('Error', 'Failed to update favorite status', 'error');
    }
  };

  const getEquityStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'funded':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'failed':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return <CampaignCardLoader />;
  }

  return (
    <>
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div
        className="group relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col rounded-lg border border-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/campaign/${campaign.slug || campaign.id}?tab=invest&${generateRandomString()}`}
          className="block flex-1"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={campaign?.media || '/bantuhive.svg'}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 320px, 380px"
              className={cn(
                'object-cover transition-transform duration-700',
                isHovered ? 'scale-105' : 'scale-100',
              )}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/bantuhive.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Equity status badge */}
            <span
              className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-medium rounded-lg ${getEquityStatusColor(campaign.equity_status ?? '')}`}
            >
              {campaign.equity_status === 'approved'
                ? 'READY TO LAUNCH'
                : campaign.equity_status?.toUpperCase()}
            </span>

            <button
              className={cn(
                'absolute top-4 right-4 p-2.5 rounded-full transition-colors bg-white/90 backdrop-blur-sm',
                isFavorited
                  ? 'text-green-600'
                  : 'text-gray-400 hover:text-green-600',
              )}
              onClick={(e) => handleFavoriteClick(e, campaign.id.toString())}
              aria-label={
                isFavorited ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Heart className={cn('h-5 w-5', isFavorited && 'fill-current')} />
            </button>
          </div>

          {/* Fundraiser profile positioned to overlap */}
          <div className="relative px-5 -mt-6 z-10 flex items-end justify-end">
            <div className="flex flex-col items-end">
              <div className="bg-white rounded-full p-1 shadow-lg ring-2 ring-white">
                <Avatar
                  name={campaign?.fundraiser?.profile?.name}
                  size="md"
                  imageUrl={campaign?.fundraiser?.profile?.avatar}
                />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 bg-white/95 px-3 py-1 rounded-full shadow-sm">
                {campaign?.fundraiser?.profile?.name}
              </span>
            </div>
          </div>

          <div className="p-5 pt-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
              {campaign.title}
            </h3>

            {/* Category badge */}
            <span className="inline-block mb-4 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              {deslugify(campaign?.category)}
            </span>

            {/* Investment Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Valuation */}
              <div className="rounded-lg p-2 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    Valuation
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    (campaign.valuation ?? 0).toString(),
                  )?.toLocaleString()}
                </p>
              </div>

              {/* Raised Amount */}
              <div className="rounded-lg p-2 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    Raised
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    campaign.transferred_amount.toString(),
                  )?.toLocaleString()}
                </p>
              </div>

              {/* Investors */}
              <div className="rounded-lg p-2 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    Investors
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {campaign.total_investors}
                </p>
              </div>

              {/* Days Left */}
              <div className="rounded-lg p-2 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">
                    Days Left
                  </span>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {campaign.remaining_days}
                </p>
              </div>
            </div>

            {/* Minimum Investment */}
            <div className="mb-5 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Minimum Investment
                  </span>
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    (campaign.minimum_investment ?? '0.0').toString(),
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Invest Button */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="flex-1 bg-white hover:bg-white hover:text-gray-800 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-base"
              >
                Invest Now
              </Button>
              <InfoTooltip
                id={`tooltip-${campaign.id}`}
                content="This offering is hosted by BantuHive LLC"
                className="ml-3"
              />
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default EquityCampaignCard;
