'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';

import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import ErrorPage from '../errorpage/ErrorPage';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';

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

  if (loading)
    return (
      <div className="px-2 py-4">
        <CampaignCardLoader />
      </div>
    );
  if (error)
    return (
      <div className="px-2">
        <ErrorPage />
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg mb-10 md:mb-20">
      <CarouselComponent title="Support projects with rewards" slidesToShow={4}>
        {rewards.map((reward) => {
          const campaign = reward.campaign;
          return (
            <motion.div
              key={reward.id}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="group relative dark:bg-gray-900 px-3 py-3 h-full dark:text-gray-50 cursor-pointer rounded-lg"
            >
              <Link
                href={`/campaign/${campaign.id}?tab=donate&${generateRandomString()}`}
              >
                <div className="grid grid-cols-1 h-full">
                  {/* Reward Image */}
                  <div className="relative w-full h-32">
                    <Image
                      src={reward.image || '/bantuhive.svg'}
                      alt={reward.title}
                      layout="fill"
                      objectFit="cover"
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                  {/* Reward Details */}
                  <div className="w-full px-4 py-3 h-40 bg-gray-50 hover:bg-white dark:bg-gray-800 flex flex-col">
                    {/* Content should grow to push the label down */}
                    <div className="flex-grow flex flex-col gap-2">
                      <h3 className="font-bold text-gray-700 dark:text-gray-100 text-lg">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {reward.description}
                      </p>
                    </div>
                    {/* Ensure this stays at the bottom */}
                    <div className="flex items-center space-x-2 text-sm font-semibold text-green-600 dark:text-green-400">
                      <FaGift className="text-lg" />
                      <span>Exclusive Reward</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </CarouselComponent>
    </div>
  );
};

export default RewardCard;
