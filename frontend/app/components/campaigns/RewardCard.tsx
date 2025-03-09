'use client';
import React, { useState } from 'react';
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
  reward: CampaignResponseDataType;
  loading: boolean;
  error: string | null;
};

const RewardCard: React.FC<RewardCardsProps> = ({ reward, loading, error }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href="/campaign" className="block flex-1">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={reward?.media || '/bantuhive.svg'}
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
            {reward?.category}
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

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3 flex items-center gap-2">
            <Image
              src={reward?.media || '/bantuhive.svg'}
              alt={reward.title}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-muted-foreground">
              {reward?.fundraiser?.profile?.name}
            </span>
          </div>

          <h3
            className={cn(
              'text-lg font-semibold text-foreground mb-2 line-clamp-2 transition-colors duration-300',
              isHovered ? 'text-primary' : '',
            )}
          >
            {reward.title}
          </h3>

          {/* Reward Details */}
          <div className="w-full px-4 py-3 h-40 bg-gray-50 hover:bg-white dark:bg-gray-800 flex flex-col">
            {/* Content should grow to push the label down */}
            <div className="flex-grow flex flex-col gap-2">
              <h3 className="font-bold text-gray-700 dark:text-gray-100 text-lg">
                {reward.title}
              </h3>
            </div>
            {/* Ensure this stays at the bottom */}
            <div className="flex items-center space-x-2 text-sm font-semibold text-green-600 dark:text-green-400">
              <FaGift className="text-lg" />
              <span>Exclusive Reward</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RewardCard;
