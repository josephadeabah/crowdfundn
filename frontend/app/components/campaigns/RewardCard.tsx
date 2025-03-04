'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaGift } from 'react-icons/fa';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';

import { CampaignResponseDataType } from '@/app/types/campaigns.types';

type RewardCardsProps = {
  campaigns: CampaignResponseDataType[];
};

const RewardCard: React.FC<RewardCardsProps> = ({ campaigns }) => {
  const rewards = campaigns.flatMap((campaign) =>
    campaign.rewards.map((reward) => ({
      ...reward,
      campaign,
    })),
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg">
      <CarouselComponent title="Support projects with rewards" slidesToShow={3}>
        {rewards.map((reward) => {
          const campaign = reward.campaign;
          return (
            <motion.div
              key={reward.id}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="group relative dark:bg-gray-900 px-3 py-3 h-full dark:text-gray-50 cursor-pointer overflow-hidden rounded-lg"
            >
              <Link href={`/campaign/${campaign.id}`}>
                <div className="grid grid-cols-1 h-full">
                  {/* Reward Image */}
                  <div className="relative w-full h-48">
                    <Image
                      src={reward.image || '/bantuhive.svg'}
                      alt={reward.title}
                      layout="fill"
                      objectFit="cover"
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>

                  {/* Reward Details */}
                  <div className="px-4 py-3 h-40 bg-gray-50 hover:bg-white dark:bg-gray-800 flex flex-col justify-between">
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-700 dark:text-gray-100 mb-1 text-lg">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">
                        {reward.description}
                      </p>
                    </div>

                    {/* Reward Label */}
                    <div className="flex items-center space-x-2 mt-3 text-sm font-semibold text-green-600 dark:text-green-400">
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
