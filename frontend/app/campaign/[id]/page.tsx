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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DonationsChart from '../DonationsChart';
import { deslugify } from '@/app/utils/helpers/categories';
import Link from 'next/link';

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
  const {
    currentCampaign,
    campaignShares,
    fetchCampaignById,
    shareCampaign,
    loading,
  } = useCampaignContext();
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

  const handleShare = () => {
    const currentUrl = window.location.href;
    const campaignTitle = currentCampaign?.title || 'Fundraising Campaign';
    const rawDescription = currentCampaign?.description?.body
      ? stripHtmlTags(currentCampaign.description.body)
      : '';
    const campaignDescription = truncateText(rawDescription, 100); // Limit to 100 characters

    if (navigator.share) {
      return navigator
        .share({
          title: `Fundraising Details - ${campaignTitle}`,
          text: `Check out my fundraising details for "${campaignTitle}": ${campaignDescription}`,
          url: currentUrl,
        })
        .then(() => {
          // Call the backend to record the share
          shareCampaign(String(currentCampaign?.id))
            .then((response) => {
              // Handle success (e.g., update UI with new share count)
            })
            .catch((error) => {
              // Handle error - display error message from API
              alert(error.error);
            });
        })
        .catch((error) => {
          setError('Error sharing fundraising details');
        });
    } else {
      return navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setCopyButtonText('Copied');
          setTimeout(() => setCopyButtonText('Copy'), 2000);
        })
        .catch(() => {
          setError('Error copying the link');
        });
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
    <div className="max-w-7xl mx-auto px-2 py-8 mb-12">
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* First Column (Bigger Width) */}
        <div className="lg:w-2/3">
          {/* Content for the first column */}
          <div className="bg-white p-2 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">
              {currentCampaign?.title}
            </h1>
            {/* Add more content here */}
            <div className="h-[600px]">
              {' '}
              {/* Parent with defined height */}
              <div className="relative w-full h-full rounded-md overflow-hidden mb-4">
                <Image
                  src={currentCampaign?.media || '/bantuhive.svg'}
                  alt="fundraising thumbnail"
                  loading="eager"
                  layout="fill"
                  objectFit="cover"
                  className="h-full"
                  quality={100} // Ensures maximum image quality
                  priority // Ensures the image is prioritized for loading
                />
              </div>
            </div>
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
                  className="flex overflow-x-auto scrollbar-hide whitespace-nowrap"
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
              <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
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
                        <FaShare className="mr-2" />{' '}
                        {currentCampaign?.total_shares || 0} Shares
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
                    <Avatar
                      name={fundraiserName as string}
                      size="md"
                      imageUrl={currentCampaign?.fundraiser?.profile?.avatar}
                    />
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
              <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
                <RewardSelection
                  rewards={currentCampaign?.rewards || []}
                  selectedTier={selectedTier}
                  onTierSelect={handleTierSelect}
                  pledgeAmount={pledgeAmount}
                  setPledgeAmount={setPledgeAmount}
                  billingFrequency={billingFrequency}
                  setBillingFrequency={setBillingFrequency}
                />
              </div>
            )}

            {selectedTab === 'updates' && (
              <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
                <FundraiserUpdates
                  updates={currentCampaign?.updates || []}
                  fundraiserName={fundraiserName}
                />
              </div>
            )}

            {selectedTab === 'comments' && (
              <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
                <CommentsSection campaignId={String(currentCampaign?.id)} />
              </div>
            )}

            {selectedTab === 'backers' && (
              <div className="bg-white dark:bg-gray-800 mx-auto px-2 py-6">
                <h3 className="text-2xl font-bold mb-6">Backers</h3>
                <DonationList
                  donations={donations}
                  fundraiserCurrency={fundraiserCurrency}
                  campaignId={String(currentCampaign?.id)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Second Column (Smaller Width and Sticky) */}
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            {/* Content for the second column */}
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Support This Project
              </h2>
              <p className="text-gray-700 mb-4">
                Help us reach our goal by contributing to this project.
              </p>
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
              {/* Add more content here */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                  Campaign Progress
                </h3>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow mb-8 p-2 space-y-6 sm:space-y-0 sm:space-x-6">
                  {/* Progress Info */}
                  <div className="text-center sm:text-left">
                    <div className="w-full flex lg:flex-col sm:justify-between gap-3 items-center text-xl py-2">
                      <div className="font-medium text-sm">
                        <span
                          className={`${
                            parseFloat(
                              currentCampaign?.transferred_amount?.toString() ||
                                '0',
                            ) >=
                            parseFloat(
                              currentCampaign?.goal_amount?.toString() || '0',
                            )
                              ? 'text-green-600'
                              : 'text-orange-500'
                          }`}
                        >
                          <span className="text-gray-600 dark:text-gray-100 mr-1">
                            {fundraiserCurrency}
                          </span>
                          {parseFloat(
                            currentCampaign?.transferred_amount?.toString() ||
                              '0',
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
                            currentCampaign?.goal_amount || '0.0',
                          ).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>Goal</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <strong>{currentCampaign?.total_donors || 0}</strong>{' '}
                      Backers
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <strong>{currentCampaign?.remaining_days || 0}</strong>{' '}
                      days left
                    </p>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                    <ProgressRing
                      value={Math.round(
                        (Number(currentCampaign?.transferred_amount || 0) /
                          Number(currentCampaign?.goal_amount || 1)) *
                          100,
                      )}
                      size={150} // Using relative size
                      strokeWidth={10}
                      color="#22c55e"
                    />
                  </div>
                </div>
                <div className="w-full p-2">
                  Created in:
                  <Link href="/explore/category">
                    <span className="text-lime-500 font-semibold underline">
                    {currentCampaign?.category ? deslugify(currentCampaign.category) : 'Unknown Category'}
                    </span>
                  </Link>
                </div>
              </div>
              <DonationsChart currentCampaign={currentCampaign} />
            </div>
          </div>
        </div>
      </div>
      <SuggestedCampaignsComponent
        currentCategory={currentCampaign?.category}
      />
    </div>
  );
};

export default SingleCampaignPage;
