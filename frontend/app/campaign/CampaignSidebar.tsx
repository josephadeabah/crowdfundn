import React from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import ProgressRing from '@/app/components/ring/ProgressRing';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import Link from 'next/link';
import TinyProgressRing from '@/app/components/ring/TinyProgressRing';
import { useAuth } from '../context/auth/AuthContext';
import { Button } from '@/app/components/button/Button';

interface CampaignSidebarProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignSidebar: React.FC<CampaignSidebarProps> = ({ campaign }) => {
  const { user, token } = useAuth();
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  const isEquityCampaign = campaign?.type === 'EquityCampaign';
  const isLoggedIn = user && token;

  // Use total_investors for equity campaigns, total_donors for others
  const backersCount = isEquityCampaign
    ? campaign?.total_investors || 0
    : campaign?.total_donors || 0;

  const progressPercentage = Math.round(
    (Number(campaign?.transferred_amount) /
      Number(campaign?.goal_amount || 1)) *
      100,
  );

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
                href="/info/creator-handbook"
                target="_blank"
                className="text-gray-500 underline text-sm"
              >
                Learn more about equity fundraisers
              </Link>
            </p>

            {isLoggedIn ? (
              <DonationButton
                selectedTier={null}
                pledgeAmount="0"
                isEquityCampaign={true}
                billingFrequency="once"
                fundraiserDetails={{
                  id: String(campaign?.fundraiser_id),
                  campaignId: String(campaign?.id),
                  campaignTitle: campaign?.title,
                }}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  You need to create an account to invest in equity campaigns.
                </p>
                <Link href="/auth/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Join to invest
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
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
              isEquityCampaign={false}
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Campaign Progress
          </h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-center bg-white text-gray-800 rounded-lg shadow mb-8 p-2 space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <div className="w-full flex lg:flex-col sm:justify-between gap-3 items-center text-xl py-2">
                <div className="font-medium text-sm">
                  <span
                    className={`${
                      parseFloat(
                        (campaign?.transferred_amount ?? '0').toString(),
                      ) >= parseFloat((campaign?.goal_amount ?? '0').toString())
                        ? 'text-green-600'
                        : 'text-orange-500'
                    }`}
                  >
                    <span className="text-gray-600 mr-1">
                      {fundraiserCurrency}
                    </span>
                    {parseFloat(
                      (campaign?.transferred_amount ?? '0').toString(),
                    ).toLocaleString()}
                  </span>{' '}
                </div>
                <div className="flex justify-between gap-3 items-center text-gray-600">
                  <div className="text-xs">
                    <span>of</span>
                  </div>{' '}
                  <div className="font-medium text-sm">
                    {fundraiserCurrency}
                    {parseFloat(
                      campaign?.goal_amount || '0.0',
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs">
                    <span>Goal</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <strong>{backersCount}</strong>{' '}
                {isEquityCampaign ? 'Investors' : 'Backers'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <TinyProgressRing
                  remainingDays={Number(campaign?.remaining_days) || 0}
                  customColor="#22c55e"
                />
              </div>
            </div>
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <ProgressRing
                value={progressPercentage}
                size={150}
                strokeWidth={10}
                color="#22c55e"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSidebar;
