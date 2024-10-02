import React, { useState } from 'react';
import {
  FaGift,
  FaMoneyBillWave,
  FaCreditCard,
  FaBox,
  FaTicketAlt,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RewardComponent = () => {
  interface Reward {
    id: number;
    name: string;
    icon: React.ComponentType;
    value: string;
    quantity: number;
  }

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  interface Donor {
    id: number;
    name: string;
    email: string;
    donationAmount: string;
  }

  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(false);

  const rewardOptions = [
    { id: 1, name: 'Gift Card', icon: FaGift, value: '$50', quantity: 100 },
    { id: 2, name: 'Cash', icon: FaMoneyBillWave, value: '$100', quantity: 50 },
    {
      id: 3,
      name: 'Prepaid Card',
      icon: FaCreditCard,
      value: '$75',
      quantity: 75,
    },
    {
      id: 4,
      name: 'Material Goods',
      icon: FaBox,
      value: 'Tech Gadget',
      quantity: 25,
    },
    {
      id: 5,
      name: 'Event Ticket',
      icon: FaTicketAlt,
      value: 'VIP Pass',
      quantity: 10,
    },
  ];

  const donors = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      donationAmount: '$500',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      donationAmount: '$750',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      donationAmount: '$1000',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      donationAmount: '$250',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      donationAmount: '$1500',
    },
  ];

  const handleRewardSelect = (
    reward: {
      id: number;
      name: string;
      icon: React.ComponentType;
      value: string;
      quantity: number;
    },
    donor: { id: number; name: string; email: string; donationAmount: string },
  ) => {
    setSelectedReward(reward);
    setSelectedDonor(donor);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Reward selected for ${donor.name} successfully!`);
      sendConfirmationEmail(reward, donor);
    }, 1000);
  };

  const sendConfirmationEmail = (
    reward: Reward,
    donor: { id: number; name: string; email: string; donationAmount: string },
  ) => {
    // Simulated email sending logic
    console.log(
      `Sending confirmation email for ${reward.name} reward to ${donor.name}`,
    );
  };

  return (
    <div className="container mx-auto px-2 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Select Reward for Donor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Donors</h3>
          <div className="space-y-4">
            {donors.map((donor) => (
              <div key={donor.id} className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold">{donor.name}</h4>
                <p className="text-gray-600">{donor.email}</p>
                <p className="text-gray-600">
                  Donation: {donor.donationAmount}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {rewardOptions.map((reward) => (
                    <button
                      key={reward.id}
                      onClick={() => handleRewardSelect(reward, donor)}
                      className={`px-4 py-2 w-fit bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-sm ${
                        selectedReward &&
                        selectedReward.id === reward.id &&
                        selectedDonor?.id === donor.id
                          ? 'border-2 border-red-500'
                          : ''
                      }`}
                      disabled={loading}
                      aria-label={`Select ${reward.name} reward for ${donor.name}`}
                    >
                      {reward.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Reward Options</h3>
          <div className="space-y-4">
            {rewardOptions.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <reward.icon className="text-4xl text-blue-500" />
                    <span className="text-sm font-semibold text-gray-500">
                      {reward.quantity} left
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{reward.name}</h3>
                  <p className="text-gray-600 mb-4">Value: {reward.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedReward && selectedDonor && (
        <div className="mt-8 p-6 bg-green-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Selected Reward:</h3>
          <p className="text-gray-700">
            You have selected the {selectedReward.name} reward with a value of{' '}
            {selectedReward.value} for {selectedDonor.name}. A confirmation
            email has been sent to {selectedDonor.email} with further
            instructions.
          </p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RewardComponent;
