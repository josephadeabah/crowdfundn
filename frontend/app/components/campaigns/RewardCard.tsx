'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaUser } from 'react-icons/fa';
import Avatar from '../avatar/Avatar';
import Progress from '../progressbar/ProgressBar';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';

type RewardCardsProps = {
  campaigns: CampaignResponseDataType[];
};

const RewardCard: React.FC<RewardCardsProps> = ({ campaigns }) => {
  // Flatten the rewards array from all campaigns
  const rewards = campaigns.flatMap((campaign) =>
    campaign.rewards.map((reward) => ({
      ...reward,
      campaign, // Include the campaign data for each reward
    })),
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg">
      <CarouselComponent title="Rewards" slidesToShow={3}>
        {rewards.map((reward) => {
          const campaign = reward.campaign;
          const fundraiserCurrency =
            campaign.currency_symbol || campaign.currency?.toUpperCase();

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
                      className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                    />
                  </div>

                  {/* Reward Details */}
                  <div className="px-4 py-3 h-full bg-gray-50 hover:bg-white dark:bg-gray-800 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-100 mb-1 truncate text-lg">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {reward.description}
                      </p>
                    </div>

                    {/* Campaign Progress */}
                    <div className="w-full text-xs">
                      <Progress
                        firstProgress={
                          (Number(campaign.transferred_amount) /
                            Number(campaign.goal_amount)) *
                          100
                        }
                        firstTooltipContent={`Progress: ${
                          (Number(campaign.transferred_amount) /
                            Number(campaign.goal_amount)) *
                          100
                        }%`}
                      />
                    </div>

                    {/* Campaign Details */}
                    <div className="w-full text-xs text-gray-600 dark:text-gray-300 py-2 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar
                            name={campaign.fundraiser.profile.name}
                            size="sm"
                            imageUrl={campaign.fundraiser.profile.avatar}
                          />
                          <span className="w-20 text-sm font-semibold truncate">
                            {campaign.fundraiser.profile.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                        <span
                          className={`${
                            parseFloat(campaign.transferred_amount) >=
                            parseFloat(campaign.goal_amount)
                              ? 'text-green-600'
                              : 'text-orange-500'
                          }`}
                        >
                          <span className="text-gray-600 dark:text-gray-100 mr-1">
                            {fundraiserCurrency}
                          </span>
                          {parseFloat(
                            campaign.transferred_amount,
                          ).toLocaleString()}
                        </span>{' '}
                        <span className="text-gray-600 dark:text-gray-100 truncate">
                          <span className="text-xs p-1">of</span>
                          {fundraiserCurrency}
                          {parseFloat(campaign.goal_amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="block md:flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>{campaign.total_donors || 0} Backers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>{campaign.remaining_days} days left</span>
                        </div>
                      </div>
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
