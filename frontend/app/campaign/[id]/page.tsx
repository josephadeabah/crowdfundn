'use client';
import React, { useEffect, useState, useRef } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useParams } from 'next/navigation';
import { FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import SingleCampaignLoader from '@/app/loaders/SingleCampaignLoader';
import Avatar from '@/app/components/avatar/Avatar';
import Image from 'next/image';
import CommentsSection from '@/app/components/comments/CommentSection';
import FundraiserUpdates from '@/app/components/fundraiserupdate/FundraiserUpdates';
import RewardSelection from '@/app/components/selectreward/RewardSelection';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ProgressRing from '@/app/components/ring/ProgressRing';
import DonationList from '@/app/components/backerlist/DonationList';
import SuggestedCampaignsComponent from '@/app/components/suggestedCampaigns/SuggestedCampaigns';


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

  const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const campaignTitle = currentCampaign?.title || 'Fundraising Campaign';
    const rawDescription = currentCampaign?.description?.body
      ? stripHtmlTags(currentCampaign.description.body)
      : '';
    const campaignDescription = truncateText(rawDescription, 100); // Limit to 100 characters

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Fundraising Details - ${campaignTitle}`,
          text: `Check out my fundraising details for "${campaignTitle}": ${campaignDescription}`,
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

  const handleCopy = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopyButtonText('Copied');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    } catch {
      setError('Error copying the link');
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
    <>
      <head>
        <title>{String(currentCampaign?.title) || "Support this amazing campaign!"}</title>
        <meta
          name="description"
          content={String(currentCampaign?.description?.body) || "Support this amazing campaign!"}
        />
        <meta property="og:title" content={String(currentCampaign?.title) || "Support this amazing campaign!"} />
        <meta
          property="og:description"
          content={String(currentCampaign?.description?.body) || "Support this amazing campaign!"}
        />
        <meta
          property="og:image"
          content={String(currentCampaign?.media) || '/bantuhive.svg'}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Campaign',
            name: String(currentCampaign?.title) || "Support this amazing campaign!",
            description: String(currentCampaign?.description?.body) || "Support this amazing campaign!",
            image: String(currentCampaign?.media) || '/bantuhive.svg',
            currency: String(currentCampaign?.currency) || "Support this amazing campaign!",
            goalAmount: String(currentCampaign?.goal_amount) || "Support this amazing campaign!",
            raisedAmount: String(currentCampaign?.transferred_amount) || "Support this amazing campaign!",
            remainingDays: String(currentCampaign?.remaining_days) || "Support this amazing campaign!",
          })}
        </script>
      </head>
      <div className="w-full dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 mt-3 py-8">
          {/* Horizontal Tabs */}
          <div className="relative">
            <div className="flex items-center mb-6">
              <button
                onClick={() => scrollTabs('left')}
                className="absolute left-0 z-10 bg-white dark:text-gray-100 shadow-md p-2 rounded-full md:hidden"
              >
                <FaChevronLeft />
              </button>
              <div
                ref={tabsRef}
                className="max-w-7xl mx-auto flex space-x-4 overflow-x-auto scrollbar-hide whitespace-nowrap"
              >
                {['details', 'donate', 'updates', 'comments', 'backers'].map(
                  (tab) => {
                    let count = 0; // Default to 0 for tabs that don't require counts
                    if (tab === 'updates') {
                      count = currentCampaign?.updates?.length || 0;
                    } else if (tab === 'comments') {
                      count = currentCampaign?.comments?.length || 0;
                    } else if (tab === 'backers') {
                      count = currentCampaign?.total_donors || 0;
                    }

                    // Disable "donate" tab if donations are not allowed
                    const isDonateTabDisabled =
                      tab === 'donate' &&
                      !currentCampaign?.permissions?.accept_donations;

                    return (
                      <button
                        key={tab}
                        className={`px-4 py-2 font-semibold ${selectedTab === tab ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'} ${isDonateTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (!isDonateTabDisabled) {
                            setSelectedTab(tab as any);
                          }
                        }}
                        disabled={isDonateTabDisabled} // Disable the button if the "donate" tab is disabled
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}{' '}
                        {count > 0 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({count})
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
              <button
                onClick={() => scrollTabs('right')}
                className="absolute right-0 z-10 bg-white shadow-md p-2 rounded-full md:hidden"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {selectedTab === 'details' && (
            <div className="max-w-xl bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-6 py-6">
              {/* Campaign Title */}
              <h1 className="text-4xl font-bold mb-4">
                {currentCampaign?.title}
              </h1>
              {/* Campaign Image */}
              <div className="relative w-full aspect-video rounded-md overflow-hidden h-full mb-4">
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
                    <strong>{currentCampaign?.total_donors || 0}</strong>{' '}
                    Backers
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
                className="prose dark:prose-dark max-w-none"
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
                    <button
                      onClick={handleCopy}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
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
            <div className="max-w-xl bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-6 py-6">
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
            <div className="max-w-xl bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-6 py-6">
              <FundraiserUpdates
                updates={currentCampaign?.updates || []}
                fundraiserName={fundraiserName}
              />
            </div>
          )}

          {selectedTab === 'comments' && (
            <div className="max-w-xl bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-6 py-6">
              <CommentsSection campaignId={String(currentCampaign?.id)} />
            </div>
          )}

          {selectedTab === 'backers' && (
            <div className="max-w-xl bg-white dark:bg-gray-800 mx-auto px-6 py-6">
              <h3 className="text-2xl font-bold mb-6">Backers</h3>
              <DonationList
                donations={donations}
                fundraiserCurrency={fundraiserCurrency}
                campaignId={String(currentCampaign?.id)}
              />
            </div>
          )}
        </div>
        <SuggestedCampaignsComponent
          currentCategory={currentCampaign?.category}
        />
      </div>
    </>
  );
};

export default SingleCampaignPage;
