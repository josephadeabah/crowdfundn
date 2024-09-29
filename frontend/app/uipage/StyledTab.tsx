import React, { useState } from 'react';
import {
  FaUser,
  FaCog,
  FaChartBar,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StyledTab = () => {
  const [activeTab, setActiveTab] = useState('userProfiles');
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    bio: 'Passionate developer and tech enthusiast',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });
  const [settings, setSettings] = useState({
    profileVisibility: true,
    emailNotifications: true,
    darkMode: false,
  });

  const performanceData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    setEditMode(!editMode);
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="md:w-1/4">
          <div className="flex flex-col space-y-2">
            <button
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'userProfiles'
                  ? 'bg-theme-color-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabClick('userProfiles')}
            >
              <FaUser />
              <span>User Profiles</span>
            </button>
            <button
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-theme-color-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabClick('settings')}
            >
              <FaCog />
              <span>Settings</span>
            </button>
            <button
              className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                activeTab === 'performanceMetrics'
                  ? 'bg-theme-color-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabClick('performanceMetrics')}
            >
              <FaChartBar />
              <span>Performance Metrics</span>
            </button>
          </div>
        </div>
        <div className="md:w-3/4 bg-gray-50 rounded-lg p-6">
          {activeTab === 'userProfiles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  User Profile
                </h2>
                <button
                  className="bg-theme-color-secondary text-white px-4 py-2 rounded-lg hover:bg-theme-color-secondary-dark transition-colors"
                  onClick={handleEditProfile}
                >
                  <FaEdit className="inline-block mr-2" />
                  {editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                />
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={userProfile.name}
                    onChange={handleProfileChange}
                    className="text-2xl font-semibold text-gray-800 bg-white border-b-2 border-theme-color-primary focus:outline-none"
                  />
                ) : (
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {userProfile.name}
                  </h3>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={userProfile.bio}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                      rows={3}
                    ></textarea>
                  ) : (
                    <p className="mt-1 text-gray-600">{userProfile.bio}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">
                      <FaEnvelope className="inline-block mr-2 text-theme-color-primary" />
                      {userProfile.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">
                      <FaPhone className="inline-block mr-2 text-theme-color-primary" />
                      {userProfile.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Profile Visibility</span>
                  <button
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.profileVisibility
                        ? 'bg-theme-color-primary'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => handleSettingToggle('profileVisibility')}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.profileVisibility ? 'translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Notifications</span>
                  <button
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.emailNotifications
                        ? 'bg-theme-color-primary'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => handleSettingToggle('emailNotifications')}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Dark Mode</span>
                  <button
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      settings.darkMode
                        ? 'bg-theme-color-primary'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => handleSettingToggle('darkMode')}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                        settings.darkMode ? 'translate-x-6' : ''
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'performanceMetrics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Performance Metrics
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f52d00"
                      fill="#f52d00"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-theme-color-primary">
                    10,234
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Active Users
                  </h3>
                  <p className="text-3xl font-bold text-theme-color-primary">
                    8,456
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyledTab;
