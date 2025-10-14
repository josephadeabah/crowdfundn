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

  const raisedAmount = parseFloat((campaign?.transferred_amount ?? '0').toString());
  const goalAmount = parseFloat((campaign?.goal_amount ?? '0').toString());
  const isGoalReached = raisedAmount >= goalAmount;

  return (
    <div className="sticky top-8">
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
        {isEquityCampaign ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Invest in this company
            </h2>
            <p className="text-gray-600 mb-6">
              <Link
                href="/info/creator-handbook"
                target="_blank"
                className="text-green-600 hover:text-green-700 underline text-sm font-medium transition-colors"
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
              <div className="space-y-4">
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  You need to create an account to invest in equity campaigns.
                </p>
                <Link href="/auth/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                    Join to invest
                  </Button>
                </Link>
                <p className="text-xs text-gray-600 text-center">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:text-green-700 font-semibold underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Support This Project</h2>
            <p className="text-gray-600 mb-6">
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

        {/* Campaign Progress Section - Modernized */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Campaign Progress
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Progress Ring - More prominent */}
              <div className="flex-shrink-0 relative">
                <ProgressRing
                  value={progressPercentage}
                  size={120}
                  strokeWidth={12}
                  color={isGoalReached ? "#10b981" : "#22c55e"}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Stats - Better layout and visibility */}
              <div className="flex-1 text-center lg:text-left">
                {/* Raised Amount - More prominent */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    <span className="text-gray-600 text-lg mr-1">
                      {fundraiserCurrency}
                    </span>
                    {raisedAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    raised of {fundraiserCurrency}
                    {goalAmount.toLocaleString()} goal
                  </div>
                </div>

                {/* Backers and Days - Side by side */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-gray-900">
                      {backersCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {isEquityCampaign ? 'Investors' : 'Backers'}
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <TinyProgressRing
                        remainingDays={Number(campaign?.remaining_days) || 0}
                        customColor={isGoalReached ? "#10b981" : "#22c55e"}
                      />
                      <span className="text-2xl font-bold text-gray-900">
                        {campaign?.remaining_days || 0}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      days left
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar - Additional visual indicator */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isGoalReached ? 'bg-green-500' : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSidebar;