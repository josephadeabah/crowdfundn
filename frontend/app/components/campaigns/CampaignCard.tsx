import React from 'react';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import EmptyPage from '../emptypage/EmptyPage';
import { generateRandomString } from '../../utils/helpers/generate.random-string';
import Image from 'next/image';
import { deslugify } from '@/app/utils/helpers/categories';

type CampaignCardProps = {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaigns,
  loading,
  error,
}) => {
  if (loading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  return (
    <div>
      {campaigns.length === 0 ? (
        <EmptyPage />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2 md:p-0 relative">
          {campaigns.slice(0, 12).map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            return (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:shadow-lg transition-transform duration-300 cursor-pointer"
              >
                <Link
                  href={`/campaign/${campaign.id}?${generateRandomString()}`}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className="relative w-full"
                      style={{ paddingTop: '100%' }}
                    >
                      <Image
                        src={campaign?.media}
                        alt="media thumbnail"
                        sizes="100vw"
                        layout="fill"
                        objectFit="cover"
                        className="absolute top-0 left-0 rounded-t"
                      />
                    </div>
                    <div className="px-1 dark:text-gray-50">
                      <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden">
                        {campaign?.title}
                      </h3>
                      <span className="text-xs text-green-600">
                        {deslugify(campaign?.category)}
                      </span>
                      <div className="w-full text-xs">
                        <Progress
                          firstProgress={
                            (Number(campaign?.current_amount) /
                              Number(campaign?.goal_amount)) *
                            100
                          }
                          firstTooltipContent={`Progress: ${
                            (Number(campaign?.current_amount) /
                              Number(campaign?.goal_amount)) *
                            100
                          }%`}
                        />
                      </div>
                      <p className="flex justify-between items-center text-sm font-semibold mt-2">
                        <span className="font-medium">
                          {fundraiserCurrency}
                          {parseFloat(campaign.current_amount).toLocaleString()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          of {fundraiserCurrency}
                          {parseFloat(campaign.goal_amount).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
