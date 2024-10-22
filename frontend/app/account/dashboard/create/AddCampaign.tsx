'use client';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Switch } from '@headlessui/react';
import { Button } from '@/app/components/button/Button';
import { useDropzone } from 'react-dropzone';
import Modal from '@/app/components/modal/Modal';
import CampaignPermissionSetting from '@/app/account/dashboard/create/settings/PermissionSettings';
import { FaEdit } from 'react-icons/fa';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { CampaignDataType } from '@/app/types/campaigns.types';
import { useUserContext } from '@/app/context/users/UserContext';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const CreateCampaign = () => {
  const { userProfile } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { addCampaign } = useCampaignContext();

  // Define permissions structure
  const initialPermissions = {
    acceptDonations: false,
    leaveWordsOfSupport: false,
    appearInSearchResults: false,
    suggestedFundraiserLists: false,
    receiveDonationEmail: false,
    receiveDailySummary: false,
  };

  // State for permissions and promotion settings
  const [permissions, setPermissions] = useState(initialPermissions);

  const [promotionSettings, setPromotionSettings] = useState({
    enablePromotions: false,
    schedulePromotion: false,
    promotionFrequency: 'daily',
    promotionDuration: 1,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setError(null);
  };

  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    if (!title.trim()) formErrors.title = 'Title is required';
    if (!content.trim()) formErrors.content = 'Content is required';
    if (!selectedImage) formErrors.image = 'Image is required';
    return Object.keys(formErrors).length === 0;
  };

  useEffect(() => {
    if (userProfile) {
      setCategory(userProfile.category);
      setLocation(userProfile.country);
      setGoalAmount(userProfile.target_amount);
      setCurrency(userProfile.currency);
    }
  }, [userProfile]);

  const handleSubmit = () => {
    if (validateForm()) {
      const campaign: CampaignDataType = {
        title,
        description: content,
        goal_amount: goalAmount,
        current_amount: '0',
        start_date: startDate,
        end_date: endDate,
        category,
        location,
        currency,
        is_public: isPublic,
        accept_donations: permissions.acceptDonations,
        leave_words_of_support: permissions.leaveWordsOfSupport,
        appear_in_search_results: permissions.appearInSearchResults,
        suggested_fundraiser_lists: permissions.suggestedFundraiserLists,
        receive_donation_email: permissions.receiveDonationEmail,
        receive_daily_summary: permissions.receiveDailySummary,
        enable_promotions: promotionSettings.enablePromotions,
        schedule_promotion: promotionSettings.schedulePromotion,
        promotion_frequency: promotionSettings.promotionFrequency,
        promotion_duration: promotionSettings.promotionDuration.toString(),
        media: selectedImage || undefined,
      };

      addCampaign(campaign);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setContent('');
    setIsPublic(false);
    setPermissions(initialPermissions);
    setPromotionSettings({
      enablePromotions: false,
      schedulePromotion: false,
      promotionFrequency: 'daily',
      promotionDuration: 1,
    });
    setSelectedImage(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed flex items-center gap-2 bottom-4 right-4 bg-red-500 text-white p-2 z-50 rounded-full shadow-lg hover:scale-105 transition-transform duration-300  hover:bg-red-600"
      >
        Create Your Story
        <FaEdit />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        size="xxxlarge"
        closeOnBackdropClick={false}
      >
        <div className="overflow-y-auto max-h-[80vh] p-2 [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          {' '}
          {/* Add this wrapper */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Create a New Campaign</h2>
            <div className="mb-4">
              <label htmlFor="campaign-title" className="block text-sm mb-1">
                Title:
              </label>
              <input
                id="campaign-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white "
              />
            </div>

            {/* New input fields */}
            <div className="mb-4">
              <label htmlFor="goal-amount" className="block text-sm mb-1">
                Goal Amount:
              </label>
              <input
                id="goal-amount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="start-date" className="block text-sm mb-1">
                Start Date:
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="end-date" className="block text-sm mb-1">
                End Date:
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm mb-1">
                Category:
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block text-sm mb-1">
                Location:
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="currency" className="block text-sm mb-1">
                Currency:
              </label>
              <input
                id="currency"
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="campaign-content" className="block text-sm mb-1">
                Content:
              </label>
              <RichTextEditor
                id="campaign-content"
                value={content}
                onChange={setContent}
                placeholder="Write your campaign content here..."
              />
            </div>

            <div className="mb-4">
              <label htmlFor="campaign-image" className="block text-sm mb-1">
                Image:
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-4 rounded ${isDragActive ? 'border-gray-400' : 'border-gray-300'}`}
              >
                <input id="campaign-image" {...getInputProps()} />
                {selectedImage ? (
                  <div className="flex justify-between items-center">
                    <span>{selectedImage.name}</span>
                    <button
                      onClick={handleRemoveImage}
                      className="text-red-500"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Public Switch */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">{isPublic ? 'Public' : 'Private'}</span>
              <Switch
                checked={isPublic}
                onChange={setIsPublic}
                className={`${isPublic ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
              >
                <span
                  className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            {/* Dropdown for Campaign Permissions and Promotion Settings */}
            <div className="mb-4">
              <button
                onClick={() => setSettingsOpen((prev) => !prev)}
                className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-lg text-left focus:outline-none"
              >
                <span className="text-lg font-semibold">Campaign Settings</span>
                {settingsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {settingsOpen && (
                <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                  <CampaignPermissionSetting
                    permissions={permissions as { [key: string]: boolean }}
                    setPermissions={
                      setPermissions as React.Dispatch<
                        React.SetStateAction<{ [key: string]: boolean }>
                      >
                    }
                    promotionSettings={promotionSettings}
                    setPromotionSettings={setPromotionSettings}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSubmit}>
                Publish Campaign
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateCampaign;
