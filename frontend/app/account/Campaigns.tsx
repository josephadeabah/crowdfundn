import React from 'react';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import CampaignsLoader from '../loaders/CampaignsLoader';
import { Button } from '../components/button/Button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

export default function Campaigns() {
  const { campaigns, loading, error } = useCampaignContext();

  if (loading) return <CampaignsLoader />;

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
            className="relative p-4 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 flex flex-col justify-between"
          >
            {/* Popover for 3-dot menu */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200">
                  <DotsVerticalIcon className="h-6 w-6" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <ul className="space-y-2">
                  <li>
                    <button
                      className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 p-2 rounded-md"
                      onClick={() => console.log('Edit Campaign')}
                    >
                      Edit Campaign
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 p-2 rounded-md"
                      onClick={() => console.log('Delete Campaign')}
                    >
                      Delete Campaign
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 p-2 rounded-md"
                      onClick={() => console.log('Move to Archive')}
                    >
                      Move to Archive
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {campaign.title}
              </h3>
              <p className="text-gray-500 dark:text-neutral-400 flex-grow">
                {campaign.description}
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button
                className="px-4 py-2 text-green-500 rounded-full"
                variant="secondary"
                size="default"
              >
                Promote
              </Button>
              <span className="text-xs text-red-500 font-semibold">
                Active campaign
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Space Below the Page */}
      <div className="h-20"></div> {/* Adjust the height as needed */}
    </div>
  );
}
