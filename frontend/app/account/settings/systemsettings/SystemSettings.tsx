import React, { useState, useEffect, useRef } from 'react';
import { FiMail, FiBell, FiLock, FiSave, FiAlertCircle } from 'react-icons/fi';
import { Checkbox } from '@/app/components/checkbox/Checkbox';
import { Switch } from '@/app/components/switch/Switch';
import CurrentDeviceDetailsSection from './CurrentDeviceDetails';
import { Button } from '@/app/components/button/Button';

const SystemSettingsPage = () => {
  interface Settings {
    email: {
      notifications: boolean;
      frequency: string;
    };
    subscriptions: {
      newsletter: boolean;
      promotions: boolean;
    };
    permissions: {
      dataSharing: boolean;
      locationAccess: boolean;
    };
  }

  const [settings, setSettings] = useState<Settings>({
    email: {
      notifications: true,
      frequency: 'daily',
    },
    subscriptions: {
      newsletter: true,
      promotions: false,
    },
    permissions: {
      dataSharing: false,
      locationAccess: true,
    },
  });

  interface Errors {
    emailFrequency?: string;
  }

  const [errors, setErrors] = useState<Errors>({});
  const [saveStatus, setSaveStatus] = useState('');
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const timer = setTimeout(() => {
        saveSettings();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      isMounted.current = true;
    }
  }, [settings]);

  const handleChange = <T extends keyof Settings>(
    section: T,
    key: keyof Settings[T],
    value: any,
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: value,
      },
    }));

    validateField(section, key, value);
  };

  const validateField = <T extends keyof Settings>(
    section: T,
    key: keyof Settings[T],
    value: any,
  ) => {
    const newErrors = { ...errors };

    if (section === 'email' && key === 'frequency') {
      if (!value) {
        newErrors.emailFrequency = 'Please select a frequency';
      } else {
        delete newErrors.emailFrequency;
      }
    }

    setErrors(newErrors);
  };

  const saveSettings = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Settings saved successfully');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  return (
    <div className="mx-auto bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>

      <div className="space-y-8">
        {/* Email Notifications Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <FiMail className="mr-2" /> Email Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-notifications" className="text-gray-600">
                Receive notifications
              </label>
              <Switch
                checked={settings.email.notifications}
                onCheckedChange={(checked) =>
                  handleChange('email', 'notifications', checked)
                }
              />
            </div>
            <div>
              <label
                htmlFor="email-frequency"
                className="block text-gray-600 mb-2"
              >
                Frequency
              </label>
              <select
                id="email-frequency"
                className="w-full p-2 border rounded-md"
                value={settings.email.frequency}
                onChange={(e) =>
                  handleChange('email', 'frequency', e.target.value)
                }
                aria-label="Email notification frequency"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.emailFrequency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailFrequency}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <FiBell className="mr-2" /> Subscriptions
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="newsletter-checkbox" className="text-gray-600">
                Newsletter
              </label>
              <Checkbox
                checked={settings.subscriptions.newsletter}
                onCheckedChange={(checked) =>
                  handleChange('subscriptions', 'newsletter', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="promotions-checkbox" className="text-gray-600">
                Promotions
              </label>
              <Checkbox
                checked={settings.subscriptions.promotions}
                onCheckedChange={(checked) =>
                  handleChange('subscriptions', 'promotions', checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <FiLock className="mr-2" /> Permissions
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-data-sharing" className="text-gray-600">
                Data Sharing
              </label>
              <Switch
                checked={settings.permissions.dataSharing}
                onCheckedChange={(checked) =>
                  handleChange('permissions', 'dataSharing', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-location-access" className="text-gray-600">
                Location Access
              </label>
              <Switch
                checked={settings.permissions.locationAccess}
                onCheckedChange={(checked) =>
                  handleChange('permissions', 'locationAccess', checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Fundraiser Update Emails Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <FiAlertCircle className="mr-2" /> Fundraiser Update Emails
          </h2>
          <p className="text-gray-600 mb-4">
            Once you’ve made a donation to a fundraiser, you’ll be able to view
            and update your notification settings here.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="toggle-fundraiser-updates"
                className="text-gray-600"
              >
                Receive fundraiser update emails
              </label>
              <Switch
                checked={settings.email.notifications}
                onCheckedChange={(checked) =>
                  handleChange('email', 'notifications', checked)
                }
              />
            </div>
            <div>
              <label
                htmlFor="email-frequency"
                className="block text-gray-600 mb-2"
              >
                Update Frequency
              </label>
              <select
                id="fundraiser-email-frequency"
                className="w-full p-2 border rounded-md"
                value={settings.email.frequency}
                onChange={(e) =>
                  handleChange('email', 'frequency', e.target.value)
                }
                aria-label="Fundraiser email update frequency"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {errors.emailFrequency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailFrequency}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Current Device Details*/}
        <CurrentDeviceDetailsSection />
        {/* Save Button & Save Status Section */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-4 sm:space-y-0">
          {/* Save Button */}
          <Button
            className="w-full md:w-1/2 rounded-full hover:bg-gray-700 hover:text-gray-50 focus:outline-none"
            onClick={saveSettings}
            size="lg"
            variant="default"
          >
            Save
          </Button>

          {/* Save Status */}
          {saveStatus && (
            <div className="flex justify-center sm:justify-start">
              <p
                className={`text-sm ${
                  saveStatus.includes('error')
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {saveStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
