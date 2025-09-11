'use client';
import React, { useState, useEffect } from 'react';
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
import ToastComponent from '../toast/Toast';

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
        className="group relative overflow-hidden bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-300 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/campaign/${campaign.slug || campaign.id}?tab=donate&${generateRandomString()}`}
          className="block flex-1"
        >
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={reward?.image || '/bantuhive.svg'}
              alt={reward.title}
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
            <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold bg-white/90 text-orange-600 rounded-full">
              {deslugify(campaign?.category)}
            </span>

            <button
              className={cn(
                'absolute top-4 right-4 p-2 rounded-full transition-colors bg-white backdrop-blur-sm',
                isFavorited
                  ? 'text-green-500'
                  : 'text-muted-foreground hover:text-green-500',
              )}
              onClick={(e) => handleFavoriteClick(e, campaign.id.toString())}
              aria-label={
                isFavorited ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {reward.title}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {reward.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 px-2 py-4 text-sm font-semibold text-green-600">
            <FaGift className="text-lg" />
            <span>Exclusive Reward</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default RewardCard;
