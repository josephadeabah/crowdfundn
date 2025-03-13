'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import EditCampaign from '../EditCampaign';
import CampaignCreator from '@/app/components/campaign/CampaignCreator';
import { useRouter, useSearchParams } from 'next/navigation';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';

// Wrap the main component in Suspense
const FundraiserPage = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <FundraiserPageContent />
    </Suspense>
  );
};

// Move the main logic to a separate component
const FundraiserPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Create New Campaign');
  const [error, setError] = useState('');

  // Define the tabs
  const tabs = ['Create New Campaign', 'Edit Campaign'];

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle tab click and update the URL
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setError('');
    router.push(`/account/dashboard/create?tab=${encodeURIComponent(tab)}`);
  };

  // Render the content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Create New Campaign':
        return <CampaignCreator />;
      case 'Edit Campaign':
        return <EditCampaign />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => router.push('/account')}
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
