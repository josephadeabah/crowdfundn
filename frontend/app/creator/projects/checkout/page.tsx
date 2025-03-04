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

  const [currentStep, setCurrentStep] = useState(1); // 1: Select Rewards, 2: Delivery, 3: Payment
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'pickup' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    entityType: 'individual', // 'individual', 'organization', 'business'
    shippingAddress: '',
  });

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

  // Handle delivery option change
  const handleDeliveryOptionChange = (option: 'home' | 'pickup') => {
    setDeliveryOption(option);
  };

  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if "Continue" button should be disabled
  const isContinueDisabled =
    currentStep === 1
      ? !data || data.selectedRewards.length === 0
      : currentStep === 2
      ? !deliveryOption || !formData.firstName || !formData.lastName
      : false;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-gray-100 p-8 mb-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Step 1: Select Rewards */}
      {currentStep === 1 && (
        <>
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
        </>
      )}

      {/* Step 2: Delivery Options and Form */}
      {currentStep === 2 && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="home"
                  checked={deliveryOption === 'home'}
                  onChange={() => handleDeliveryOptionChange('home')}
                />
                Home Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryOption === 'pickup'}
                  onChange={() => handleDeliveryOptionChange('pickup')}
                />
                Pick Up
              </label>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Entity Type
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entityType"
                      value="individual"
                      checked={formData.entityType === 'individual'}
                      onChange={handleFormChange}
                    />
                    Individual
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entityType"
                      value="organization"
                      checked={formData.entityType === 'organization'}
                      onChange={handleFormChange}
                    />
                    Organization
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entityType"
                      value="business"
                      checked={formData.entityType === 'business'}
                      onChange={handleFormChange}
                    />
                    Business
                  </label>
                </div>
              </div>
              {deliveryOption === 'home' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </form>
          </div>
        </>
      )}

      {/* Step 3: Payment Form */}
      {currentStep === 3 && (
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          {/* Payment form will go here */}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={isContinueDisabled}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
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
