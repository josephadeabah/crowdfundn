import React from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import ProgressRing from '@/app/components/ring/ProgressRing';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import Link from 'next/link';
import TinyProgressRing from '@/app/components/ring/TinyProgressRing';
import { useAuth } from '../context/auth/AuthContext';
import { Button } from '@/app/components/button/Button';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

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
  const goalAmount = parseFloat(campaign?.goal_amount || '0.0');
  const isGoalReached = raisedAmount >= goalAmount;

  return (
    <div className="sticky top-8">
      <div className="bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
        {isEquityCampaign ? (
          <>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Invest in this Company
            </h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Become a shareholder and grow with this innovative venture.
              <Link
                href="/info/creator-handbook"
                target="_blank"
                className="block mt-2 text-green-600 hover:text-green-700 underline text-sm font-medium"
              >
                Learn more about equity fundraisers →
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
                <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  Create an account to start investing in equity campaigns and become a shareholder.
                </p>
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                    Join to Invest
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-green-600 hover:text-green-700 font-semibold underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Support This Project
            </h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Help bring this vision to life by contributing to the campaign.
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

        {/* Modern Campaign Progress Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Campaign Progress
            </h3>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-2xl p-6 shadow-lg mb-6">
            {/* Progress Ring with Stats */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
              <div className="flex-1 text-center lg:text-left">
                <div className="space-y-4">
                  {/* Raised Amount */}
                  <div className="text-center">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Raised
                      </span>
                    </div>
                    <div className={`text-3xl font-bold ${isGoalReached ? 'text-green-600' : 'text-orange-500'}`}>
                      {fundraiserCurrency}
                      {raisedAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* Goal Amount */}
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Goal
                    </span>
                    <div className="text-2xl font-bold text-gray-800">
                      {fundraiserCurrency}
                      {goalAmount.toLocaleString()}
                    </div>
                  </div>

                  {/* Backers Count */}
                  <div className="text-center">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {isEquityCampaign ? 'Investors' : 'Backers'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {backersCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative">
                <ProgressRing
                  value={progressPercentage}
                  size={140}
                  strokeWidth={12}
                  color="#22c55e"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {progressPercentage}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Funded
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isGoalReached 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Time Left</span>
              </div>
              <div className="flex items-center gap-2">
                <TinyProgressRing
                  remainingDays={Number(campaign?.remaining_days) || 0}
                  customColor={Number(campaign?.remaining_days) <= 7 ? "#ef4444" : "#8b5cf6"}
                />
                <span className={`text-sm font-bold ${
                  Number(campaign?.remaining_days) <= 7 
                    ? 'text-red-600' 
                    : 'text-purple-600'
                }`}>
                  {campaign?.remaining_days || 0} days
                </span>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(raisedAmount / (backersCount || 1)).toLocaleString()}
              </div>
              <div className="text-xs font-medium text-blue-800 uppercase tracking-wide">
                Avg. {isEquityCampaign ? 'Investment' : 'Donation'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {goalAmount - raisedAmount > 0 ? fundraiserCurrency + (goalAmount - raisedAmount).toLocaleString() : 'Goal Reached!'}
              </div>
              <div className="text-xs font-medium text-green-800 uppercase tracking-wide">
                To Go
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSidebar;