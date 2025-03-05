'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePledgesContext } from '@/app/context/pledges/PledgesContext';

const PledgesListPage = () => {
  const { pledges, loading, error, fetchPledges, deletePledge } =
    usePledgesContext();

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  // Group pledges by campaign
  const pledgesByCampaign = pledges.reduce(
    (acc, pledge) => {
      const campaignId = pledge.campaign_id;
      if (!acc[campaignId]) {
        acc[campaignId] = [];
      }
      acc[campaignId].push(pledge);
      return acc;
    },
    {} as Record<number, typeof pledges>,
  );

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="w-full flex justify-start items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Pledged Donations
        </h2>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Here are all your pledges to various campaigns
      </p>
      {Object.entries(pledgesByCampaign).map(
        ([campaignId, campaignPledges]) => (
          <div key={campaignId} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Campaign: {campaignPledges[0].campaign_id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaignPledges.map((pledge) => (
                <div
                  key={pledge.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 h-48">
                      <Image
                        src={
                          pledge.selected_rewards[0]?.image ||
                          '/placeholder-image.jpg'
                        }
                        alt={
                          pledge.selected_rewards[0]?.title || 'Reward Image'
                        }
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                      />
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 p-6">
                      <h2 className="text-xl font-semibold mb-2">
                        {pledge.selected_rewards[0]?.title || 'No Reward Title'}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {pledge.selected_rewards[0]?.description ||
                          'No Reward Description'}
                      </p>

                      {/* Pledge Details */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Amount:</span> ₵
                          {pledge.amount}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Status:</span>{' '}
                          <span
                            className={`capitalize ${
                              pledge.status === 'pending'
                                ? 'text-yellow-600'
                                : pledge.status === 'success'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {pledge.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Shipping Status:</span>{' '}
                          <span
                            className={`capitalize ${
                              pledge.shipping_status === 'not_shipped'
                                ? 'text-red-600'
                                : 'text-green-600'
                            }`}
                          >
                            {pledge.shipping_status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Delivery Option:</span>{' '}
                          {pledge.delivery_option}
                        </p>
                      </div>

                      {/* Shipping Data */}
                      {pledge.shipping_data && (
                        <div className="mt-4 border-t pt-4">
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Shipping Details
                          </h3>
                          <p className="text-sm text-gray-700">
                            {pledge.shipping_data.firstName}{' '}
                            {pledge.shipping_data.lastName}
                          </p>
                          <p className="text-sm text-gray-700">
                            {pledge.shipping_data.shippingAddress}
                          </p>
                        </div>
                      )}

                      {/* Delete Button */}
                      <div className="mt-6">
                        <button
                          onClick={() => deletePledge(pledge.id)} // Fixed: Removed parentheses
                          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                        >
                          Delete Pledge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default PledgesListPage;
