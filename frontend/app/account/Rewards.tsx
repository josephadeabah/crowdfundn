import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '../components/modal/Modal';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useRewardContext } from '@/app/context/account/rewards/RewardsContext';
import { CampaignResponseDataType } from '../types/campaigns.types';
import RewardCard from '@/app/components/rewardcard/RewardCard';
import RewardsLoader from '../loaders/RewardsLoader';
import AlertPopup from '../components/alertpopup/AlertPopup';
import { truncateTitle } from '../utils/helpers/truncate.title';

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

  return (
    <>
      <div className="min-h-screen px-2 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Rewards
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Add new reward"
            >
              <FiPlus className="mr-2" /> Add Reward
            </button>
          </div>
          {loading ? (
            <RewardsLoader />
          ) : (
            <>
              {campaigns.every((campaign) => campaign.rewards.length === 0) ? (
                <p className="text-gray-500 text-sm">
                  You have not created any rewards yet!. Use this page to create
                  items that you can give to your backers who donate the amount
                  you specify in your items. The reward could be in cash,
                  material or kind.
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
                Add New Reward
              </h2>
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
                  {loadingReward ? 'Adding...' : 'Add Reward'}
                </button>
              </form>
            </div>
          </Modal>
        </div>
      </div>
      <AlertPopup
        title="Confirm Deletion"
        message="Are you sure you want to delete this reward? This action cannot be undone."
        isOpen={showDeletePopup}
        setIsOpen={setShowDeletePopup}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default RewardsPage;
