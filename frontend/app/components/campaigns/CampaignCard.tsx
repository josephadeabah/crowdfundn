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
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '../toast/Toast';

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
  const { pagination, favoriteCampaign, unfavoriteCampaign } =
    useCampaignContext();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);

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

  // Temporarily display all campaigns
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

  // if (loading || isLocationLoading) return <CampaignCardLoader />;
  if (loading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  return (
    <div className="w-full max-w-7xl mx-auto p-2 bg-white rounded-lg">
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
                className={`group relative bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 hover:shadow-2xl transition-transform duration-300 cursor-pointer overflow-hidden rounded-lg ${
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
                    <div className="w-full text-xs text-gray-600 dark:text-gray-300 flex flex-col">
                      <h3
                        className={`text-lg font-bold text-gray-700 dark:text-gray-100 mb-1 ${index === 0 ? '' : 'truncate'}`}
                      >
                        {campaign?.title}
                      </h3>
                      <p className="flex justify-between items-center text-sm font-semibold mt-2 break-words">
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
                      </p>
                    </div>
                  </div>
                </Link>
                <div
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
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
                    <FaRegBookmark className="text-gray-700 dark:text-gray-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
