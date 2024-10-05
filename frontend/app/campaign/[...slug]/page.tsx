'use client';
import React, { useEffect, useState } from 'react';
import DonationButton from '@/app/components/donate/DonationButton';
import { useParams } from 'next/navigation';

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

const SingleCampaignPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [shortenedCurrentUrl, setShortenedCurrentUrl] = useState<string>('');
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);
  const params = useParams();
  const { slug } = params; // slug will be an array of the URL segments

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
        description: 'Get six eco-bottles and a branded tote bag',
        amount: 120,
      },
      {
        id: 5,
        title: 'Sustainability Champion',
        description:
          'Get ten eco-bottles, a branded tote bag, and a personalized thank you note',
        amount: 200,
      },
    ],
    updates: [
      {
        id: 1,
        date: '2023-06-15',
        content:
          "We've reached 50% of our goal! Thank you all for your support!",
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
      isRecurring,
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const toggleCommentsVisibility = () => {
    setAreCommentsVisible(!areCommentsVisible); // Toggle comments visibility
  };

  useEffect(() => {
    const url = window.location.href; // Current URL to share
    setCurrentUrl(url);
    setShortenedCurrentUrl(shortenUrl(url));
  }, []);

  const shortenUrl = (url: string): string => {
    return url.length > 80 ? `${url.substring(0, 75)}...` : url;
  };

  const copyShareableUrl = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopyButtonText('Copied');
    setTimeout(() => setCopyButtonText('Copy'), 2000); // Reset text after 2 seconds
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{campaignData.title}</h1>
          <p className="text-gray-600 mb-6">{campaignData.description}</p>

          <div className="mb-8 relative">
            <img
              src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Eco-Friendly Water Bottle"
              className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
            />
          </div>

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

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Campaign Updates</h2>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Share this campaign</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                readOnly
                value={shortenedCurrentUrl}
                className="flex-grow p-2 border border-gray-100 focus-visible:outline-none focus:outline-none border-1 rounded-md mr-2"
              />
              <button
                onClick={copyShareableUrl}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                {copyButtonText}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Select a Reward</h2>
            <div className="max-h-96 overflow-y-auto mb-4">
              {campaignData.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-md p-4 mb-4 cursor-pointer transition duration-300 ${selectedTier === reward.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
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
            <form onSubmit={handlePledgeSubmit}>
              <input
                type="number"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter pledge amount"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                required
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="recurring"
                  className="mr-2"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label htmlFor="recurring">
                  {isRecurring
                    ? 'Back this campaign monthly for 3 months'
                    : 'Back once'}
                </label>
              </div>
              <DonationButton />
            </form>
          </div>
        </div>
      </div>

      {/* Button to toggle comments visibility */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <button
          onClick={toggleCommentsVisibility}
          className="text-blue-600 hover:underline"
        >
          {areCommentsVisible ? 'Hide Comments' : 'View Comments'}
        </button>
      </div>

      {/* Comments section */}
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
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Post Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SingleCampaignPage;
