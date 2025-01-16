'use client';

import { useEffect, useState } from 'react';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import CampaignCardLoader from '@/app/loaders/CampaignCardLoader';
import { useUserContext } from '@/app/context/users/UserContext';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { deslugify } from '@/app/utils/helpers/categories';
import Image from 'next/image';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';

const SuggestedCampaignsComponent = () => {
  const {
    fetchAllCampaigns,
    campaigns,
    loading,
    favoriteCampaign,
    unfavoriteCampaign,
  } = useCampaignContext();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all_time');
  const [goalRange, setGoalRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const { pagination } = useCampaignContext();

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

  return (
    <div className="w-full bg-white md:p-4">
      {loading ? (
        <CampaignCardLoader />
      ) : (
        <>
          {campaigns && campaigns.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
              {campaigns
                .filter((campaign) => campaign.permissions.is_public)
                .map((campaign, index) => {
                  const fundraiserCurrency =
                    campaign?.currency_symbol ||
                    campaign?.currency?.toUpperCase();

                  return (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <Link
                        href={`/campaign/${campaign.id}?${generateRandomString()}`}
                      >
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
                            <div className="text-sm text-gray-500">
                              {deslugify(campaign?.category)}
                            </div>
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
                              {fundraiserCurrency}
                              {parseFloat(
                                campaign.transferred_amount,
                              ).toLocaleString()}{' '}
                              of {fundraiserCurrency}
                              {parseFloat(
                                campaign.goal_amount,
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100"
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
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No campaigns found. Try adjusting your filters or search terms.
            </p>
          )}
        </>
      )}
      {toast.isOpen && (
        <ToastComponent
          isOpen={toast.isOpen}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
      )}
    </div>
  );
};

export default SuggestedCampaignsComponent;
