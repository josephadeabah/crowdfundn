import { Reward } from '@/app/types/campaigns.types';
import React from 'react';
import { FiTrash } from 'react-icons/fi'; // Import the trash icon

const RewardCard = ({
  reward,
  campaignId,
  onDelete,
}: {
  reward: Reward;
  campaignId: string;
  onDelete: (campaignId: string, rewardId: number) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img
        src={reward.image}
        alt={reward.title}
        className="w-full h-48 object-cover"
      />
      <div className="flex flex-col flex-grow p-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex-grow">
          {reward.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
          {reward.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-green-600 dark:text-green-400 font-bold">
            ${reward.amount}
          </span>
          <button
            onClick={() => onDelete(campaignId, reward.id)}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <FiTrash className="mr-1" /> {/* Add the trash icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
