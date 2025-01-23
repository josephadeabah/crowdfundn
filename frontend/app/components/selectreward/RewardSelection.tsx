import React from 'react';
import Image from 'next/image';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import BackingPeriodSelector from '../billingfrequency/BackingPeriodSelector';

interface Reward {
  id: number;
  title: string;
  description: string;
  amount: number;
  image?: string;
}

interface RewardSelectionProps {
  rewards: Reward[];
  selectedTier: number | null;
  onTierSelect: (tierId: number) => void;
  pledgeAmount: string;
  setPledgeAmount: (amount: string) => void;
  billingFrequency: string;
  setBillingFrequency: (frequency: string) => void;
}

const RewardSelection: React.FC<RewardSelectionProps> = ({
  rewards,
  selectedTier,
  onTierSelect,
  pledgeAmount,
  setPledgeAmount,
  billingFrequency,
  setBillingFrequency,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Select a Reward</h2>
      <div className="max-h-96 overflow-y-auto py-4 [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        {rewards.length ? (
          rewards.map((reward) => (
            <div
              key={reward.id}
              className={`border rounded-md p-4 mb-4 cursor-pointer transition duration-300 ${
                selectedTier === reward.id
                  ? 'border-green-500 text-gray-700 bg-green-400'
                  : 'hover:border-orange-300'
              }`}
              onClick={() => onTierSelect(reward.id)}
            >
              <div className="relative w-full h-fit aspect-square rounded overflow-hidden">
                <Image
                  src={reward.image || '/bantuhive.svg'}
                  alt="fundraising thumbnail"
                  layout="fill"
                  loading="eager"
                  objectFit="cover"
                />
              </div>
              <h3 className="font-bold mb-2">{reward.title}</h3>
              <p className="text-gray-600 mb-2">{reward.description}</p>
              <div className="font-semibold">
                Pledge ${reward.amount} or more
              </div>
            </div>
          ))
        ) : (
          <div>No rewards on this fundraising at this time.</div>
        )}
      </div>
      <form className="mb-4 relative">
        <FaInfoCircle
          data-tooltip-id="amount-info"
          data-tooltip-content="Enter the amount you want to pledge. You will be charged this amount during payment. Choose backing period to proceed."
          className="absolute top-0 left-0 text-gray-500"
        />
        <Tooltip
          id="amount-info"
          className="max-w-xs bg-gray-800 text-white text-sm p-2 rounded"
        />
        <div className="py-1">
          <input
            type="number"
            className="mt-2 bm-4 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            placeholder="Enter pledge amount"
            value={pledgeAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(Number(value)) && Number(value) >= 0) {
                setPledgeAmount(value);
              }
            }}
            min="0" // Prevent negative numbers from being entered
            required
          />
        </div>
        {/* Assuming BackingPeriodSelector is another reusable component */}
        <BackingPeriodSelector
          billingFrequency={billingFrequency}
          setBillingFrequency={setBillingFrequency}
        />
      </form>
    </>
  );
};

export default RewardSelection;
