import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React from 'react';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import EmptyPage from '../emptypage/EmptyPage';
import { generateRandomString } from '../../utils/helpers/generate.random-string';
import Image from 'next/image';

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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:p-0">
          {campaigns.slice(0, 9).map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Link href={`/campaign/${campaign.id}?${generateRandomString()}`}>
                <div className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image
                      src={campaign?.media}
                      alt="media thumbnail"
                      fill
                      loading="eager"
                      objectFit="cover"
                    />
                  </div>
                  <div className="px-1">
                    <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden">
                      {campaign?.title}
                    </h3>
                    <div className="w-full text-xs">
                      <Progress
                        firstProgress={
                          (Number(campaign?.current_amount) /
                            Number(campaign?.goal_amount)) *
                          100
                        }
                        firstTooltipContent={`Performance: ${(Number(campaign?.current_amount) / Number(campaign?.goal_amount)) * 100}%`}
                      />
                    </div>
                    <p className="flex justify-between items-center text-sm font-semibold mt-2">
                      {campaign?.current_amount}{' '}
                      <span className="font-normal">raised</span>
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
