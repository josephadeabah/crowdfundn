import React from 'react';
import { Switch } from '@headlessui/react';
import { Button } from '@/app/components/button/Button';

interface CampaignPermissionSettingProps {
  permissions: { [key: string]: boolean };
  setPermissions: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  promotionSettings: {
    enablePromotions: boolean;
    promotionFrequency: string;
    promotionDuration: number;
    schedulePromotion: boolean;
  };
  setPromotionSettings: React.Dispatch<
    React.SetStateAction<{
      enablePromotions: boolean;
      promotionFrequency: string;
      promotionDuration: number;
      schedulePromotion: boolean;
    }>
  >;
}

const CampaignPermissionSetting: React.FC<CampaignPermissionSettingProps> = ({
  permissions,
  setPermissions,
  promotionSettings,
  setPromotionSettings,
}) => {
  const handleSwitchChange = (permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handlePromotionChange = (setting: keyof typeof promotionSettings) => {
    setPromotionSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPromotionSettings((prev) => ({
      ...prev,
      promotionFrequency: event.target.value,
    }));
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromotionSettings((prev) => ({
      ...prev,
      promotionDuration: Number(event.target.value),
    }));
  };

  return (
    <div className="p-2 bg-gray-50 dark:bg-gray-900 h-fit">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Fundraiser Settings
      </h2>

      <div className="mb-6 p-4 h-full bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Fundraiser Permissions
        </h3>
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between mb-4">
            <span className="text-sm">{key.replace(/([A-Z])/g, ' $1')}</span>
            <Switch
              checked={value}
              onChange={() => handleSwitchChange(key)}
              className={`${value ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
            >
              <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>

      <div className="mb-6 p-4 h-full bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Promotion Settings
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Enable Promotions</span>
          <Switch
            checked={promotionSettings.enablePromotions}
            onChange={() => handlePromotionChange('enablePromotions')}
            className={`${promotionSettings.enablePromotions ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
          >
            <span
              className={`${promotionSettings.enablePromotions ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {promotionSettings.enablePromotions && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">Promotion Frequency:</label>
              <select
                value={promotionSettings.promotionFrequency}
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
                value={promotionSettings.promotionDuration}
                onChange={handleDurationChange}
                className="form-input block w-full rounded-md border-gray-300 focus:ring-theme-color-primary"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Schedule Promotion</span>
              <Switch
                checked={promotionSettings.schedulePromotion}
                onChange={() => handlePromotionChange('schedulePromotion')}
                className={`${promotionSettings.schedulePromotion ? 'bg-gray-900' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2`}
              >
                <span
                  className={`${promotionSettings.schedulePromotion ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignPermissionSetting;
