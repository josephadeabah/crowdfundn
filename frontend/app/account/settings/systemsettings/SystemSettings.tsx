import React, { useState, useEffect, useRef } from 'react';
import {
  FiMail,
  FiBell,
  FiLock,
  FiSettings,
  FiSave,
  FiAlertCircle,
} from 'react-icons/fi';
import { HiColorSwatch } from 'react-icons/hi';
import { BsCalendarDate } from 'react-icons/bs';

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
    system: {
      theme: string;
      updateFrequency: string;
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
    system: {
      theme: '#3366cc',
      updateFrequency: 'weekly',
    },
  });

  interface Errors {
    emailFrequency?: string;
  }

  type SettingKeys = {
    email: keyof Settings['email'];
    subscriptions: keyof Settings['subscriptions'];
    permissions: keyof Settings['permissions'];
    system: keyof Settings['system'];
  };

  const [errors, setErrors] = useState<Errors>({});
  const [saveStatus, setSaveStatus] = useState('');
  const isMounted = useRef(false); // Track if the component is mounted

  useEffect(() => {
    if (isMounted.current) {
      const timer = setTimeout(() => {
        saveSettings();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      isMounted.current = true; // Set to true on first render
    }
  }, [settings]);

  const handleChange = <T extends keyof SettingKeys>(
    section: T,
    key: SettingKeys[T],
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

  const validateField = (section: string, key: string, value: any) => {
    let newErrors = { ...errors };

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
    // Simulating an API call
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Settings saved successfully');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  return (
    <div className="mx-auto h-full bg-white dark:bg-gray-900 p-2">
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
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle-notifications"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={settings.email.notifications}
                  onChange={(e) =>
                    handleChange('email', 'notifications', e.target.checked)
                  }
                />
                <label
                  htmlFor="toggle-notifications"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                >
                  <span className="sr-only">Toggle Notifications</span>
                </label>
              </div>
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
              <input
                id="newsletter-checkbox"
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
                checked={settings.subscriptions.newsletter}
                onChange={(e) =>
                  handleChange('subscriptions', 'newsletter', e.target.checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="promotions-checkbox" className="text-gray-600">
                Promotions
              </label>
              <input
                id="promotions-checkbox"
                type="checkbox"
                className="form-checkbox h-5 w-5 text-gray-600"
                checked={settings.subscriptions.promotions}
                onChange={(e) =>
                  handleChange('subscriptions', 'promotions', e.target.checked)
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
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle-data-sharing"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={settings.permissions.dataSharing}
                  onChange={(e) =>
                    handleChange('permissions', 'dataSharing', e.target.checked)
                  }
                />
                <label
                  htmlFor="toggle-data-sharing"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-600">Location Access</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle-location-access"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={settings.permissions.locationAccess}
                  onChange={(e) =>
                    handleChange(
                      'permissions',
                      'locationAccess',
                      e.target.checked,
                    )
                  }
                />
                <label
                  htmlFor="toggle-location-access"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
            <FiSettings className="mr-2" /> System Settings
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-2  items-center">
                <HiColorSwatch className="mr-2" /> Theme Color
              </label>
              <input
                type="color"
                className="h-10 w-full"
                value={settings.system.theme}
                onChange={(e) =>
                  handleChange('system', 'theme', e.target.value)
                }
                aria-label="Theme color picker"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2  items-center">
                <BsCalendarDate className="mr-2" /> Update Frequency
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.system.updateFrequency}
                onChange={(e) =>
                  handleChange('system', 'updateFrequency', e.target.value)
                }
                aria-label="Update frequency"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md ${
            saveStatus.includes('successfully') ? 'bg-green-500' : 'bg-gray-500'
          } text-white flex items-center transition-opacity duration-300`}
        >
          {saveStatus.includes('successfully') ? (
            <FiSave className="mr-2" />
          ) : (
            <FiAlertCircle className="mr-2" />
          )}
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default SystemSettingsPage;
