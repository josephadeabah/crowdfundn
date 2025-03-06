'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { MdError } from 'react-icons/md';
import { generateToken } from '@/app/utils/helpers/jwt.sign'; // Import generateToken
import { FundraiserDetails } from '../selectreward/RewardSelection';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image?: string;
}

interface OrderDetailsPageProps {
  selectedReward: Reward | null;
  rewards: Reward[]; // Pass all rewards to the modal
  fundraiserDetails: FundraiserDetails;
  billingFrequency: string;
  selectedTier: number | null;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  selectedReward,
  rewards,
  fundraiserDetails,
  billingFrequency,
  selectedTier,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedRewards, setSelectedRewards] = useState<Reward[]>(
    selectedReward ? [selectedReward] : [],
  );

  // Function to handle adding/removing rewards
  const handleRewardSelection = (reward: Reward) => {
    if (selectedRewards.some((r) => r.id === reward.id)) {
      // Remove reward if already selected
      setSelectedRewards((prev) => prev.filter((r) => r.id !== reward.id));
    } else {
      // Add reward if not selected
      setSelectedRewards((prev) => [...prev, reward]);
    }
  };

  // Function to handle the "Confirm" button click
  const handleConfirm = async () => {
    const data = {
      selectedRewards,
      allRewards: rewards,
      fundraiser: fundraiserDetails,
      billingFrequency,
      selectedTier,
    };

    // Generate a JWT token for the data
    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET!;
    const token = await generateToken(data, secretKey);

    // Navigate to the checkout page with the encrypted token
    window.location.href = `/creator/projects/checkout?token=${encodeURIComponent(token)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pledge Details
          </h1>
        </div>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <div className="flex items-center">
              <MdError className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section: Selected Reward Details */}
            <div className="lg:w-1/2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Rewards
              </h2>
              {selectedRewards.length > 0 ? (
                selectedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-green-50 p-4 rounded-lg mb-4 shadow-sm hover:shadow-md border-2 border-green-500"
                  >
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={reward.image || '/bantuhive.svg'}
                        alt={reward.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="font-bold text-xl mt-4">{reward.title}</h3>
                    <p className="text-gray-600 mt-2">{reward.description}</p>
                    <div className="font-semibold text-green-600 mt-2">
                      Pledge {fundraiserDetails.campaignCurrency}
                      {reward.amount} or more
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No rewards selected.</p>
              )}
            </div>

            {/* Right Section: Other Rewards */}
            <div className="lg:w-1/2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Other Rewards
              </h2>
              {rewards
                .filter(
                  (reward) => !selectedRewards.some((r) => r.id === reward.id),
                )
                .map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm hover:shadow-md cursor-pointer border-2 border-gray-200 hover:border-gray-300"
                    onClick={() => handleRewardSelection(reward)}
                  >
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={reward.image || '/bantuhive.svg'}
                        alt={reward.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="font-bold text-xl mt-4">{reward.title}</h3>
                    <p className="text-gray-600 mt-2">{reward.description}</p>
                    <div className="font-semibold text-green-600 mt-2">
                      Pledge {fundraiserDetails.campaignCurrency}
                      {reward.amount} or more
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleConfirm}
              className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
