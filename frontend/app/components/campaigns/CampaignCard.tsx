'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import ErrorPage from '../errorpage/ErrorPage';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';
import EmptyPage from '../emptypage/EmptyPage';
import { generateRandomString } from '../../utils/helpers/generate.random-string';
import Image from 'next/image';
import { useUserContext } from '@/app/context/users/UserContext';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { FaBookmark, FaRegBookmark, FaClock, FaUser } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import Avatar from '../avatar/Avatar';
import CarouselComponent from '@/app/components/carousel/CarouselComponent';

type CampaignCardProps = {
  campaigns: CampaignResponseDataType[];
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaigns,
  loading,
  error,
  onPageChange,
}) => {
  const { userAccountData } = useUserContext();
  const {
    pagination,
    favoriteCampaign,
    unfavoriteCampaign,
    fetchAllCampaigns,
  } = useCampaignContext();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [location, setLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageSize, setPageSize] = useState<number>(20);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');

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

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    setPage(newPage);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      debouncedSearchTerm,
    );
  }, [
    fetchAllCampaigns,
    sortBy,
    sortOrder,
    page,
    pageSize,
    dateRange,
    goalRange,
    location,
    debouncedSearchTerm,
  ]);

  const displayedCampaigns = campaigns?.filter((campaign) => {
    return (
      campaign.status !== 'completed' &&
      campaign.permissions.is_public &&
      campaign.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  });

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
      <div className="px-2">
        <CampaignCardLoader />
      </div>
    );
  if (error) return <ErrorPage />;

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {displayedCampaigns.length === 0 ? (
        <EmptyPage />
      ) : (
        <CarouselComponent title="Fundraising Now" slidesToShow={3}>
          {displayedCampaigns.map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            return (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative dark:bg-gray-900 px-3 py-3 h-full dark:text-gray-50 cursor-pointer overflow-hidden rounded-lg"
              >
                <Link
                  href={`/campaign/${campaign.id}?${generateRandomString()}`}
                >
                  <div className="grid grid-cols-2 h-full">
                    {/* Image on the left */}
                    <div className="relative w-full h-full">
                      <Image
                        src={campaign?.media || '/bantuhive.svg'}
                        alt="media thumbnail"
                        layout="fill"
                        objectFit="cover"
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    </div>

                    {/* Details on the right */}
                    <div className="px-4 py-3 h-full bg-gray-50 hover:bg-white dark:bg-gray-800 flex flex-col justify-between">
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
                      <div className="w-full text-xs text-gray-600 dark:text-gray-300 py-2 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar
                              name={campaign?.fundraiser?.profile?.name}
                              size="sm"
                              imageUrl={campaign?.fundraiser?.profile?.avatar}
                            />
                            <span className="w-20 text-sm font-semibold truncate">
                              {campaign?.fundraiser?.profile?.name}
                            </span>
                          </div>
                          <div
                            className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              campaign.favorited
                                ? handleUnfavorite(campaign.id.toString())
                                : handleFavorite(campaign.id.toString());
                            }}
                          >
                            {campaign.favorited ? (
                              <FaBookmark className="text-orange-500" />
                            ) : (
                              <FaRegBookmark className="text-gray-700 dark:text-gray-300" />
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-100 mb-1 truncate text-lg">
                          {campaign?.title}
                        </h3>
                        <div className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                          <span
                            className={`${
                              parseFloat(
                                campaign?.transferred_amount?.toString() || '0',
                              ) >=
                              parseFloat(
                                campaign?.goal_amount?.toString() || '0',
                              )
                                ? 'text-green-600'
                                : 'text-orange-500'
                            }`}
                          >
                            <span className="text-gray-600 dark:text-gray-100 mr-1">
                              {fundraiserCurrency}
                            </span>
                            {parseFloat(
                              campaign?.transferred_amount?.toString() || '0',
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
      )}
    </div>
  );
};

export default CampaignCard;
