'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { cn } from '@/app/lib/utils';
import { Heart } from 'lucide-react';
import { deslugify } from '@/app/utils/helpers/categories';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';
import ToastComponent from '../toast/Toast';

type RewardCardsProps = {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
};

const RewardCard: React.FC<RewardCardsProps> = ({
  campaigns,
  loading,
  error,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('All');
  const filters = ['All'];
  const carouselRef = useRef<HTMLDivElement>(null);
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const { user } = useAuth();

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Filter rewards based on campaign status and permissions
  const rewards = campaigns
    .filter(
      (campaign) =>
        campaign.status !== 'completed' && campaign.permissions.is_public,
    )
    .flatMap((campaign) =>
      campaign.rewards.map((reward) => ({
        ...reward,
        campaign,
      })),
    );

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

  return (
    <>
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div className="animate-fade-up">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full mb-4">
            Trending Now
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Featured Rewards
          </h2>
        </div>

        <div className="flex mt-6 md:mt-0 gap-2 animate-fade-up">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 animate-fade-up">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setCurrentFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              currentFilter === filter
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {rewards.map((reward, index) => (
          <div
            key={reward.id}
            className="snap-start flex-none w-[280px] md:w-[350px]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className="group relative overflow-hidden rounded-xl bg-background border border-border hover:border-green-500/30 hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link
                href={`/campaign/${reward.campaign.id}?tab=donate&${generateRandomString()}`}
                className="block flex-1"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={reward?.image || '/bantuhive.svg'}
                    alt={reward.title}
                    layout="fill"
                    objectFit="cover"
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-700',
                      isHovered ? 'scale-105' : 'scale-100',
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                  <span className="absolute top-4 left-4 px-2 py-1 text-xs font-semibold bg-background/90 text-foreground rounded-md">
                    {deslugify(reward?.campaign?.category)}
                  </span>

                  <button
                    className={cn(
                      'absolute top-4 right-4 p-2 rounded-full transition-colors',
                      reward.campaign.favorited
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-background/80 text-muted-foreground hover:text-green-500',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      reward.campaign.favorited
                        ? handleUnfavorite(reward.campaign.id.toString())
                        : handleFavorite(reward.campaign.id.toString());
                    }}
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4',
                        reward.campaign?.favorited && 'fill-green-500',
                      )}
                    />
                  </button>
                </div>
                {/* Ensure this stays at the bottom */}
                <div className="flex items-center space-x-2 px-2 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                  <FaGift className="text-lg" />
                  <span>Exclusive Reward</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Applied CSS without using the style tag with jsx prop */}
      <div className="no-scrollbar"></div>
    </>
  );
};

export default RewardCard;
