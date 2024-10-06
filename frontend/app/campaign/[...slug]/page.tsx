'use client';
import React, { useEffect, useState } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useParams } from 'next/navigation';
import { FaShare } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
}

interface Update {
  id: number;
  date: string;
  content: string;
}

interface Comment {
  id: number;
  user: string;
  content: string;
}

interface CampaignData {
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  rewards: Reward[];
  updates: Update[];
  comments: Comment[];
}

const campaignData: CampaignData = {
  title: 'Revolutionary Eco-Friendly Water Bottle',
  description:
    "Help us create a sustainable future with our innovative, plastic-free water bottle that's good for you and the planet.",
  goal: 50000,
  raised: 32500,
  backers: 650,
  daysLeft: 15,
  rewards: [
    {
      id: 1,
      title: 'Early Bird',
      description: 'Get one eco-bottle',
      amount: 25,
    },
    {
      id: 2,
      title: 'Double Impact',
      description: 'Get two eco-bottles',
      amount: 45,
    },
    {
      id: 3,
      title: 'Family Pack',
      description: 'Get four eco-bottles',
      amount: 80,
    },
    {
      id: 4,
      title: 'Eco Warrior',
      description: 'Get six eco-bottles and a tote bag',
      amount: 120,
    },
    {
      id: 5,
      title: 'Sustainability Champion',
      description: 'Get ten eco-bottles, a tote bag, and a thank you note',
      amount: 200,
    },
    {
      id: 6,
      title: 'Plastic-Free Hero',
      description: 'Get twenty eco-bottles, a tote bag, and a thank you note',
      amount: 350,
    },
  ],
  updates: [
    {
      id: 1,
      date: '2023-06-15',
      content: "We've reached 50% of our goal! Thank you for your support!",
    },
    {
      id: 2,
      date: '2023-06-10',
      content: 'New stretch goal announced: Customizable bottle colors!',
    },
  ],
  comments: [
    {
      id: 1,
      user: 'EcoWarrior',
      content: 'This is exactly what we need to reduce plastic waste!',
    },
    {
      id: 2,
      user: 'HydrationFan',
      content: "Can't wait to get my hands on one of these bottles!",
    },
    {
      id: 3,
      user: 'GreenLiving',
      content: 'I love the concept! How long does each bottle last?',
    },
    {
      id: 4,
      user: 'ZeroWaste',
      content: 'This is a game-changer for reducing single-use plastics!',
    },
    {
      id: 5,
      user: 'EarthFirst',
      content: 'Kudos to the team for this innovative solution!',
    },
  ],
};

const SingleCampaignPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [billingFrequency, setBillingFrequency] = useState<string>('once');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [shortenedCurrentUrl, setShortenedCurrentUrl] = useState<string>('');
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { slug } = params; // slug will be an array of the URL segments

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    const selectedReward = campaignData.rewards.find(
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
          title: `Order Details - ${campaignData.title}`,
          text: `Check out my order details for ${campaignData.description}`,
          url: window.location.href,
        })
        .catch((error) => setError('Error sharing order details'));
    } else {
      setError('Sharing is not supported on this device');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Campaign Details */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{campaignData.title}</h1>
          <p className="text-gray-600 mb-6">{campaignData.description}</p>
          <div className="mb-8 relative">
            <img
              src="https://images.unsplash.com/photo-1612982593698-9306c03d00ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Eco-Friendly Water Bottle"
              className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
            />
          </div>

          {/* Progress Bar and Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-3xl font-bold">
                  ${campaignData.raised.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-2">
                  {' '}
                  raised of ${campaignData.goal.toLocaleString()} goal
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{campaignData.backers}</div>
                <div className="text-gray-600">backers</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {campaignData.daysLeft}
                </div>
                <div className="text-gray-600">days left</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${(campaignData.raised / campaignData.goal) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex items-center py-5 w-full">
            <h2 className="text-2xl font-bold mb-4 w-full">Updates</h2>
            <div className="w-full">
              <DonationButton
                selectedTier={selectedTier}
                pledgeAmount={pledgeAmount}
                billingFrequency={billingFrequency}
              />
            </div>
          </div>
          {/* Campaign Updates */}
          <div className="mb-8 w-full">
            {campaignData.updates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-sm shadow p-4 mb-4"
              >
                <div className="font-semibold text-gray-600 mb-2">
                  {update.date}
                </div>
                <p>{update.content}</p>
              </div>
            ))}
          </div>

          {/* Share this campaign */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Share this campaign</h2>
            <div className="flex flex-wrap items-center mb-4 gap-3">
              <div className="flex flex-grow gap-1">
                <input
                  type="text"
                  readOnly
                  value={shortenedCurrentUrl}
                  className="flex-grow p-2 border border-gray-100 focus-visible:outline-none rounded-md"
                />
                <button
                  onClick={copyShareableUrl}
                  className={`${copyButtonText === 'Copied' ? 'bg-gray-400' : 'bg-gray-700'} text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-100 ml-2`}
                >
                  {copyButtonText}
                </button>
              </div>
              <button
                onClick={handleShare}
                className="bg-black hover:bg-gray-600 w-full dark:bg-gray-950 dark:text-gray-50 text-white font-bold py-2 px-4 justify-center rounded inline-flex items-center"
                aria-label="Share order details"
              >
                <FaShare className="mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Donation and Rewards */}
        <div className="sticky top-4 h-fit">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Select a Reward</h2>
            <div className="max-h-96 overflow-y-auto px-4 mb-4">
              {campaignData.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-md p-4 mb-4 cursor-pointer transition duration-300 ${selectedTier === reward.id ? 'border-gray-500 bg-indigo-50' : 'hover:border-indigo-300'}`}
                  onClick={() => handleTierSelect(reward.id)}
                >
                  <h3 className="font-bold mb-2">{reward.title}</h3>
                  <p className="text-gray-600 mb-2">{reward.description}</p>
                  <div className="font-semibold">
                    Pledge ${reward.amount} or more
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handlePledgeSubmit} className="mb-4">
              <input
                type="number"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter pledge amount"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                required
              />
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Choose Billing Cycle</h3>
                <RadioGroup
                  value={billingFrequency}
                  onValueChange={setBillingFrequency}
                >
                  <RadioGroupItem value="daily" id="daily" className="mr-2" />
                  <label htmlFor="daily">Daily</label>
                  <RadioGroupItem value="weekly" id="weekly" className="mr-2" />
                  <label htmlFor="weekly">Weekly</label>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="mr-2"
                  />
                  <label htmlFor="monthly">Monthly</label>
                  <RadioGroupItem value="yearly" id="yearly" className="mr-2" />
                  <label htmlFor="yearly">Yearly</label>
                </RadioGroup>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleCommentsVisibility}
            className="hover:no-underline focus:outline-none"
          >
            <h2 className="text-2xl font-bold">
              {areCommentsVisible ? 'Hide Comments' : 'View Comments'}
            </h2>
          </button>
        </div>

        {areCommentsVisible && (
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full h-1/2 overflow-y-auto">
            <div className="space-y-4 mb-4">
              {campaignData.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100 rounded-lg p-4">
                  <div className="font-semibold mb-2">{comment.user}</div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
              >
                Post Comment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCampaignPage;
