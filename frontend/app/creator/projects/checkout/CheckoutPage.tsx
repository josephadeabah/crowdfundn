'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image?: string;
}

const CheckoutPage = () => {
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selected Rewards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Selected Rewards</h2>
          {data.selectedRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              <h3 className="font-bold text-lg">{reward.title}</h3>
              <p className="text-gray-600">{reward.description}</p>
              <div className="font-semibold text-green-600">
                Pledge ${reward.amount} or more
              </div>
            </div>
          ))}
        </div>

        {/* Other Rewards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Other Rewards</h2>
          {data.allRewards
            .filter(
              (reward) => !data.selectedRewards.some((r) => r.id === reward.id),
            )
            .map((reward) => (
              <div
                key={reward.id}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <h3 className="font-bold text-lg">{reward.title}</h3>
                <p className="text-gray-600">{reward.description}</p>
                <div className="font-semibold text-green-600">
                  Pledge ${reward.amount} or more
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
