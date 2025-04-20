import React from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import ProgressRing from '@/app/components/ring/ProgressRing';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import DonationsChart from './DonationsChart';
import Link from 'next/link';
import { Button } from '@/app/components/button/Button';

interface CampaignSidebarProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignSidebar: React.FC<CampaignSidebarProps> = ({ campaign }) => {
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  const isEquityCampaign = campaign?.type === 'EquityCampaign';

  return (
    <div className="sticky top-8">
      <div className="bg-white p-4">
        {isEquityCampaign ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Invest in this company
            </h2>
            <p className="text-gray-700 mb-4">
              <Link
                href="/learn/equity-fundraising"
                target="_blank"
                className="text-gray-500 underline text-sm"
              >
                Learn more about equity fundraisers
              </Link>
            </p>
            <button
              className="w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-800 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow"
              aria-label="Invest"
            >
              Invest
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Support This Project</h2>
            <p className="text-gray-700 mb-4">
              Help us reach our goal by contributing to this project.
            </p>
            <DonationButton
              selectedTier={null}
              pledgeAmount="0"
              billingFrequency="once"
              fundraiserDetails={{
                id: String(campaign?.fundraiser_id),
                campaignId: String(campaign?.id),
                campaignTitle: campaign?.title,
              }}
            />
          </>
        )}

        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
            Campaign Progress
          </h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow mb-8 p-2 space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <div className="w-full flex lg:flex-col sm:justify-between gap-3 items-center text-xl py-2">
                <div className="font-medium text-sm">
                  <span
                    className={`${
                      parseFloat(
                        campaign?.transferred_amount?.toString() || '0',
                      ) >= parseFloat(campaign?.goal_amount?.toString() || '0')
                        ? 'text-green-600'
                        : 'text-orange-500'
                    }`}
                  >
                    <span className="text-gray-600 dark:text-gray-100 mr-1">
                      {fundraiserCurrency}
                    </span>
                    {parseFloat(
                      campaign?.transferred_amount?.toString() || '0',
                    ).toLocaleString()}
                  </span>{' '}
                </div>
                <div className="flex justify-between gap-3 items-center text-gray-600 dark:text-gray-400">
                  <div className="text-xs text-gray-500">
                    <span>of</span>
                  </div>{' '}
                  <div className="font-medium text-sm">
                    {fundraiserCurrency}
                    {parseFloat(
                      campaign?.goal_amount || '0.0',
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>Goal</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>{campaign?.total_donors || 0}</strong>{' '}
                {isEquityCampaign ? 'Investors' : 'Backers'}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>{campaign?.remaining_days || 0}</strong> days left
              </p>
            </div>
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <ProgressRing
                value={Math.round(
                  (Number(campaign?.transferred_amount || 0) /
                    Number(campaign?.goal_amount || 1)) *
                    100,
                )}
                size={150}
                strokeWidth={10}
                color="#22c55e"
              />
            </div>
          </div>
        </div>
        <DonationsChart currentCampaign={campaign} />
      </div>
    </div>
  );
};

export default CampaignSidebar;
