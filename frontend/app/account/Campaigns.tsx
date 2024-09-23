import React, { useEffect } from 'react';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { CampaignsLoader } from '../loaders/CampaignsLoader';

export default function Campaigns() {
  const { campaigns, loading, error, fetchCampaigns } = useCampaignContext();

  // Fetch campaigns when the component mounts
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) {
    return <CampaignsLoader />;
  }

  if (error) {
    return <p>Error fetching campaigns: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Campaigns
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Manage your active and past campaigns.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campaigns?.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {campaign.title}
            </h3>
            <p className="text-gray-500 dark:text-neutral-400">
              {campaign.description}
            </p>
            <div className="mt-4 flex justify-between items-center">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700">
                Amplify
              </button>
              <span className="text-xs text-green-400 font-semibold">
                Active campaign
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
