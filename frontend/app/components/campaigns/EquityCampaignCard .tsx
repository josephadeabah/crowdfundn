'use client';
import React, { useState } from 'react';
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
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const { user } = useAuth();
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const handleFavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    await favoriteCampaign(campaignId);
  };

  const handleUnfavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }
    await unfavoriteCampaign(campaignId);
  };

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
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return <CampaignCardLoader />;
  }

  return (
    <div
      className="group relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col rounded-xl border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/campaign/${campaign.slug || campaign.id}?tab=invest&${generateRandomString()}`}
        className="block flex-1"
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={campaign?.media || '/bantuhive.svg'}
            alt={campaign.title}
            fill
            sizes="(max-width: 768px) 280px, 350px"
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
              'absolute top-4 right-4 p-2 rounded-full transition-colors bg-white/90 backdrop-blur-sm',
              campaign.favorited
                ? 'text-green-600'
                : 'text-gray-400 hover:text-green-600',
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              campaign.favorited
                ? handleUnfavorite(campaign.id.toString())
                : handleFavorite(campaign.id.toString());
            }}
          >
            <Heart
              className={cn('h-4 w-4', campaign?.favorited && 'fill-current')}
            />
          </button>
        </div>

        {/* Fundraiser profile positioned to overlap */}
        <div className="relative px-4 -mt-5 z-10 flex items-end justify-end">
          <div className="flex flex-col items-end">
            <div className="bg-white rounded-full p-0.5 shadow-lg ring-1 ring-gray-200">
              <Avatar
                name={campaign?.fundraiser?.profile?.name}
                size="sm"
                imageUrl={campaign?.fundraiser?.profile?.avatar}
              />
            </div>
            <span className="mt-1 text-xs font-medium text-gray-700 bg-white/95 px-2 py-0.5 rounded-full shadow-sm">
              {campaign?.fundraiser?.profile?.name}
            </span>
          </div>
        </div>

        <div className="p-4 pt-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {campaign.title}
          </h3>

          {/* Category badge */}
          <span className="inline-block mb-4 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {deslugify(campaign?.category)}
          </span>

          {/* Investment Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Valuation */}
            <div className="bg-gray-50 rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Valuation</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  (campaign.valuation ?? 0).toString(),
                )?.toLocaleString()}
              </p>
            </div>

            {/* Raised Amount */}
            <div className="bg-gray-50 rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Raised</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  campaign.transferred_amount.toString(),
                )?.toLocaleString()}
              </p>
            </div>

            {/* Investors */}
            <div className="bg-gray-50 rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Investors</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {campaign.total_investors}
              </p>
            </div>

            {/* Days Left */}
            <div className="bg-gray-50 rounded-lg p-1">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Days Left</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {campaign.remaining_days}
              </p>
            </div>
          </div>

          {/* Minimum Investment */}
          <div className="mb-4">
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Minimum Investment</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  (campaign.minimum_investment ?? '0.0').toString(),
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Invest Button */}
          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex-1 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm">
              Invest Now
            </Button>
            <InfoTooltip
              id={`tooltip-${campaign.id}`}
              content="This offering is hosted by BantuHive LLC"
              className="ml-2"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EquityCampaignCard;