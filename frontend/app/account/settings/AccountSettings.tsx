import React, { useState } from 'react';
import { FaCreditCard, FaUser, FaBell } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import PaymentMethod from './paymentmethod/PaymentMethod';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    notifications: false,
    privacy: 'public',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Invalid email address';
      case 'password':
        return value.length >= 8
          ? ''
          : 'Password must be at least 8 characters long';
      default:
        return '';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payment':
        return <PaymentMethod />;
      case 'account':
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {validateField('email', formData.email) && (
                <p className="text-red-500 text-xs mt-1">
                  {validateField('email', formData.email)}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {validateField('password', formData.password) && (
                <p className="text-red-500 text-xs mt-1">
                  {validateField('password', formData.password)}
                </p>
              )}
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label
                htmlFor="notifications"
                className="ml-2 block text-sm text-gray-900"
              >
                Enable Notifications
              </label>
            </div>
            <div>
              <label
                htmlFor="privacy"
                className="block text-sm font-medium text-gray-700"
              >
                Privacy Settings
              </label>
              <select
                id="privacy"
                name="privacy"
                value={formData.privacy}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('payment')}
        >
          <FaCreditCard className="mr-2" />
          Payment
        </button>
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'account' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('account')}
        >
          <MdAccountCircle className="mr-2" />
          Account
        </button>
        <button
          className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'system' ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('other')}
        >
          <FaBell className="mr-2" />
          System
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50 p-3 shadow">
        {renderTabContent()}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
