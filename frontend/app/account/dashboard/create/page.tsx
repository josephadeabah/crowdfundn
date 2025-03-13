'use client';

import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import CampaignCreator from '@/app/components/campaign/CampaignCreator';

const FundraiserPage = () => {
  const [activeTab, setActiveTab] = useState('Create New Campaign');
  const [error, setError] = useState('');

  // Define the tabs
  const tabs = ['Create New Campaign', 'Team Fundraising'];

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setError('');
  };

  // Render the content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Create New Campaign':
        return <CampaignCreator />;
      case 'Team Fundraising':
        return (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Team Fundraising</h2>
            <p className="text-gray-700 dark:text-gray-400">
              Team Fundraising is coming soon!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = '/account')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Fundraising</h1>

      <div className="mb-6">
        <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                activeTab === tab
                  ? 'bg-emerald-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-selected={activeTab === tab}
              role="tab"
              aria-controls={`${tab.toLowerCase().replace(/ /g, '-')}-tab`}
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

      <div key={activeTab} className="h-full">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FundraiserPage;
