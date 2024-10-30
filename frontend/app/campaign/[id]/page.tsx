'use client';
import React, { useEffect, useState } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useCampaignContext } from '@/app/context/account/campaign/CampaignsContext';
import { useParams } from 'next/navigation';
import { FaInfoCircle, FaShare } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';
import { Tooltip } from 'react-tooltip';
import { SingleCampaignResponseDataType } from '@/app/types/campaigns.types';

const SingleCampaignPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [billingFrequency, setBillingFrequency] = useState<string>('once');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shortenedCurrentUrl, setShortenedCurrentUrl] = useState<string>('');
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] =
    useState<SingleCampaignResponseDataType | null>(null);
  const { id } = useParams() as { id: string }; // Assuming slug contains the ID
  const { fetchCampaignById } = useCampaignContext(); // Assuming this function exists

  useEffect(() => {
    if (id) {
      fetchCampaignById(id)
        .then((data: SingleCampaignResponseDataType) => {
          setCampaignData(data);
        })
        .catch((error) => {
          console.error('Error fetching campaign data:', error);
          // Handle error (e.g., set an error state)
        });
    }
  }, [id, fetchCampaignById]);

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    const selectedReward = campaignData?.rewards.find(
      (reward) => reward.id === tierId,
    );
    if (selectedReward) {
      setPledgeAmount(selectedReward.amount.toString());
    }
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pledge submitted:', {
      selectedTier,
      pledgeAmount,
      billingFrequency,
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const toggleCommentsVisibility = () => {
    setAreCommentsVisible(!areCommentsVisible);
  };

  useEffect(() => {
    const url = window.location.href;
    setCurrentUrl(url);
    setShortenedCurrentUrl(shortenUrl(url));
  }, []);

  const shortenUrl = (url: string): string => {
    return url.length > 80 ? `${url.substring(0, 75)}...` : url;
  };

  const copyShareableUrl = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopyButtonText('Copied');
    setTimeout(() => setCopyButtonText('Copy'), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Fundraising Details - ${campaignData?.title}`,
          text: `Check out my fundraising details for ${campaignData?.description}`,
          url: window.location.href,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => setError('Error sharing fundraising details'));
    } else {
      setError('Sharing is not supported on this device');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Middle Column: Campaign Details */}
        <div className="order-1 lg:col-span-1 overflow-y-auto max-h-100">
          <h1 className="text-4xl font-bold mb-4">{campaignData?.title}</h1>
          {/* <p className="text-gray-600 mb-6">{campaignData?.description}</p> */}
          <div className="mb-8 relative">
            <img
              src={campaignData?.media}
              alt="Campaign Media"
              className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
            />
          </div>

          {/* Progress Bar and Stats */}
          <div className="bg-white rounded-lg shadow-md py-6 px-2 mb-8">
            <div className="w-full flex flex-col gap-2 items-center mb-4">
              <div className="w-full flex justify-start gap-2 mb-4 md:mb-0">
                <div className="text-2xl font-bold">
                  ${campaignData?.current_amount?.toLocaleString()}
                </div>
                <div className="text-gray-600">
                  {' '}
                  raised of ${campaignData?.goal_amount?.toLocaleString()} goal
                </div>
              </div>
              <div className="w-full flex justify-start gap-2 mb-4 md:mb-0">
                {/* <div className="text-2xl font-bold">{campaignData.backers}</div> */}
                <div className="text-gray-600">backers</div>
              </div>
              <div className="w-full flex gap-2">
                {/* <div className="text-2xl font-bold">
                  {campaignData.daysLeft}
                </div> */}
                <div className="text-gray-600">days left</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${campaignData ? (Number(campaignData.current_amount) / Number(campaignData.goal_amount)) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div
              className="text-gray-800 dark:text-neutral-200 flex-grow"
              dangerouslySetInnerHTML={{
                __html: campaignData?.description?.body || '',
              }}
            />
          </div>
        </div>

        {/* Left Column: Donation and Rewards */}
        <div className="order-3 sticky top-4 h-fit">
          <h2 className="text-2xl font-bold mb-4 w-full">Updates</h2>
          {/* Campaign Updates */}
          <div className="mb-8 w-full">
            {campaignData?.updates?.map((update) => (
              <div
                key={update?.id}
                className="bg-white rounded-sm shadow p-4 mb-4"
              >
                <div className="font-semibold text-gray-600 mb-2">
                  {update?.date}
                </div>
                <p>{update?.content}</p>
              </div>
            ))}
          </div>
          {/* Share this campaign */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Share this campaign</h2>
            <div className="flex flex-wrap items-center mb-4">
              <Button onClick={handleShare} className="mr-4">
                <FaShare className="mr-2" /> Share
              </Button>
              <button
                className="bg-gray-200 rounded-md px-4 py-2"
                onClick={copyShareableUrl}
              >
                {copyButtonText}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Comments ({campaignData?.comments?.length})
              </h2>
              <button
                onClick={toggleCommentsVisibility}
                className="text-red-500"
              >
                {areCommentsVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            {areCommentsVisible && (
              <div className="max-h-96 overflow-y-auto">
                {campaignData?.comments?.map((comment) => (
                  <div key={comment?.id} className="border-b py-2">
                    <p className="font-semibold">{comment?.user}</p>
                    <p className="text-gray-600">{comment?.content}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                className="w-full border rounded-md p-2"
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-2 bg-gray-500 text-white rounded-md px-4 py-2"
              >
                Submit Comment
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sticky Rewards */}
        <div className="order-2 lg:col-span-1 ">
          <div className="bg-white rounded-lg shadow-md px-6 mb-20 pb-10">
            <h2 className="text-2xl font-bold mb-4">Select a Reward</h2>
            <div className="max-h-96 overflow-y-auto px-4 mb-4 [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
              {campaignData?.rewards?.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-md p-4 mb-4 cursor-pointer transition duration-300 ${selectedTier === reward.id ? 'border-gray-500 bg-indigo-50' : 'hover:border-indigo-300'}`}
                  onClick={() => handleTierSelect(reward?.id)}
                >
                  <h3 className="font-bold mb-2">{reward?.title}</h3>
                  <p className="text-gray-600 mb-2">{reward?.description}</p>
                  <div className="font-semibold">
                    Pledge ${reward?.amount} or more
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handlePledgeSubmit} className="mb-4 relative">
              <FaInfoCircle
                data-tooltip-id="amount-info"
                data-tooltip-content="Enter the amount you want to pledge. You will be charged this amount during payment. If you do not want any reward just enter the amount you want to donate and choose backing period to proceed."
                className="absolute top-0 left-0 text-gray-500"
              />
              <Tooltip
                id="amount-info"
                className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded"
              />
              <input
                type="number"
                className="w-full p-2 border rounded-md mb-4 mt-2"
                placeholder="Enter pledge amount"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                required
              />

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Choose Backing Period</h3>
                <RadioGroup
                  value={billingFrequency}
                  onValueChange={setBillingFrequency}
                >
                  <div className="flex gap-1 items-center">
                    <RadioGroupItem value="once" id="once" className="mr-2" />
                    <label htmlFor="daily">One-Time</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioGroupItem value="daily" id="daily" className="mr-2" />
                    <label htmlFor="daily">Daily</label>
                  </div>

                  <div className="flex gap-1 items-center">
                    <RadioGroupItem
                      value="weekly"
                      id="weekly"
                      className="mr-2"
                    />
                    <label htmlFor="weekly">Weekly</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioGroupItem
                      value="monthly"
                      id="monthly"
                      className="mr-2"
                    />
                    <label htmlFor="monthly">Monthly</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <RadioGroupItem
                      value="yearly"
                      id="yearly"
                      className="mr-2"
                    />
                    <label htmlFor="yearly">Yearly</label>
                  </div>
                </RadioGroup>
              </div>
            </form>
            <div className="w-full">
              <DonationButton
                selectedTier={selectedTier}
                pledgeAmount={pledgeAmount}
                billingFrequency={billingFrequency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCampaignPage;
