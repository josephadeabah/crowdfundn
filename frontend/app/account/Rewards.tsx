import React, { useState, useEffect } from 'react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import Modal from '../components/modal/Modal';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useRewardContext } from '@/app/context/account/rewards/RewardsContext';
import { CampaignResponseDataType } from '../types/campaigns.types';
import RewardCard from '@/app/components/rewardcard/RewardCard';
import RewardsLoader from '../loaders/RewardsLoader';
import AlertPopup from '../components/alertpopup/AlertPopup';
import { truncateTitle } from '../utils/helpers/truncate.title';
import { usePointRewardContext } from '../context/pointreward/PointRewardContext';
import ProgressRing from '../components/ring/ProgressRing';
import Link from 'next/link';
import { getRankWithSuffix } from '../utils/helpers/ranking.suffix';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { getCupIcon } from '../utils/helpers/get.level.trophy';

interface FormData {
  title: string;
  description: string;
  amount: string;
  image: File | null;
}

interface Errors {
  title?: string;
  description?: string;
  amount?: string;
  image?: string;
  campaignId?: string;
  submit?: string;
}

const RewardsPage: React.FC = () => {
  const { campaigns, fetchCampaigns, loading } = useCampaignContext();
  const {
    addReward,
    deleteReward,
    error: contextError,
    loading: loadingReward,
  } = useRewardContext();

  const {
    userRank,
    rewards,
    userReward,
    userPoints,
    fundraiserLeaderboardRank,
    fetchFundraiserRank,
    fetchUserRank,
    fetchRewards,
    fetchUserReward,
    fetchUserPoints,
  } = usePointRewardContext();

  useEffect(() => {
    fetchUserRank();
    fetchRewards();
    fetchUserReward();
    fetchUserPoints();
    fetchFundraiserRank();
  }, [
    fetchUserRank,
    fetchRewards,
    fetchUserReward,
    fetchUserPoints,
    fetchFundraiserRank,
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    amount: '',
    image: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [rewardToDelete, setRewardToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!selectedCampaignId) newErrors.campaignId = 'Campaign is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const newReward = new FormData();
      newReward.append('reward[title]', formData.title);
      newReward.append('reward[description]', formData.description);
      newReward.append('reward[amount]', formData.amount);
      if (formData.image) newReward.append('reward[image]', formData.image);

      const createdReward = await addReward(selectedCampaignId!, newReward);

      if (!createdReward) {
        setErrors({ ...errors, submit: contextError || 'Error adding reward' });
        return;
      }

      setFormData({ title: '', description: '', amount: '', image: null });
      setPreviewImage(null);
      setShowModal(false);
      setSelectedCampaignId(null);

      fetchCampaigns();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof Errors]) {
      setErrors({ ...errors, [name as keyof Errors]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    if (errors.image) {
      setErrors({ ...errors, image: '' });
    }
  };

  const handleDeleteReward = (campaignId: string, rewardId: number) => {
    setRewardToDelete(rewardId);
    setSelectedCampaignId(campaignId); // Set the selected campaign ID here
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (rewardToDelete !== null) {
      await deleteReward(selectedCampaignId!, rewardToDelete.toString());
      setShowDeletePopup(false);
      setRewardToDelete(null);
      fetchCampaigns();
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setRewardToDelete(null);
  };

  const getBackerCertWithLevel = (level?: string) => {
    const levels = ['Bronze', 'Silver', 'Gold', 'Diamond'];

    const handleDownloadCertificate = (rewardLevel: string) => {
      console.log(`Downloading ${rewardLevel} certificate...`);
    };

    if (!level) {
      return (
        <div className="text-center p-4 bg-gray-100 rounded-lg col-span-full">
          Your special certificate of honor will be available here to download
          or share once you reach a reward level.
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center w-full">
        {levels.includes(level) ? (
          <div className="p-2 rounded-lg text-center w-full">
            <div className="relative p-2 rounded-lg w-full h-8 bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-semibold">{level} Certificate</span>
              <FiDownload
                className="absolute top-1 right-2 text-gray-700 cursor-pointer"
                size={20}
                onClick={() => handleDownloadCertificate(level)}
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-200 rounded-lg w-full">
            Your special certificate of honor will be available here to download
            or share once you reach a reward level.
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="px-2 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Rewards & Gifts
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Add new reward"
            >
              <FiPlus className="mr-2" /> Add Gift
            </button>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            Give and Receive Rewards and Gifts
          </div>
          {/* User Rewards & Rank Summary Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Your Performance Progress Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {/* Backing User Rank */}
              {userRank && userRank.rank ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Backer Rank
                  </p>
                  <p className="text-4xl font-extrabold text-green-600">
                    {getRankWithSuffix(userRank.rank)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Backer Rank
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have no rank yet
                  </p>
                </div>
              )}

              {/* Fundraiser User Rank */}
              {fundraiserLeaderboardRank && fundraiserLeaderboardRank.rank ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Fundraiser Rank
                  </p>
                  <p className="text-4xl font-extrabold text-green-600">
                    {getRankWithSuffix(fundraiserLeaderboardRank.rank)}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Fundraiser Rank
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have no rank yet
                  </p>
                </div>
              )}

              {/* Total Points */}
              {userPoints ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Percentage Progress
                  </p>
                  <ProgressRing
                    value={Math.round(userPoints.total_points)}
                    size={80}
                    strokeWidth={7}
                    color="#22c55e"
                  />
                </div>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Percentage Progress
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No progress data available
                  </p>
                </div>
              )}

              {userRank && userRank?.total_donations ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Amount Donated
                  </p>
                  <p className="text-xl font-extrabold text-green-600">
                    {userRank?.currency?.toUpperCase()}{' '}
                    {Number(userRank?.total_donations || 0).toFixed(2) || 'N/A'}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Amount Donated
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have not made any impact yet.
                  </p>
                </div>
              )}

              {/* Next Reward */}
              {userReward && userReward.level ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Level
                  </p>
                  <p className="text-xl font-semibold text-orange-500">
                    {userReward.level}
                  </p>
                  <p className="w-full flex justify-center items-center">
                    {getCupIcon(userReward.level)}
                  </p>
                  <div className="font-semibold flex items-center justify-center">
                    <FaInfoCircle
                      data-tooltip-id="tooltip-average-logins"
                      data-tooltip-content="Bantu Hive Credit. This coins will be converted to real money and add to your withdrawal when you start new campaign. BHC100 equals GHS₵10"
                      className="text-gray-400 text-sm cursor-pointer mr-2"
                    />
                    <Tooltip
                      id="tooltip-average-logins"
                      className="max-w-xs text-gray-600 dark:text-gray-400 text-sm p-2 rounded z-10"
                    />
                    <p className="text-sm font-semibold text-gray-400">
                      {userReward.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    Level
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You haven't won rewards yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Unlock Your Reward Section */}
          <div className="bg-white col-span-full p-4 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center justify-center">
                <FaInfoCircle
                  data-tooltip-id="tooltip-certificate-reveal"
                  data-tooltip-content="This is a special certificate of Honor prepared and given to you by Bantu Hive for the great impact you're making in the world. The highest Level reward (Diamond) comes with $1000 and other perks which will be given to you by Bantu Hive. Actively sharing campaigns (10%) and making donations (90%) count towards this reward."
                  className="text-gray-400 text-sm cursor-pointer mr-2"
                />
                <Tooltip
                  id="tooltip-certificate-reveal"
                  className="max-w-xs text-gray-600 dark:text-gray-400 text-sm p-2 rounded z-10"
                />
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Your Certificate of Honor
                </h2>
              </div>
              <Link
                href="/leaderboard/backers#leaderboard-info"
                className="text-lg font-medium text-cyan-600 dark:text-blue-400 hover:underline"
              >
                Learn More →
              </Link>
            </div>
            {getBackerCertWithLevel(userReward?.level)}
          </div>

          {loading ? (
            <RewardsLoader />
          ) : (
            <>
              {campaigns.every((campaign) => campaign.rewards.length === 0) ? (
                <p className="text-gray-500 text-sm">
                  The Gifts You create will appear here!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {campaigns.map((campaign) =>
                    campaign.rewards.map((reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        campaignId={String(campaign.id)}
                        onDelete={handleDeleteReward}
                      />
                    )),
                  )}
                </div>
              )}
            </>
          )}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            size="xlarge"
            closeOnBackdropClick={false}
          >
            <div className="overflow-y-auto max-h-[60vh] p-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Add New Gift
              </h2>
              <p className="text-gray-500 text-sm">
                Create low-priced items or gifts to reward backers who donate as
                specified.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="campaignId"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Select Campaign
                  </label>
                  <select
                    id="campaignId"
                    name="campaignId"
                    value={selectedCampaignId || ''}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.campaignId ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                    aria-invalid={errors.campaignId ? 'true' : 'false'}
                  >
                    <option value="" disabled>
                      Select a campaign
                    </option>
                    {campaigns.map((campaign: CampaignResponseDataType) => (
                      <option key={campaign.id} value={campaign.id}>
                        {truncateTitle(campaign.title, 60)}
                      </option>
                    ))}
                  </select>
                  {errors.campaignId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.campaignId}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                    aria-invalid={errors.title ? 'true' : 'false'}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                    aria-invalid={errors.description ? 'true' : 'false'}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                    aria-invalid={errors.amount ? 'true' : 'false'}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.image ? 'border-red-500' : 'border-gray-300'} dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200`}
                    aria-invalid={errors.image ? 'true' : 'false'}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 h-32 w-32 object-cover rounded-lg"
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${loadingReward ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  disabled={loadingReward}
                >
                  {loadingReward ? 'Adding...' : 'Add Gift'}
                </button>
              </form>
            </div>
          </Modal>
        </div>
      </div>
      <AlertPopup
        title="Confirm Deletion"
        message="Are you sure you want to delete this gift? This action cannot be undone."
        isOpen={showDeletePopup}
        setIsOpen={setShowDeletePopup}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default RewardsPage;
