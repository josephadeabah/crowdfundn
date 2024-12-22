'use client';
import React, { useEffect, useState, useRef } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useParams } from 'next/navigation';
import {
  FaShare,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import SingleCampaignLoader from '@/app/loaders/SingleCampaignLoader';
import Avatar from '@/app/components/avatar/Avatar';
import Image from 'next/image';
import CommentsSection from '@/app/components/comments/CommentSection';
import FundraiserUpdates from '@/app/components/fundraiserupdate/FundraiserUpdates';
import RewardSelection from '@/app/components/selectreward/RewardSelection';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ProgressRing from '@/app/components/ring/ProgressRing';
import moment from 'moment';
import DonationList from '@/app/components/backerlist/DonationList';

const SingleCampaignPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    'details' | 'donate' | 'updates' | 'comments' | 'backers'
  >('details');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<string>('0');
  const [billingFrequency, setBillingFrequency] = useState<string>('once');
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [error, setError] = useState<string | null>(null);

  const tabsRef = useRef<HTMLDivElement>(null);

  const { id } = useParams() as { id: string };
  const { currentCampaign, fetchCampaignById, loading } = useCampaignContext();
  const { donations, fetchPublicDonations } = useDonationsContext();

  useEffect(() => {
    if (id) {
      fetchCampaignById(id);
      fetchPublicDonations(id, 1, 10);
    }
  }, [id, fetchCampaignById, fetchPublicDonations]);

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    const selectedReward = currentCampaign?.rewards.find(
      (reward) => reward.id === tierId,
    );
    if (selectedReward) setPledgeAmount(selectedReward.amount.toString());
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

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const fundraiserName =
    currentCampaign?.fundraiser?.profile?.name ||
    currentCampaign?.fundraiser?.name;
  const fundraiserCurrency =
    currentCampaign?.fundraiser?.currency_symbol ||
    currentCampaign?.fundraiser?.currency?.toUpperCase();

  if (loading) return <SingleCampaignLoader />;

  return (
    <div className="w-full max-w-7xl mx-auto  bg-white dark:bg-gray-800">
      <div className="px-4 sm:px-6 mt-3 lg:px-8 py-8">
        {/* Horizontal Tabs */}
        <div className="relative">
          <div className="flex items-center mb-6">
            <button
              onClick={() => scrollTabs('left')}
              className="absolute left-0 z-10 bg-white shadow-md p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <div
              ref={tabsRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide whitespace-nowrap mx-12"
            >
              {['details', 'donate', 'updates', 'comments', 'backers'].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-semibold ${
                      selectedTab === tab
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setSelectedTab(tab as any)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => scrollTabs('right')}
              className="absolute right-0 z-10 bg-white shadow-md p-2 rounded-full"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'details' && (
          <div className="max-w-3xl">
            {/* Campaign Title */}
            <h1 className="text-4xl font-bold mb-4">
              {currentCampaign?.title}
            </h1>
            {/* Campaign Image */}
            <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4">
              <Image
                src={currentCampaign?.media || '/bantuhive.svg'}
                alt="fundraising thumbnail"
                loading="eager"
                layout="fill"
                objectFit="cover"
              />
            </div>
            {/* Progress Ring */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Progress Info */}
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                  Campaign Progress
                </h3>
                <div className="w-full flex justify-between gap-3 items-center text-xl py-2">
                  <div className="font-medium">
                    {fundraiserCurrency}
                    {parseFloat(
                      currentCampaign?.transferred_amount || '0.0',
                    ).toLocaleString()}
                  </div>
                  <div className="flex justify-between gap-3 items-center text-gray-600 dark:text-gray-400">
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <strong>{currentCampaign?.total_donors || 0}</strong> Backers
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <strong>{currentCampaign?.remaining_days || 0}</strong> days
                  left
                </p>
              </div>
              {/* Progress Ring */}
              <div className="flex justify-center sm:justify-end">
                <ProgressRing
                  value={Math.round(
                    (Number(currentCampaign?.transferred_amount || 0) /
                      Number(currentCampaign?.goal_amount || 1)) *
                      100,
                  )}
                  size={120}
                  strokeWidth={10}
                  color="#22c55e"
                />
              </div>
            </div>
            {/* Campaign Description */}
            <div
              dangerouslySetInnerHTML={{
                __html: currentCampaign?.description?.body || '',
              }}
            />
            {/* Combined Share and Fundraiser Info Container */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              {/* Share Section */}
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  Share this fundraiser
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={handleShare}
                    className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    <FaShare className="mr-2" /> Share
                  </Button>
                  <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    {copyButtonText}
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>

              {/* Fundraiser Info Section */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-xs italic text-gray-500 dark:text-gray-400">
                  Fundraiser:
                </div>
                <Avatar name={String(fundraiserName)} size="md" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {fundraiserName}
                </h3>
              </div>

              {/* Fundraiser Description */}
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentCampaign?.fundraiser?.profile?.description ||
                  'No description provided.'}
              </div>
            </div>
          </div>
        )}
        {selectedTab === 'donate' && (
          <div className="max-w-xl">
            <RewardSelection
              rewards={currentCampaign?.rewards || []}
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
              pledgeAmount={pledgeAmount}
              setPledgeAmount={setPledgeAmount}
              billingFrequency={billingFrequency}
              setBillingFrequency={setBillingFrequency}
            />
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
        )}

        {selectedTab === 'updates' && (
          <div className="max-w-xl">
            <FundraiserUpdates
              updates={currentCampaign?.updates || []}
              fundraiserName={fundraiserName}
            />
          </div>
        )}

        {selectedTab === 'comments' && (
          <div className="max-w-xl">
            <CommentsSection campaignId={String(currentCampaign?.id)} />
          </div>
        )}

        {selectedTab === 'backers' && (
          <div className="max-w-xl">
          <h3 className="text-2xl font-bold mb-6">Backer List</h3>
          <DonationList
            donations={donations}
            fundraiserCurrency={fundraiserCurrency}
          />
        </div>
        )}
      </div>
    </div>
  );
};

export default SingleCampaignPage;
