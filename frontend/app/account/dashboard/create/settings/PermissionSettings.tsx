'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Button } from '@/app/components/button/Button';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import ToastComponent from '@/app/components/toast/Toast';

interface CampaignPermissionSettingProps {
  campaignId: string; // Add campaignId to props
}

interface Permissions {
  accept_donations: boolean;
  leave_words_of_support: boolean;
  appear_in_search_results: boolean;
  suggested_fundraiser_lists: boolean;
  receive_donation_email: boolean;
  receive_daily_summary: boolean;
  is_public: boolean;
}

const CampaignPermissionSetting: React.FC<CampaignPermissionSettingProps> = ({
  campaignId,
}) => {
  const {
    updateCampaignSettings,
    fetchCampaignById,
    fetchCampaigns,
    currentCampaign,
    loading,
  } = useCampaignContext();

  const [permissions, setPermissions] = useState<Permissions>({
    accept_donations: false,
    leave_words_of_support: false,
    appear_in_search_results: false,
    suggested_fundraiser_lists: false,
    receive_donation_email: false,
    receive_daily_summary: false,
    is_public: false,
  });

  const [promotions, setPromotions] = useState({
    enable_promotions: false,
    promotion_frequency: 'daily',
    promotion_duration: 1,
    schedule_promotion: false,
  });

  // Sync local state with currentCampaign
  useEffect(() => {
    if (currentCampaign) {
      setPermissions({
        accept_donations: currentCampaign.permissions.accept_donations,
        leave_words_of_support:
          currentCampaign.permissions.leave_words_of_support,
        appear_in_search_results:
          currentCampaign.permissions.appear_in_search_results,
        suggested_fundraiser_lists:
          currentCampaign.permissions.suggested_fundraiser_lists,
        receive_donation_email:
          currentCampaign.permissions.receive_donation_email,
        receive_daily_summary:
          currentCampaign.permissions.receive_daily_summary,
        is_public: currentCampaign.permissions.is_public,
      });

      setPromotions({
        enable_promotions: currentCampaign.promotions.enable_promotions,
        promotion_frequency: currentCampaign.promotions.promotion_frequency,
        promotion_duration: currentCampaign.promotions.promotion_duration,
        schedule_promotion: currentCampaign.promotions.schedule_promotion,
      });
    }
  }, [currentCampaign]);

  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Function to show toast
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

  // Handle toggling permissions (including isPublic)
  const handleSwitchChange = (permission: keyof Permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  // Handle toggling promotion settings
  const handlePromotionChange = (setting: keyof typeof promotions) => {
    setPromotions((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Handle frequency change
  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPromotions((prev) => ({
      ...prev,
      promotion_frequency: event.target.value,
    }));
  };

  // Handle duration change
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromotions((prev) => ({
      ...prev,
      promotion_duration: Number(event.target.value),
    }));
  };

  // Handle saving settings
  const handleSaveSettings = async () => {
    const updatedSettings = {
      campaign: {
        ...permissions,
        ...promotions,
      },
    };

    try {
      await updateCampaignSettings(campaignId, updatedSettings);
      await fetchCampaignById(campaignId); // Refresh currentCampaign
      await fetchCampaigns(); // Refresh campaigns list
      showToast(
        'Success',
        'Campaign settings updated successfully!',
        'success',
      );
    } catch (error) {
      showToast(
        'Error',
        'Failed to update campaign settings. Please try again.',
        'error',
      );
    }
  };

  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-900 h-fit overflow-y-auto">
      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Fundraiser Settings
      </h2>

      {/* Permissions Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Fundraiser Permissions
        </h3>
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between mb-4">
            <span className="text-sm">{key.replace(/([A-Z])/g, ' $1')}</span>
            <Switch
              checked={value}
              onChange={() => handleSwitchChange(key as keyof Permissions)}
              className={`${value ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
            >
              <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>

      {/* Promotion Settings Section */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Promotion Settings
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Enable Promotions</span>
          <Switch
            checked={promotions.enable_promotions}
            onChange={() => handlePromotionChange('enable_promotions')}
            className={`${promotions.enable_promotions ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
          >
            <span
              className={`${promotions.enable_promotions ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {promotions.enable_promotions && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">Promotion Frequency:</label>
              <select
                value={promotions.promotion_frequency}
                onChange={handleFrequencyChange}
                className="form-select block w-full rounded-md border-gray-300 focus:ring-theme-color-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">
                Promotion Duration (days):
              </label>
              <input
                type="number"
                min="1"
                value={promotions.promotion_duration}
                onChange={handleDurationChange}
                className="form-input block w-full rounded-md border-gray-300 focus:ring-theme-color-primary"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Schedule Promotion</span>
              <Switch
                checked={promotions.schedule_promotion}
                onChange={() => handlePromotionChange('schedule_promotion')}
                className={`${promotions.schedule_promotion ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
              >
                <span
                  className={`${promotions.schedule_promotion ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </>
        )}
      </div>

      {/* Visibility Settings Section */}
      {/* <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Visibility Settings
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">
            Make Campaign {!permissions.is_public ? 'Public' : 'Private'}
          </span>
          <Switch
            checked={permissions.is_public}
            onChange={() => handleSwitchChange('is_public')}
            className={`${permissions.is_public ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
          >
            <span
              className={`${permissions.is_public ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div> */}

      {/* Save Settings Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default CampaignPermissionSetting;
