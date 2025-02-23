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
import { FaBookmark, FaRegBookmark, FaClock, FaUser } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';
import Avatar from '../avatar/Avatar';

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
  const { pagination, favoriteCampaign, unfavoriteCampaign, fetchAllCampaigns } =
    useCampaignContext();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [location, setLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>('');
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
    fetchAllCampaigns(
      sortBy,
      sortOrder,
      page,
      pageSize,
      dateRange,
      goalRange,
      location,
      searchTerm,
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
    searchTerm,
  ]);

  // Commenting out the location fetching logic
  /*
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const data = await ipResponse.json();
        setUserCountry(data.country_name);
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLocationLoading(false);
      }
    };

    if (!userAccountData?.country) {
      fetchUserLocation();
    } else {
      setUserCountry(userAccountData.country);
      setIsLocationLoading(false);
    }
  }, [userAccountData]);
  */

  // Commenting out the filteredCampaigns logic
  /*
  const filteredCampaigns = campaigns?.filter((campaign) => {
    return (
      campaign.location.toLowerCase() === userCountry?.toLowerCase() &&
      campaign.status !== 'completed' &&
      campaign.permissions.is_public
    );
  });
  */

  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const displayedCampaigns = campaigns?.filter((campaign) => {
    return campaign.status !== 'completed' && campaign.permissions.is_public;
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

  if (loading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full max-w-7xl mx-auto p-1 bg-white rounded-lg">
          <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-4xl font-bold mb-8 mt-4 text-center">
                        Fundraising Now
                      </h3>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={handleLocationChange}
              className="p-2 border border-gray-50 rounded-full focus:outline-none w-full"
            >
              <option value="all">Happening worldwide</option>
              <option value="Nigeria">Happening in Nigeria</option>
              <option value="Kenya">Happening in Kenya</option>
              <option value="Ghana">Happening in Ghana</option>
              <option value="South Africa">Happening in South Africa</option>
              <option value="Eswatini">Happening in Eswatini</option>
            </select>
          </div>
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
                className={`group relative bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 hover:shadow-lg transition-transform duration-300 cursor-pointer overflow-hidden rounded-lg ${
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
                  <div className="px-4 py-3 h-full bg-gray-50 dark:bg-gray-800">
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
                          <span className="text-sm font-semibold w-14 md:w-44 truncate">
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
                        className={`text-lg font-bold text-gray-700 dark:text-gray-100 mb-1 ${index === 0 ? '' : 'truncate'}`}
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
                      <div className={`${index === 0 ? 'flex justify-between items-center': 'block md:flex justify-between items-center'}  text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2`}>
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
