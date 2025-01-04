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
import Pagination from '../pagination/Pagination'; // Import the Pagination component
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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
  onPageChange, // Receive onPageChange function
}) => {
  const { userProfile } = useUserContext();
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const { pagination, favoriteCampaign, unfavoriteCampaign } =
    useCampaignContext();
  const [page, setPage] = useState<number>(1);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    setPage(newPage);
  };

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

    // Fetch location only if userProfile doesn't have a country
    if (!userProfile?.country) {
      fetchUserLocation();
    } else {
      setUserCountry(userProfile.country);
      setIsLocationLoading(false);
    }
  }, [userProfile]);

  // Filter campaigns by the user's country and exclude campaigns with zero remaining days
  const filteredCampaigns = campaigns?.filter((campaign) => {
    return (
      campaign.location.toLowerCase() === userCountry?.toLowerCase() &&
      campaign.status !== 'completed' &&
      campaign.permissions.is_public
    );
  });

  const handleFavorite = async (campaignId: string) => {
    await favoriteCampaign(campaignId);
  };

  const handleUnfavorite = async (campaignId: string) => {
    await unfavoriteCampaign(campaignId);
  };

  if (loading || isLocationLoading) return <CampaignCardLoader />;
  if (error) return <ErrorPage />;

  return (
    <div className="bg-white p-1">
      {filteredCampaigns.length === 0 ? (
        <EmptyPage />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-2 md:p-0 relative">
          {filteredCampaigns?.map((campaign, index) => {
            const fundraiserCurrency =
              campaign?.currency_symbol || campaign?.currency?.toUpperCase();

            return (
              <motion.div
                key={campaign.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 flex flex-col h-full dark:text-gray-50 transform hover:shadow-lg transition-transform duration-300 cursor-pointer overflow-hidden"
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
                        src={campaign?.media || '/bantuhive.svg'}
                        alt="media thumbnail"
                        sizes="100vw"
                        layout="fill"
                        objectFit="cover"
                        className="absolute top-0 left-0 rounded-t"
                      />
                    </div>
                    <div className="px-1 py-2 dark:text-gray-50 flex flex-col gap-1">
                      <h3 className="text-lg font-bold truncate whitespace-nowrap overflow-hidden">
                        {campaign?.title}
                      </h3>
                      <div className="w-full text-xs text-orange-500 truncate">
                        {deslugify(campaign?.category)}
                      </div>
                      <div className="flex justify-between items-center w-full text-xs font-semibold text-gray-500">
                        <div className="truncate">
                          {campaign.total_donors || 0} Backers
                        </div>
                        <div className="truncate">
                          {campaign.remaining_days} days left
                        </div>
                      </div>
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
                  </div>
                </Link>
                {/* Bookmark Icon */}
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
      )}

      {/* Add Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage || page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CampaignCard;
