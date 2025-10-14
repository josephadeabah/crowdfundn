'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import BackingPeriodSelector from '../billingfrequency/BackingPeriodSelector';
import Modal from '../modal/Modal';
import OrderDetailsPage from '../orderdetails/OrderDetails';
import { Reward } from '@/app/context/account/rewards/RewardsContext';

export interface FundraiserDetails {
  id: string;
  campaignId: string;
  campaignTitle?: string;
  campaignCurrency?: string;
}

interface RewardSelectionProps {
  rewards: Reward[];
  selectedTier: number | null;
  onTierSelect: (tierId: number) => void;
  pledgeAmount: string;
  setPledgeAmount: (amount: string) => void;
  billingFrequency: string;
  setBillingFrequency: (frequency: string) => void;
  fundraiserDetails: FundraiserDetails;
  isEquityCampaign: boolean;
}

const RewardSelection: React.FC<RewardSelectionProps> = ({
  rewards,
  selectedTier,
  onTierSelect,
  pledgeAmount,
  setPledgeAmount,
  billingFrequency,
  setBillingFrequency,
  fundraiserDetails,
  isEquityCampaign,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleChooseReward = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Select a Reward</h2>
      
      {/* Rewards Grid */}
      <div className="h-full py-4">
        {rewards.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedTier === reward.id
                    ? 'border-green-500 shadow-lg bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => onTierSelect(reward.id)}
              >
                {/* Reward Image */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={reward.image || '/bantuhive.svg'}
                    alt="fundraising thumbnail"
                    layout="fill"
                    unoptimized
                    loading="eager"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      e.currentTarget.src = '/bantuhive.svg';
                    }}
                  />
                </div>

                {/* Reward Content */}
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {reward.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-green-600 text-lg">
                      {fundraiserDetails.campaignCurrency}
                      {reward.amount}
                    </div>
                    <span className="text-sm text-gray-500">or more</span>
                  </div>

                  {/* Choose Button */}
                  <button
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseReward(reward);
                    }}
                  >
                    Choose Reward
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-gray-600 text-lg">No rewards available at this time</p>
          </div>
        )}
      </div>

      {/* Support Without Reward Section */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>Support without reward</span>
          <FaInfoCircle
            data-tooltip-id="amount-info"
            data-tooltip-content={
              isEquityCampaign
                ? 'Enter the amount you want to invest and click Invest to proceed. Otherwise choose reward and proceed.'
                : 'If you do not want to pledge with reward, Enter the amount you want to donate and click Support Now to proceed. Otherwise choose reward and proceed. You will be charged this amount during payment.'
            }
            className="text-gray-400 hover:text-gray-600 transition-colors"
          />
        </h4>
        
        <Tooltip
          id="amount-info"
          className="max-w-xs bg-gray-800 text-white text-sm p-3 rounded-xl"
        />

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter amount
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 transition-all duration-200"
              placeholder="Enter pledge amount"
              value={pledgeAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (!isNaN(Number(value)) && Number(value) >= 0) {
                  setPledgeAmount(value);
                }
              }}
              min="0"
              required
            />
            {!isEquityCampaign && (
              <p className="text-sm text-gray-500 mt-2">
                For one-time donation, enter the amount and click Support Now to proceed.
              </p>
            )}
          </div>

          {/* Only show BackingPeriodSelector for non-equity campaigns */}
          {!isEquityCampaign && (
            <BackingPeriodSelector
              billingFrequency={billingFrequency}
              setBillingFrequency={setBillingFrequency}
            />
          )}
        </form>
      </div>

      {/* Modal for Order Details */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xxxlarge"
      >
        <OrderDetailsPage
          selectedReward={selectedReward}
          rewards={rewards}
          fundraiserDetails={fundraiserDetails}
          selectedTier={selectedTier}
          billingFrequency={billingFrequency}
          isEquityCampaign={isEquityCampaign}
        />
      </Modal>
    </>
  );
};

export default RewardSelection;