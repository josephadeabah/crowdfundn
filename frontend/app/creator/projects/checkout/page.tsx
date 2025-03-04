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

  const addReward = (reward: Reward) => {
    if (data) {
      setData({
        ...data,
        selectedRewards: [...data.selectedRewards, reward],
      });
    }
  };

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

  const totalAmount = data
    ? data.selectedRewards.reduce((sum, reward) => sum + reward.amount, 0)
    : 0;

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto h-full bg-gray-100 p-8 overflow-y-auto">
      {' '}
      {/* Ensure vertical scrolling */}
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {/* Selected Rewards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selected Rewards</h2>
        {data.selectedRewards.map((reward) => (
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

              {/* Counter and Amount */}
              <div className="flex flex-col items-end">
                <div className="font-semibold text-green-600">
                  ${reward.amount}
                </div>
              </div>
            </div>

            {/* Remove Icon */}
            <button
              onClick={() => removeReward(reward.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
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
          <div className="font-semibold text-green-600">${totalAmount}</div>
        </div>
      </div>
      {/* Other Rewards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          You can add other rewards
        </h2>
        {data.allRewards
          .filter(
            (reward) => !data.selectedRewards.some((r) => r.id === reward.id),
          )
          .map((reward) => (
            <div
              key={reward.id}
              className="bg-white p-4 rounded-lg shadow mb-4"
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

                {/* Add Icon */}
                <button
                  onClick={() => addReward(reward)}
                  className="mt-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200"
                >
                  <FaPlus size={20} />
                </button>
              </div>
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
