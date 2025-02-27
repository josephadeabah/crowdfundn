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
import { deslugify } from '@/app/utils/helpers/categories';
import { useUserContext } from '@/app/context/users/UserContext';
import Pagination from '../pagination/Pagination';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import {
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaUser,
  FaFilter,
} from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import Avatar from '../avatar/Avatar';
import AnimatedDrawer from '../drawer/Drawer';
import { Button } from '../button/Button';
import SelectComponent from '../select/SearchableSelect ';
import DrawerContent from './DrawerContent';
import { debounce } from 'lodash'; // Import debounce from lodash

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
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
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
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // New state for debounced search term
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [openDrawer, setOpenDrawer] = useState(false); // State for drawer

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

  // Debounce the search term update
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 4000); // 800ms delay (adjust as needed)

    return () => clearTimeout(debounceTimer); // Cleanup timer on unmount or searchTerm change
  }, [searchTerm]);

  // Fetch campaigns when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      fetchAllCampaigns(
        sortBy,
        sortOrder,
        page,
        pageSize,
        dateRange,
        goalRange,
        location,
        debouncedSearchTerm, // Use debounced search term here
      );
    }
  }, [
    fetchAllCampaigns,
    sortBy,
    sortOrder,
    page,
    pageSize,
    dateRange,
    goalRange,
    location,
    debouncedSearchTerm, // Add debouncedSearchTerm to dependency array
  ]);

  // Update handlers to work with string values
  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const handleGoalRangeChange = (value: string) => {
    setGoalRange(value);
  };

  const displayedCampaigns = campaigns?.filter((campaign) => {
    return (
      campaign.status !== 'completed' &&
      campaign.permissions.is_public &&
      campaign.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) // Apply search filtering here
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

  const handleSearch = (value: string) => {
    setSearchTerm(value); // Update the search term immediately
  };

  if (loading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg">
      <div className="flex justify-center items-center gap-2 mb-8">
        <h3 className="text-3xl font-bold text-center">Fundraising Now</h3>
        <Button
          className="p-3 flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          onClick={() => setOpenDrawer(true)}
        >
          <FaFilter />
          Filter
        </Button>
      </div>

      {/* Drawer for Filters */}
      <AnimatedDrawer
        isOpen={openDrawer}
        onClose={() => setOpenDrawer(false)}
        position="bottom"
        width="100%"
        height="400px"
        backgroundColor="bg-white"
        zIndex="z-50"
      >
        <DrawerContent
          campaigns={displayedCampaigns}
          onSearch={handleSearch}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
          onDateRangeChange={handleDateRangeChange}
          onGoalRangeChange={handleGoalRangeChange}
          onLocationChange={handleLocationChange}
        />
      </AnimatedDrawer>

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCampaigns.slice(0, 5).map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            let colSpan = 1;
            let rowSpan = 1;
            if (index === 0) {
              colSpan = 2;
              rowSpan = 2;
            } else if (index === 4 || index === 5 || index === 6) {
              colSpan = 1;
              rowSpan = 1;
            }

            return (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 cursor-pointer overflow-hidden rounded-lg ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                } ${index === 4 || index === 5 || index === 6 ? 'col-span-1' : ''}`}
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
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                  <div className="px-4 py-3 h-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800">
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
                    {/*Detailed Section*/}
                    <div className="w-full text-xs text-gray-600 dark:text-gray-300 py-2 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar
                            name={campaign?.fundraiser?.profile?.name}
                            size="sm"
                            imageUrl={campaign?.fundraiser?.profile?.avatar}
                          />
                          <span
                            className={`text-sm font-semibold ${index === 0 ? '' : 'w-14 md:w-44'} truncate`}
                          >
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
                      <h3
                        className={`font-bold text-gray-700 dark:text-gray-100 mb-1 ${index === 0 ? 'text-4xl' : 'truncate text-lg'}`}
                      >
                        {campaign?.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
                        <span
                          className={`${
                            parseFloat(
                              campaign?.transferred_amount?.toString() || '0',
                            ) >=
                            parseFloat(campaign?.goal_amount?.toString() || '0')
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
                      <div
                        className={`${index === 0 ? 'flex justify-between items-center' : 'block md:flex justify-between items-center'}  text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2`}
                      >
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
