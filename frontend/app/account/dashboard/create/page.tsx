'use client';

import CreateCampaign from './AddCampaign';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import EditCampaign from './EditCampaign';

const FundraiserPage = () => {
  const [activeTab, setActiveTab] = useState('Details');
  const [error, setError] = useState('');

  const tabs = ['Details', 'Team'];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setError('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return <EditCampaign />;
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
    <div className="max-w-7xl mx-auto p-4">
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

      <h1 className="text-3xl font-bold mb-8">Edit Fundraising</h1>

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

      <div key={activeTab} className="h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FundraiserPage;
