'use client';

import CreateCampaign from './AddCampaign';
import React, { useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CampaignPermissionSetting from './settings/PermissionSettings';

const FundraiserPage = () => {
  const [activeTab, setActiveTab] = useState('Details');
  const [error, setError] = useState('');

  const tabs = ['Details', 'Settings', 'Team'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setError('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
              <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FaEdit />
              </button>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Campaign Title
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Your fundraiser title goes here
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
              <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FaEdit />
              </button>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Fundraising Goal
              </h3>
              <p className="text-gray-700 dark:text-gray-400">$10,000</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
              <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FaEdit />
              </button>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Campaign Description
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Your fundraiser description goes here...
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
              <button className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FaEdit />
              </button>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Campaign Image
              </h3>
              <img
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&q=60"
                alt="Campaign"
                className="w-full h-40 object-cover rounded"
              />
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div>
            <CampaignPermissionSetting />
          </div>
        );
      case 'Team':
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Fundraiser Team</h2>
            <p>Manage your fundraiser team here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <CreateCampaign />

      <div className="mb-6">
        <button
          onClick={() => (window.location.href = '/account')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>

      <div className="mb-6">
        <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                activeTab === tab
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-selected={activeTab === tab}
              role="tab"
              aria-controls={`${tab.toLowerCase()}-tab`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-screen"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default FundraiserPage;
