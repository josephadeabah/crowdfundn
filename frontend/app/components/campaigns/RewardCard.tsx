'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import { Heart } from 'lucide-react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { cn } from '@/app/lib/utils';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import ErrorPage from '../errorpage/ErrorPage';

interface RewardCardProps {
  campaign: CampaignResponseDataType;
  reward: {
    id: number;
    title: string;
    campaign_id?: number;
    description: string;
    image?: string;
    amount: number;
  };
  loading: boolean;
  error: string | null;
}

const RewardCard: React.FC<RewardCardProps> = ({
  campaign,
  reward,
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

  if (error) {
    return (
      <div className="w-full">
        <ErrorPage />
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden bg-background hover:bg-gray-50 hover:shadow-md transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/campaign/${campaign.id}?tab=donate&${generateRandomString()}`}
        className="block flex-1"
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={reward?.image || '/bantuhive.svg'}
            alt={reward.title}
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
            {reward.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {reward.description}
          </p>
        </div>

        <div className="flex items-center space-x-2 px-2 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
          <FaGift className="text-lg" />
          <span>Exclusive Reward</span>
        </div>
      </Link>
    </div>
  );
};

export default RewardCard;
