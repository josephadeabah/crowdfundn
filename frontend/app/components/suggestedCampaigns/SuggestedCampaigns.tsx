'use client';

import React, { useEffect, useState } from 'react';
import { useCategoryContext } from '@/app/context/categories/CategoryContext';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import Image from 'next/image';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { deslugify } from '@/app/utils/helpers/categories';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';

const SuggestedCampaignsComponent = ({
  currentCategory,
}: {
  currentCategory: string | undefined;
}) => {
  const { user } = useAuth();
  const { campaignsGroupedByCategory, fetchGroupedCampaigns, loading, error } =
    useCategoryContext();
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignResponseDataType[]
  >([]);

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

  // Handle favorite/unfavorite action
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

  if (loading)
    return (
      <div className="w-full max-w-7xl mx-auto mb-8">
        <CampaignCardLoader />
      </div>
    );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!filteredCampaigns.length)
    return (
      <p className="text-center text-gray-500">
        No suggested campaigns available.
      </p>
    );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white md:p-4 mb-8 rounded-lg shadow">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        You May Also Support
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {filteredCampaigns
          .filter((campaign) => campaign.permissions.is_public)
          .map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            return (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 rounded-lg transform hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer overflow-hidden"
              >
                <Link
                  href={`/campaign/${campaign.id}?${generateRandomString()}`}
                >
                  <div className="relative w-full h-0 pb-[100%]">
                    <Image
                      src={campaign?.media || '/bantuhive.svg'}
                      alt="media thumbnail"
                      layout="fill"
                      objectFit="cover"
                      className="absolute top-0 left-0 w-full h-full rounded-t"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold text-white truncate mb-1">
                        {campaign?.title}
                      </h3>
                      <div className="text-sm text-orange-400 truncate mb-1">
                        {deslugify(campaign?.category)}
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-300 mb-2">
                        <span>{campaign.total_donors || 0} Backers</span>
                        <span>{campaign.remaining_days} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className="w-full text-xs">
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
                    </div>
                    <div className="w-full text-xs text-gray-600 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-700 truncate mb-1">
                        {campaign?.title}
                      </h3>
                      <p className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                        {fundraiserCurrency}
                        {!isNaN(parseFloat(campaign.transferred_amount))
                          ? parseFloat(
                              campaign.transferred_amount,
                            ).toLocaleString()
                          : 0}
                        <span className="text-gray-600 dark:text-gray-100 truncate">
                          <span className="text-xs p-1">of</span>
                          {fundraiserCurrency}
                          {parseFloat(campaign.goal_amount).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Favorite/Unfavorite Icon */}
                <div
                  className="absolute top-2 right-2 p-2 bg-transparent rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    campaign.favorited
                      ? handleUnfavorite(campaign.id.toString())
                      : handleFavorite(campaign.id.toString());
                  }}
                >
                  {campaign.favorited ? (
                    <FaBookmark className="text-orange-500" />
                  ) : (
                    <FaRegBookmark className="text-gray-50" />
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default SuggestedCampaignsComponent;
