'use client';

import { useEffect, useState } from 'react';
import { useCategoryContext } from '@/app/context/categories/CategoryContext';
import { motion } from 'framer-motion';
import Progress from '@/app/components/progressbar/ProgressBar';
import Link from 'next/link';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import Image from 'next/image';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';

const SuggestedCampaignsComponent = () => {
  const { campaignsGroupedByCategory, fetchGroupedCampaigns, loading, error } =
    useCategoryContext();
  const { favoriteCampaign, unfavoriteCampaign } = useCampaignContext();
  const { user } = useAuth();
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  useEffect(() => {
    fetchGroupedCampaigns();
  }, [fetchGroupedCampaigns]);

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

  // Destructure campaigns directly
  const categories = Object.entries(campaignsGroupedByCategory);

  return (
    <div className="w-full bg-white md:p-4">
      {/* Handle error */}
      {error && (
        <p className="text-center text-red-500">
          Failed to load campaigns: {error}
        </p>
      )}

      {/* Handle loading state */}
      {loading ? (
        <p className="text-center">Loading campaigns...</p>
      ) : categories.length > 0 ? (
        // Render campaigns grouped by category
        categories.map(([category, { campaigns }], index) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
              {campaigns.map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
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
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">
          No campaigns found. Try adjusting your filters or search terms.
        </p>
      )}

      {/* Toast notifications */}
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
