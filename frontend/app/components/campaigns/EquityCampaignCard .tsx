'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { cn } from '@/app/lib/utils';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';

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

  if (loading) {
    return <CampaignCardLoader />;
  }

  return (
    <div
      className="group relative overflow-hidden bg-background hover:bg-gray-50 hover:shadow-md transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/campaign/${campaign.id}?tab=invest&${generateRandomString()}`}
        className="block flex-1"
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={campaign?.media || '/bantuhive.svg'}
            alt={campaign.title}
            layout="fill"
            objectFit="cover"
            unoptimized
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              isHovered ? 'scale-105' : 'scale-100',
            )}
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.currentTarget.src = '/bantuhive.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold bg-background/90 text-orange-600 rounded-full">
            {deslugify(campaign?.category)}
          </span>

          <button
            className={cn(
              'absolute top-4 right-4 p-2 rounded-full transition-colors',
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

        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {campaign.title}
          </h3>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Valuation</span>
            <span className="text-sm font-semibold">
              ${campaign.valuation?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount Raised</span>
            <span className="text-sm font-semibold">
              ${campaign.transferred_amount?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Investors</span>
            <span className="text-sm font-semibold">
              {campaign.total_investors}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Days Left</span>
            <span className="text-sm font-semibold">
              {campaign.remaining_days}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EquityCampaignCard;
