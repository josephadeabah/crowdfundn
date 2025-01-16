'use client';

import React, { useEffect, useState } from 'react';
import { useCategoryContext } from '@/app/context/categories/CategoryContext';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import Image from 'next/image';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

const SuggestedCampaignsComponent = ({
  currentCategory,
}: {
  currentCategory: string | undefined;
}) => {
  const { campaignsGroupedByCategory, fetchGroupedCampaigns, loading, error } =
    useCategoryContext();
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);

  useEffect(() => {
    fetchGroupedCampaigns();
  }, [fetchGroupedCampaigns]);

  useEffect(() => {
    if (campaignsGroupedByCategory && currentCategory) {
      const campaigns =
        campaignsGroupedByCategory[currentCategory]?.campaigns || [];
      setFilteredCampaigns(campaigns);
    }
  }, [campaignsGroupedByCategory, currentCategory]);

  if (loading) return <p className="text-center">Loading campaigns...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!filteredCampaigns.length)
    return (
      <p className="text-center text-gray-500">
        No suggested campaigns available.
      </p>
    );

  return (
    <div className="w-full bg-white md:p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {filteredCampaigns.map((campaign, idx) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/campaign/${campaign.id}?${generateRandomString()}`}>
              <div>
                <div
                  className="relative w-full"
                  style={{ paddingTop: '56.25%' }}
                >
                  <Image
                    src={campaign?.media || '/bantuhive.svg'}
                    alt="media thumbnail"
                    fill
                    className="absolute top-0 left-0 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {campaign?.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{campaign.total_donors || 0} Backers</span>
                    <span>{campaign.remaining_days} days left</span>
                  </div>
                  <Progress
                    firstProgress={
                      (Number(campaign?.transferred_amount) /
                        Number(campaign?.goal_amount)) *
                      100
                    }
                    firstTooltipContent={`Progress: ${
                      (Number(campaign?.transferred_amount) /
                        Number(campaign?.goal_amount)) *
                      100
                    }%`}
                  />
                  <div className="text-sm text-gray-600 mt-2">
                    {campaign.currency_symbol}
                    {parseFloat(
                      campaign.transferred_amount,
                    ).toLocaleString()}{' '}
                    of {campaign.currency_symbol}
                    {parseFloat(campaign.goal_amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCampaignsComponent;
