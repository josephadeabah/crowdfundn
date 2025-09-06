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
        return 'bg-green-500/10 text-green-500';
      case 'approved':
        return 'bg-blue-500/10 text-blue-500';
      case 'funded':
        return 'bg-purple-500/10 text-purple-500';
      case 'closed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return <CampaignCardLoader />;
  }

  return (
    <div
      className="group relative overflow-hidden bg-background hover:bg-gray-50 hover:shadow-md transition-all duration-300 h-full flex flex-col rounded-lg border border-gray-200"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>

          {/* Equity status badge */}
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${getEquityStatusColor(campaign.equity_status ?? '')}`}
          >
            {campaign.equity_status === 'approved'
              ? 'READY TO LAUNCH'
              : campaign.equity_status?.toUpperCase()}
          </span>

          <button
            className={cn(
              'absolute top-4 right-4 p-2 rounded-full transition-colors backdrop-blur-sm',
              campaign.favorited
                ? 'bg-green-500/20 text-green-500'
                : 'bg-background/80 text-muted-foreground hover:text-green-500',
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
              className={cn('h-4 w-4', campaign?.favorited && 'fill-green-500')}
            />
          </button>
        </div>

        {/* Fundraiser profile positioned to overlap */}
        <div className="relative px-4 -mt-6 z-10 flex items-end justify-end">
          <div className="flex flex-col items-end">
            <div className="bg-white rounded-full p-1 shadow-md ring-2 ring-white">
              <Avatar
                name={campaign?.fundraiser?.profile?.name}
                size="sm"
                imageUrl={campaign?.fundraiser?.profile?.avatar}
              />
            </div>
            <span className="mt-1 text-xs font-medium text-gray-700 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
              {campaign?.fundraiser?.profile?.name}
            </span>
          </div>
        </div>

        <div className="p-4 pt-2">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {campaign.title}
          </h3>

          {/* Category badge */}
          <span className="inline-block mb-3 px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
            {deslugify(campaign?.category)}
          </span>

          {/* Investment Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Valuation */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Valuation</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  (campaign.valuation ?? 0).toString(),
                )?.toLocaleString()}
              </p>
            </div>

            {/* Raised Amount */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Raised</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  campaign.transferred_amount.toString(),
                )?.toLocaleString()}
              </p>
            </div>

            {/* Investors */}
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Investors</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {campaign.total_investors}
              </p>
            </div>

            {/* Days Left */}
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">Days Left</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {campaign.remaining_days}
              </p>
            </div>
          </div>

          {/* Minimum Investment */}
          <div className="mb-3">
            <div className="flex justify-between items-center bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-red-600 font-medium">Min. Investment</span>
              </div>
              <span className="text-sm font-semibold text-red-800">
                {campaign?.currency_symbol || campaign?.currency?.toUpperCase()}{' '}
                {parseFloat(
                  (campaign.minimum_investment ?? '0.0').toString(),
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Invest Button */}
          <div className="flex justify-between items-center">
            <Button variant="outline" className="flex-1 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200">
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