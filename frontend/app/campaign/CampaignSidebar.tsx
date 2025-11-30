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
    (Number(campaign?.current_amount) /
      Number(campaign?.goal_amount || 1)) *
      100,
  );

  return (
    <div className="sticky top-8">
      <div className="bg-gradient-to-br from-white to-gray-50 p-4">
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
          {/* Campaign Progress Header with TinyProgressRing */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Campaign Progress
            </h3>
            <div className="flex items-center gap-2">
              <TinyProgressRing
                remainingDays={Number(campaign?.remaining_days) || 0}
                customColor="#22c55e"
              />
            </div>
          </div>

          {/* Progress Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between gap-6">
              {/* Progress Figures */}
              <div className="flex-1">
                <div className="space-y-4">
                  {/* Raised Amount */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      <span className="text-gray-600 text-lg mr-1">
                        {fundraiserCurrency}
                      </span>
                      {parseFloat(
                        (campaign?.current_amount ?? '0').toString(),
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Raised</div>
                  </div>

                  {/* Goal Amount */}
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-700">
                      <span className="text-gray-600 text-sm mr-1">
                        {fundraiserCurrency}
                      </span>
                      {parseFloat(
                        campaign?.goal_amount || '0.0',
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Goal</div>
                  </div>

                  {/* Backers/Investors */}
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900">
                      {backersCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {isEquityCampaign ? 'Investors' : 'Backers'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex-shrink-0">
                <ProgressRing
                  value={progressPercentage}
                  size={120}
                  strokeWidth={12}
                  color="#22c55e"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSidebar;
