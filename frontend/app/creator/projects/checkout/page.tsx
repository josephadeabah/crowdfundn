'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';
import Image from 'next/image';
import { FaTrashAlt, FaPlus } from 'react-icons/fa'; // Import icons

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image?: string;
}

const CheckoutPageContent = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<{
    selectedRewards: Reward[];
    allRewards: Reward[];
  } | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      setData(JSON.parse(decodeURIComponent(dataParam)));
    }
  }, [searchParams]);

  // Function to add a reward to the selected rewards
  const addReward = (reward: Reward) => {
    if (data) {
      setData({
        ...data,
        selectedRewards: [...data.selectedRewards, reward],
      });
    }
  };

  // Function to remove a reward from the selected rewards
  const removeReward = (rewardId: number) => {
    if (data) {
      setData({
        ...data,
        selectedRewards: data.selectedRewards.filter(
          (reward) => reward.id !== rewardId,
        ),
      });
    }
  };

  // Calculate the total amount of selected rewards
  const totalAmount = data
    ? data.selectedRewards.reduce(
        (sum, reward) => sum + Number(reward.amount),
        0,
      )
    : 0;

  // Format the total amount to two decimal places
  const formattedTotalAmount = totalAmount.toFixed(2);

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-100 p-8 mb-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Selected Rewards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selected Rewards</h2>
        {data?.selectedRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white p-4 rounded-lg shadow mb-4 relative"
          >
            <div className="flex items-start gap-4">
              {/* Reward Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={reward.image || '/bantuhive.svg'}
                  alt={reward.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Reward Details */}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{reward.title}</h3>
                <p className="text-gray-600">{reward.description}</p>
              </div>

              {/* Amount */}
              <div className="font-semibold text-green-600">
                ${reward.amount}
              </div>
            </div>

            {/* Remove Button (Bottom Right) */}
            <button
              onClick={() => removeReward(reward.id)}
              className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
            >
              <FaTrashAlt size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Total</h3>
          <div className="font-semibold text-green-600">
            ${formattedTotalAmount}
          </div>
        </div>
      </div>

      {/* Other Rewards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          You can add other rewards
        </h2>
        {data?.allRewards
          .filter(
            (reward) => !data?.selectedRewards.some((r) => r.id === reward.id),
          )
          .map((reward) => (
            <div
              key={reward.id}
              className="bg-white p-4 rounded-lg shadow mb-4 relative"
            >
              <div className="flex items-start gap-4">
                {/* Reward Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={reward.image || '/bantuhive.svg'}
                    alt={reward.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                {/* Reward Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{reward.title}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                </div>

                {/* Amount */}
                <div className="font-semibold text-green-600">
                  ${reward.amount}
                </div>
              </div>

              {/* Add Button (Bottom Right) */}
              <button
                onClick={() => addReward(reward)}
                className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200"
              >
                <FaPlus size={20} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <CheckoutPageContent />
    </Suspense>
  );
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default CheckoutPage;
