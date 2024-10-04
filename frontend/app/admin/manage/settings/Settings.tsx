import React, { useState } from 'react';
import { FiLock, FiGlobe, FiBell, FiShield, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState({
    role: 'user',
    permissions: {
      read: true,
      write: false,
      delete: false,
    },
    twoFactorAuth: false,
    dataSharing: true,
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePermissionChange = (
    permission: keyof typeof settings.permissions,
  ) => {
    setSettings((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiShield className="mr-2" /> User Roles & Permissions
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block mb-1 font-medium">
                  User Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={settings.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <p className="font-medium mb-2">Permissions</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permissionRead"
                      checked={settings.permissions.read}
                      onChange={() => handlePermissionChange('read')}
                      className="mr-2"
                    />
                    <label htmlFor="permissionRead">Read</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permissionWrite"
                      checked={settings.permissions.write}
                      onChange={() => handlePermissionChange('write')}
                      className="mr-2"
                    />
                    <label htmlFor="permissionWrite">Write</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="permissionDelete"
                      checked={settings.permissions.delete}
                      onChange={() => handlePermissionChange('delete')}
                      className="mr-2"
                    />
                    <label htmlFor="permissionDelete">Delete</label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2" /> Privacy & Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="twoFactorAuth">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dataSharing"
                  name="dataSharing"
                  checked={settings.dataSharing}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="dataSharing">Allow Data Sharing</label>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiGlobe className="mr-2" /> Language
            </h2>
            <div>
              <label htmlFor="language" className="block mb-1 font-medium">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiBell className="mr-2" /> Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="emailNotifications">Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  name="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="pushNotifications">Push Notifications</label>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            className={`px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FiSave className="inline-block mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="inline-block mr-2" />
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default AdminSettings;
