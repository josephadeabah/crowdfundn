import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import EmptyPage from '../emptypage/EmptyPage';
import { generateRandomString } from '../../utils/helpers/generate.random-string';

type CampaignCardProps = {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
};

// Fisher-Yates shuffle algorithm to randomize the array
const shuffleArray = (array: CampaignResponseDataType[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaigns,
  loading,
  error,
}) => {
  if (loading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  // Memoize the shuffled campaigns to avoid re-shuffling on each render
  const shuffledCampaigns = useMemo(() => shuffleArray(campaigns), [campaigns]);

  // Slice the first 6 campaigns after shuffling
  const displayedCampaigns = shuffledCampaigns.slice(0, 6);

  return (
    <div>
      {campaigns.length === 0 ? (
        <EmptyPage />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-2 md:p-0">
          {displayedCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Link href={`/campaign/${campaign.id}?${generateRandomString()}`}>
                <div className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <img
                    src={campaign?.media}
                    alt="media thumbnail"
                    className="mb-2 object-cover h-32 w-full"
                  />
                  <div className="px-1">
                    <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden">
                      {campaign?.title}
                    </h3>
                    <div className="w-full text-xs">
                      <Progress
                        firstProgress={33}
                        firstTooltipContent={`Performance: ${33}%`}
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
