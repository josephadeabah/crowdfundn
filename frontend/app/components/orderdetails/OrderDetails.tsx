'use client';
import React from 'react';
import Image from 'next/image';
import { MdError } from 'react-icons/md';

interface OrderDetailsPageProps {
  selectedReward: {
    id: number;
    title: string;
    description: string;
    amount: number;
    image?: string;
  } | null;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  selectedReward,
}) => {
  const [error, setError] = React.useState<string | null>(null);

  const orderDetails = {
    orderNumber: 'ORD-12345',
    estimatedDeliveryDate: '2023-06-15',
    status: 'Processing',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Order Number: {orderDetails.orderNumber}
          </p>
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
                Selected Reward
              </h2>
              {selectedReward ? (
                <div className="bg-gray-50 p-4 shadow-sm hover:shadow-md">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={selectedReward.image || '/bantuhive.svg'}
                      alt={selectedReward.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="font-bold text-xl mt-4">
                    {selectedReward.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {selectedReward.description}
                  </p>
                  <div className="font-semibold text-green-600 mt-2">
                    Pledge ${selectedReward.amount} or more
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No reward selected.</p>
              )}
            </div>

            {/* Right Section: Shipping and Delivery Information */}
            <div className="lg:w-1/2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping & Delivery Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-700">
                      Delivery Address
                    </h5>
                    <p className="text-gray-600">
                      123 Main St, Apt 4B, New York, NY 10001
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700">
                      Estimated Delivery Date
                    </h5>
                    <p className="text-gray-600">
                      {orderDetails.estimatedDeliveryDate}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700">
                      Shipping Method
                    </h5>
                    <p className="text-gray-600">
                      Standard Shipping (5-7 business days)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
