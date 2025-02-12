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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="flex flex-col lg:flex-row gap-8">
    {/* First Column (Bigger Width) */}
    <div className="lg:w-2/3">
      {/* Content for the first column */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Crowdfunding Project Title</h1>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        {/* Add more content here */}
        <div className="h-96 bg-gray-200 mb-4"></div>
        <div className="h-96 bg-gray-200 mb-4"></div>
        <div className="h-96 bg-gray-200 mb-4"></div>
      </div>
    </div>

    {/* Second Column (Smaller Width and Sticky) */}
    <div className="lg:w-1/3">
      <div className="sticky top-8">
        {/* Content for the second column */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Support This Project</h2>
          <p className="text-gray-700 mb-4">
            Help us reach our goal by contributing to this project.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            Donate Now
          </button>
          {/* Add more content here */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Project Details</h3>
            <ul className="text-gray-700">
              <li className="mb-2">Goal: $10,000</li>
              <li className="mb-2">Raised: $5,000</li>
              <li className="mb-2">Backers: 200</li>
              <li className="mb-2">Days Left: 30</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default SingleCampaignPage;
