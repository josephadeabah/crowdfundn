'use client';

import React, { useEffect, useState } from 'react';
import { useCategoryContext } from '@/app/context/categories/CategoryContext';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import Image from 'next/image';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import {
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaUser,
  FaHeart,
} from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import CampaignCardSkeleton from '@/app/loaders/CampaignCardSkeleton';
import Avatar from '../avatar/Avatar';

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

  const handleFavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Login Required',
        'Please log in to save campaigns to your favorites.',
        'error',
      );
      return;
    }
    await favoriteCampaign(campaignId);
  };

  const handleUnfavorite = async (campaignId: string) => {
    if (!user) {
      showToast(
        'Login Required',
        'Please log in to manage your favorite campaigns.',
        'error',
      );
      return;
    }
    await unfavoriteCampaign(campaignId);
  };

  if (loading)
    return (
      <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          You May Also Support
        </h2>
        <CampaignCardSkeleton />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 p-4 bg-white rounded-lg">
        Error loading campaigns
      </p>
    );

  if (!filteredCampaigns.length)
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <FaHeart className="text-gray-300 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No suggested campaigns available
          </h3>
          <p className="text-gray-500 mt-2">
            Check back later for new campaigns in this category
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
        You May Also Support
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredCampaigns
          .filter(
            (campaign) =>
              campaign.status !== 'completed' &&
              campaign.equity_status !== 'draft' &&
              campaign.equity_status !== 'pending_approval' &&
              campaign.equity_status !== 'failed' &&
              campaign.type === 'EquityCampaign' &&
              campaign.permissions.is_public,
          )
          .map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            const progressPercentage =
              (Number(campaign?.transferred_amount) /
                Number(campaign?.goal_amount)) *
              100;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white flex flex-col h-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <Link
                  href={`/campaign/${campaign.id}?${generateRandomString()}`}
                  className="flex flex-col h-full"
                >
                  <div className="relative w-full h-0 pb-[70%] overflow-hidden">
                    <Image
                      src={campaign?.media || '/bantuhive.svg'}
                      alt="Campaign image"
                      layout="fill"
                      objectFit="cover"
                      unoptimized
                      className="absolute top-0 left-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/bantuhive.svg';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <div
                        className="p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          campaign.favorited
                            ? handleUnfavorite(campaign.id.toString())
                            : handleFavorite(campaign.id.toString());
                        }}
                      >
                        {campaign.favorited ? (
                          <FaBookmark className="text-orange-500" />
                        ) : (
                          <FaRegBookmark className="text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center mb-3">
                      <Avatar
                        name={campaign?.fundraiser?.profile?.name}
                        size="sm"
                        imageUrl={campaign?.fundraiser?.profile?.avatar}
                      />
                      <span className="text-sm font-medium text-gray-700 ml-2 truncate">
                        {campaign?.fundraiser?.profile?.name}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 leading-tight group-hover:text-gray-600 transition-colors">
                      {campaign?.title}
                    </h3>

                    {/* Progress bar placed below the title */}
                    <div className="w-full mb-3">
                      <Progress
                        firstProgress={progressPercentage}
                        firstTooltipContent={`Progress: ${progressPercentage.toFixed(1)}%`}
                      />
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-gray-800">
                          <span className="text-xs text-gray-500 block">
                            Raised
                          </span>
                          {fundraiserCurrency}
                          {parseFloat(
                            campaign?.transferred_amount?.toString() || '0',
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <span className="text-xs text-gray-500 block">
                            Goal
                          </span>
                          {fundraiserCurrency}
                          {parseFloat(campaign.goal_amount).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1">
                          <FaUser className="text-gray-400" />
                          <span>{campaign?.total_donors || 0} Backers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock className="text-gray-400" />
                          <span>{campaign.remaining_days} days left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default SuggestedCampaignsComponent;
