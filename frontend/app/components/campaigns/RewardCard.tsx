'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';

import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import ErrorPage from '../errorpage/ErrorPage';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { cn } from '@/app/lib/utils';
import { Heart } from 'lucide-react';

type RewardCardsProps = {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
};

const RewardCard: React.FC<RewardCardsProps> = ({ campaigns, loading, error }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    
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

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          <Link href="/campaign" className="block flex-1">
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
                {reward?.campaign?.category}
              </span>

              <button
                className={cn(
                  'absolute top-4 right-4 p-2 rounded-full transition-colors',
                  isLiked
                    ? 'bg-primary/20 text-primary'
                    : 'bg-background/80 text-muted-foreground hover:text-primary',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
              >
                <Heart className={cn('h-4 w-4', isLiked && 'fill-primary')} />
              </button>
            </div>
            {/* Ensure this stays at the bottom */}
            <div className="flex items-center space-x-2 text-sm font-semibold text-green-600 dark:text-green-400">
              <FaGift className="text-lg" />
              <span>Exclusive Reward</span>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  );
};

export default RewardCard;