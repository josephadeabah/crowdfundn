import React, { useState } from 'react';
import { Button } from '../components/button/Button';
import { HiOutlinePlus } from 'react-icons/hi';
import RewardComponent from '../components/rewards/Rewards';

// Sample donor data
const donorList = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Sam Wilson' },
  { id: 4, name: 'Emily Johnson' },
  { id: 5, name: 'Michael Brown' },
  { id: 6, name: 'Sarah Davis' },
  { id: 7, name: 'David Wilson' },
  { id: 8, name: 'Olivia Taylor' },
  { id: 9, name: 'Daniel Anderson' },
  { id: 10, name: 'Sophia Martinez' },
  { id: 11, name: 'Matthew Harris' },
  { id: 12, name: 'Ava Thompson' },
  { id: 13, name: 'Ethan Jackson' },
  { id: 14, name: 'Isabella Anderson' },
  { id: 15, name: 'Alexander White' },
  { id: 16, name: 'Mia Hall' },
];

// Sample rewards data
const rewardCategories = {
  giftCards: [
    'Trerwendous Gift Card',
    'Amazon.com Gift Card',
    'Target Gift Card',
    'Best Buy Gift Card',
    'Concert Tickets',
    'Movie Tickets',
    'Cinema Tickets',
    'Food and Drink Tickets',
    'Sports Tickets',
    'Event Tickets',
  ],
  prepaidCards: [
    'Virtual Visa',
    'Virtual Visa International',
    'Virtual MasterCard',
    'Tremendous Prepaid Card',
    'Water Bill Cover',
    'Electricity Bill Cover',
    'Gas Bill Cover',
    'Internet Bill Cover',
  ],
  monetaryOptions: [
    'ACH',
    'PayPal',
    'Venmo',
    'Paystack',
    'Wise',
    'Payoneer',
    'Tremendous',
    'Bank Transfer',
    'Mobile Money',
  ],
  charities: [
    'Doctors Without Borders',
    'Clean Water Fund',
    'Clean Energy Fund',
  ],
  materialGifts: [
    'Gifts for Children',
    'Gifts for Women',
    'Gifts for Men',
    'Gifts for Teens',
    'Gifts for Seniors',
    'Gifts for Pets',
  ],
};

// Component
export default function Rewards() {
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [donorRewards, setDonorRewards] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Apply reward to selected donor
  const applyRewardToDonor = () => {
    if (selectedDonor && selectedReward) {
      setDonorRewards((prev) => ({
        ...prev,
        [selectedDonor]: selectedReward,
      }));
      setSelectedReward(null); // Clear reward selection after applying
    }
  };

  // Handle voting for a consistent donor
  const handleVote = (donor: string) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [donor]: (prevVotes[donor] || 0) + 1,
    }));
  };

  return (
    <div className="h-full">
      {/* Donor List Section */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-2 mb-4">
        Donor List
      </h3>
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 h-96 overflow-x-auto overflow-y-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-2 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Donor Name
              </th>
              <th className="py-3 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
            {donorList.map((donor) => (
              <tr key={donor.id}>
                <td className="py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                  {donor.name}
                </td>
                <td className="py-4 flex items-center justify-end text-xs font-medium whitespace-nowrap">
                  <button
                    className="flex items-center justify-center px-2 py-1 border border-gray-800 dark:border-gray-400 bg-white text-gray-600 dark:text-gray-50 rounded-full hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={() => setSelectedDonor(donor.name)}
                  >
                    {donorRewards[donor.name] ? 'View Reward' : 'Reward Donor'}
                  </button>
                  {donorRewards[donor.name] && (
                    <span className="ml-4 text-sm text-green-500 dark:text-green-300">
                      {donorRewards[donor.name]}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reward Selection Section */}
      {selectedDonor && (
        <div className="mt-8">
          <h2 className="text-lg text-gray-800 dark:text-white mb-4">
            Select a Reward for{' '}
            <span className="text-red-500 font-semibold">{selectedDonor}</span>
          </h2>

          {/* Reward Categories */}
          <div className="space-y-8">
            <div>
              <h6 className="text-md text-gray-800 dark:text-white mb-2">
                Gift Cards
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewardCategories.giftCards.map((reward) => (
                  <RewardOption
                    key={reward}
                    title={reward}
                    selectedReward={selectedReward}
                    setSelectedReward={setSelectedReward}
                  />
                ))}
              </div>
            </div>

            {/* Prepaid Cards */}
            <div>
              <h6 className="text-md text-gray-800 dark:text-white mb-2">
                Prepaid Cards
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewardCategories.prepaidCards.map((reward) => (
                  <RewardOption
                    key={reward}
                    title={reward}
                    selectedReward={selectedReward}
                    setSelectedReward={setSelectedReward}
                  />
                ))}
              </div>
            </div>

            {/* Monetary Options */}
            <div>
              <h6 className="text-md text-gray-800 dark:text-white mb-2">
                Monetary Options
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewardCategories.monetaryOptions.map((reward) => (
                  <RewardOption
                    key={reward}
                    title={reward}
                    selectedReward={selectedReward}
                    setSelectedReward={setSelectedReward}
                  />
                ))}
              </div>
            </div>

            {/* Charities */}
            <div>
              <h6 className="text-md text-gray-800 dark:text-white mb-2">
                Charities
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewardCategories.charities.map((reward) => (
                  <RewardOption
                    key={reward}
                    title={reward}
                    selectedReward={selectedReward}
                    setSelectedReward={setSelectedReward}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Reward Button */}
          <Button
            className="mt-6 mb-12 px-4 py-2 bg-green-800 dark:bg-green-400 text-white dark:text-gray-100 rounded-full hover:bg-green-200 hover:text-gray-700"
            onClick={applyRewardToDonor}
            disabled={!selectedReward}
            size="lg"
            variant="default"
          >
            Confirm Reward for {selectedDonor}
          </Button>
        </div>
      )}

      <RewardComponent />

      {/* Voting Section */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Vote for Consistent Donors
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr>
                <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Donor Name
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Vote
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                  Votes Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {donorList.map((donor) => (
                <tr key={donor.id}>
                  <td className="py-4 text-sm text-gray-800 dark:text-white whitespace-nowrap">
                    {donor.name}
                  </td>
                  <td className="py-4 text-left">
                    <Button
                      onClick={() => handleVote(donor.name)}
                      className="dark:bg-gray-400 rounded-full"
                      size="icon"
                    >
                      <HiOutlinePlus className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="py-4 text-left text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Votes: {votes[donor.name] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reward Option Component
const RewardOption = ({
  title,
  selectedReward,
  setSelectedReward,
}: {
  title: string;
  selectedReward: string | null;
  setSelectedReward: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const isSelected = selectedReward === title;

  return (
    <div
      className={`px-4 py-2 w-fit bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer ${
        isSelected ? 'border-2 border-red-500' : ''
      }`}
      onClick={() => setSelectedReward(title)}
    >
      <p className="text-gray-800 dark:text-white">{title}</p>
    </div>
  );
};
