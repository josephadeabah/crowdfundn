// components/PledgesListPage.tsx
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePledgesContext } from '@/app/context/pledges/PledgesContext';
import {
  AccordionItemWrapper,
  AccordionTriggerWrapper,
  AccordionContentWrapper,
} from '@/app/components/accordion/Accordion';
import { Accordion } from '@radix-ui/react-accordion';

const PledgesListPage = () => {
  const { pledges, loading, error, fetchPledges, deletePledge } =
    usePledgesContext();

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

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
      {pledges.map((campaign) => (
        <div key={campaign.campaign_id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Campaign: {campaign.campaign_name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {campaign.pledges.map((pledge) => (
              <div
                key={pledge.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300"
              >
                <div className="flex flex-row flex-wrap gap-3">
                  {/* Accordion Wrapper */}
                  <Accordion type="single" collapsible>
                    {/* Accordion for Pledge Details */}
                    <AccordionItemWrapper value={`pledge-${pledge.id}`}>
                      <AccordionTriggerWrapper>
                        <h3 className="text-lg font-semibold">Pledge Details</h3>
                      </AccordionTriggerWrapper>
                      <AccordionContentWrapper>
                        <div className="space-y-2">
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
                      </AccordionContentWrapper>
                    </AccordionItemWrapper>

                    {/* Accordion for Selected Rewards */}
                    <AccordionItemWrapper value={`rewards-${pledge.id}`}>
                      <AccordionTriggerWrapper>
                        <h3 className="text-lg font-semibold">
                          Selected Rewards
                        </h3>
                      </AccordionTriggerWrapper>
                      <AccordionContentWrapper>
                        {pledge.selected_rewards.map((reward) => (
                          <div key={reward.id} className="mb-6">
                            {/* Reward Image */}
                            <div className="relative w-full h-48 mb-4">
                              <Image
                                src={reward.image || '/placeholder-image.jpg'}
                                alt={reward.title || 'Reward Image'}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                              />
                            </div>

                            {/* Reward Details */}
                            <h2 className="text-xl font-semibold mb-2">
                              {reward.title || 'No Reward Title'}
                            </h2>
                            <p className="text-gray-600 mb-4">
                              {reward.description || 'No Reward Description'}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Amount:</span> ₵
                              {reward.amount}
                            </p>
                          </div>
                        ))}
                      </AccordionContentWrapper>
                    </AccordionItemWrapper>
                  </Accordion>

                  {/* Delete Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => deletePledge(pledge.id)}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete Pledge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PledgesListPage;
