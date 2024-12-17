'use client';
import React, { useEffect, useState, useRef } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useParams } from 'next/navigation';
import { FaShare, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import SingleCampaignLoader from '@/app/loaders/SingleCampaignLoader';
import Avatar from '@/app/components/avatar/Avatar';
import Image from 'next/image';
import { getRemainingDaysMessage } from '@/app/utils/helpers/calculate.days';
import CommentsSection from '@/app/components/comments/CommentSection';
import FundraiserUpdates from '@/app/components/fundraiserupdate/FundraiserUpdates';
import RewardSelection from '@/app/components/selectreward/RewardSelection';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';

const SingleCampaignPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'details' | 'rewards' | 'updates' | 'comments'>('details');
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
    const selectedReward = currentCampaign?.rewards.find(reward => reward.id === tierId);
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

  if (loading) return <SingleCampaignLoader />;

  const fundraiserName = currentCampaign?.fundraiser?.profile?.name || currentCampaign?.fundraiser?.name;
  const fundraiserCurrency =
    currentCampaign?.fundraiser?.currency_symbol || currentCampaign?.fundraiser?.currency?.toUpperCase();

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 lg:px-8 py-8">
        {/* Horizontal Tabs */}
        <div className="relative">
          <div className="flex items-center mb-6">
            <button onClick={() => scrollTabs('left')} className="absolute left-0 z-10 bg-white shadow-md p-2 rounded-full">
              <FaChevronLeft />
            </button>
            <div
              ref={tabsRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide whitespace-nowrap mx-12"
            >
              {['details', 'rewards', 'updates', 'comments'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${
                    selectedTab === tab ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
                  }`}
                  onClick={() => setSelectedTab(tab as any)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => scrollTabs('right')} className="absolute right-0 z-10 bg-white shadow-md p-2 rounded-full">
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'details' && (
          <div>
            <h1 className="text-4xl font-bold mb-4">{currentCampaign?.title}</h1>
            <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4">
              <Image
                src={currentCampaign?.media || '/bantuhive.svg'}
                alt="Campaign thumbnail"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div dangerouslySetInnerHTML={{ __html: currentCampaign?.description?.body || '' }} />
          </div>
        )}

        {selectedTab === 'rewards' && (
          <div>
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
          <div>
            <FundraiserUpdates updates={currentCampaign?.updates || []} fundraiserName={fundraiserName} />
          </div>
        )}

        {selectedTab === 'comments' && (
          <div>
            <CommentsSection comments={currentCampaign?.comments || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCampaignPage;
