'use client';
import React, { useEffect, useState } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useParams } from 'next/navigation';
import { FaShare } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import SingleCampaignLoader from '@/app/loaders/SingleCampaignLoader';
import Avatar from '@/app/components/avatar/Avatar';
import Image from 'next/image';
import { getRemainingDaysMessage } from '@/app/utils/helpers/calculate.days';
import CommentsSection from '@/app/components/comments/CommentSection';
import FundraiserUpdates from '@/app/components/fundraiserupdate/FundraiserUpdates';
import RewardSelection from '@/app/components/selectreward/RewardSelection';

const SingleCampaignPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [billingFrequency, setBillingFrequency] = useState<string>('once');
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams() as { id: string };
  const { currentCampaign, fetchCampaignById, loading } = useCampaignContext();

  useEffect(() => {
    if (id) {
      fetchCampaignById(id);
    }
  }, [id, fetchCampaignById]);

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    const selectedReward = currentCampaign?.rewards.find(
      (reward) => reward.id === tierId,
    );
    if (selectedReward) {
      setPledgeAmount(selectedReward.amount.toString());
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Fundraising Details - ${currentCampaign?.title}`,
          text: `Check out my fundraising details for ${currentCampaign?.description}`,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopyButtonText('Copied');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      }
    } catch (error) {
      setError('Error sharing fundraising details');
    }
  };

  if (loading) return <SingleCampaignLoader />;

  // Determine the fundraiser name
  const fundraiserName =
    currentCampaign?.fundraiser?.profile?.name ||
    currentCampaign?.fundraiser?.name;

  const fundraiserCurrency =
    currentCampaign?.fundraiser?.currency_symbol ||
    currentCampaign?.fundraiser?.currency?.toUpperCase();

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Middle Column: Campaign Details */}
          <div className="order-1 lg:col-span-1 overflow-y-auto max-h-100">
            <h1 className="text-4xl font-bold mb-4">
              {currentCampaign?.title}
            </h1>
            <div className="relative w-full h-fit aspect-square rounded-sm overflow-hidden">
              <Image
                src={currentCampaign?.media || '/bantuhive.svg'}
                alt="fundraising thumbnail"
                loading="eager"
                layout="fill" // Use "fill" layout
                objectFit="cover" // This ensures the image covers the entire container
              />
            </div>

            {/* Progress Bar and Stats */}
            <div className="bg-white rounded-lg shadow-sm py-6 px-2 mb-8">
              <div className="w-full flex flex-col gap-2 items-center mb-4">
                <div className="flex justify-between items-center w-full text-md font-semibold text-right text-gray-600">
                  <div>{currentCampaign?.total_donors || 0} Backers</div>
                  <div>
                    {currentCampaign?.start_date && currentCampaign?.end_date
                      ? getRemainingDaysMessage(
                          currentCampaign.start_date,
                          currentCampaign.end_date,
                        )
                      : 'N/A days left'}
                  </div>
                </div>
                <div className="w-full flex justify-between items-center text-xl py-2">
                  <div className="font-medium">
                    {fundraiserCurrency}
                    {parseFloat(
                      currentCampaign?.current_amount || '0.0',
                    ).toLocaleString()}
                  </div>
                  <div className="flex justify-between gap-2 items-center text-gray-600 dark:text-gray-400">
                    <div className="text-sm text-gray-500">
                      <span>of</span>
                    </div>{' '}
                    {fundraiserCurrency}
                    {parseFloat(
                      currentCampaign?.goal_amount || '0.0',
                    ).toLocaleString()}
                    <div className="text-sm text-gray-500">
                      <span>Goal</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full max-w-full"
                    style={{
                      width: `${(Number(currentCampaign?.current_amount) / Number(currentCampaign?.goal_amount)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="prose max-w-none">
                <div
                  className="text-gray-800 dark:text-neutral-200 flex-grow"
                  dangerouslySetInnerHTML={{
                    __html: currentCampaign?.description?.body || '',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Left Column: Donation and Rewards */}
          <div className="order-3 sticky top-4 h-fit">
            <h2 className="text-2xl font-bold mb-4 w-full">
              Fundraiser Updates
            </h2>
            <FundraiserUpdates
              updates={currentCampaign?.updates || []}
              fundraiserName={fundraiserName}
            />
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Share this fundraiser</h2>
              <div className="flex items-center mb-4">
                <Button onClick={handleShare} className="mr-4">
                  <FaShare className="mr-2" /> Share
                </Button>
                <button className="bg-gray-200 rounded-md px-4 py-2">
                  {copyButtonText}
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            {/* Comments Section */}
            <CommentsSection comments={currentCampaign?.comments || []} />
          </div>

          {/* Right Column: Sticky Rewards */}
          <div className="order-2 lg:col-span-1 ">
            <div className="flex items-center py-8">
              <div className="text-xs italic text-gray-500 dark:text-gray-50 mr-3">
                fundraiser:
              </div>
              <Avatar name={String(fundraiserName)} size="md" />
              <h3 className="ml-2">{fundraiserName}</h3>
            </div>
            <div className="py-2">
              {currentCampaign?.fundraiser?.profile?.description}
            </div>
            <div className="w-full marker:bg-white rounded-lg shadow-sm px-6 pb-4">
              <RewardSelection
                rewards={currentCampaign?.rewards || []}
                selectedTier={selectedTier}
                onTierSelect={handleTierSelect}
                pledgeAmount={pledgeAmount}
                setPledgeAmount={setPledgeAmount}
                billingFrequency={billingFrequency}
                setBillingFrequency={setBillingFrequency}
              />
              <div className="w-full">
                <DonationButton
                  selectedTier={selectedTier}
                  pledgeAmount={pledgeAmount}
                  billingFrequency={billingFrequency}
                  fundraiserDetails={{
                    id: String(currentCampaign?.fundraiser_id),
                    campaignId: String(currentCampaign?.id),
                    campaignTitle: currentCampaign?.title,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignPage;
