'use client';
import React, { useState } from 'react';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import Image from 'next/image';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import Avatar from '../avatar/Avatar';
import { cn } from '@/app/lib/utils';
import { Heart, Award } from 'lucide-react';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

type CampaignCardProps = {
  campaign: CampaignResponseDataType;
  loading: boolean;
  error: string | null;
  onPageChange?: (newPage: number) => void;
  className?: string; // Added className prop for carousel styling
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  loading,
  error,
  onPageChange,
  className,
}) => {
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

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
    e.stopPropagation(); // Prevent event bubbling

    if (!user) {
      showToast(
        'Error',
        'You must log in first to add to your favorite and track campaign progress.',
        'error',
      );
      return;
    }

    try {
      if (campaign.favorited) {
        await unfavoriteCampaign(campaignId);
        showToast('Success', 'Campaign removed from favorites', 'success');
      } else {
        await favoriteCampaign(campaignId);
        showToast('Success', 'Campaign added to favorites', 'success');
      }
      // Note: Removed the fetchAllCampaigns call as it's not needed here
      // and could cause unnecessary re-renders in carousel
    } catch (error) {
      showToast('Error', 'Failed to update favorite status', 'error');
    }
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

  // Don't render anything if loading or error at the card level
  // Let the carousel handle loading/error states
  if (loading) {
    return (
      <div
        className={cn(
          'w-[220px] md:w-[280px] h-80 bg-gray-100 animate-pulse rounded-lg',
          className,
        )}
      >
        <div className="h-40 bg-gray-200 rounded-t-lg"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'w-[220px] md:w-[280px] h-80 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-4',
          className,
        )}
      >
        <div className="text-red-600 text-sm text-center">
          Failed to load campaign
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div
        className={cn(
          'w-[220px] md:w-[280px] h-80 bg-gray-100 rounded-lg flex items-center justify-center',
          className,
        )}
      >
        <div className="text-gray-500 text-sm">No campaign data</div>
      </div>
    );
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
        className={cn(
          'group relative overflow-hidden bg-background hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col text-xs rounded-lg',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => handleFavoriteClick(e, String(campaign.id))}
            className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            {campaign.favorited ? (
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
            )}
          </button>
        </div>

        <Link
          href={`/campaign/${campaign.slug || campaign.id}?${generateRandomString()}`}
          className="block flex-1"
          prefetch={false} // Added for better performance in carousels
        >
          <div className="relative aspect-[4/2.5] overflow-hidden">
            <Image
              src={campaign?.media || '/bantuhive.svg'}
              alt={campaign.title || 'Campaign image'}
              fill
              sizes="(max-width: 768px) 220px, 280px"
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
            {campaign.type === 'EquityCampaign' && campaign.equity_status && (
              <span
                className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold rounded-full ${getEquityStatusColor(campaign.equity_status)}`}
              >
                {campaign.equity_status === 'approved'
                  ? 'READY TO LAUNCH'
                  : campaign.equity_status.toUpperCase()}
              </span>
            )}

            {/* Category badge */}
            {campaign?.category && (
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-semibold bg-background/90 text-green-600 rounded-full">
                {deslugify(campaign.category)}
              </span>
            )}
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <div className="mb-2 flex items-center gap-1">
              <Avatar
                name={campaign?.fundraiser?.profile?.name}
                size="sm"
                imageUrl={campaign?.fundraiser?.profile?.avatar}
              />
              <span className="text-xs text-gray-900 font-medium line-clamp-1">
                {campaign?.fundraiser?.profile?.name || 'Unknown Creator'}
              </span>
            </div>

            <h3
              className={cn(
                'text-sm font-semibold text-foreground mb-2 line-clamp-2 transition-colors duration-300 h-10',
                isHovered ? 'text-emerald-500' : '',
              )}
            >
              {campaign.title || 'Untitled Campaign'}
            </h3>

            <div className="mt-auto space-y-2">
              <div className="w-full text-[10px]">
                <Progress
                  firstProgress={
                    campaign?.goal_amount && campaign?.transferred_amount
                      ? (Number(campaign.transferred_amount) /
                          Number(campaign.goal_amount)) *
                        100
                      : 0
                  }
                  firstTooltipContent={`Progress: ${
                    campaign?.goal_amount && campaign?.transferred_amount
                      ? (
                          (Number(campaign.transferred_amount) /
                            Number(campaign.goal_amount)) *
                          100
                        ).toFixed(1)
                      : 0
                  }%`}
                />
              </div>

              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    campaign?.transferred_amount?.toString() || '0',
                  ).toLocaleString()}{' '}
                  raised
                </span>
                <span className="text-muted-foreground">
                  of{' '}
                  {campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase()}{' '}
                  {parseFloat(
                    campaign?.goal_amount?.toString() || '0',
                  ).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3 text-primary" />
                  <span className="font-medium">
                    {campaign.total_donors || 0} Backers
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {campaign.remaining_days ?? 0} days left
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CampaignCard;
