'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePledgesContext } from '@/app/context/pledges/PledgesContext';
import {
  Accordion,
  AccordionItemWrapper,
  AccordionTriggerWrapper,
  AccordionContentWrapper,
} from '@/app/components/accordion/Accordion';
import PledgeListPageLoader from '../loaders/PledgeListPageLoader ';
import ErrorPage from '../components/errorpage/ErrorPage';

const PledgesListPage = () => {
  const { pledges, loading, error, fetchPledges, deletePledge } =
    usePledgesContext();

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  if (loading)
    return (
      <div className="text-center py-8 px-2">
        <PledgeListPageLoader />
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 px-2">
        <ErrorPage />
      </div>
    );

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="w-full flex justify-start items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Pledges From Your Backers
        </h2>
      </div>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        All shipping or delivery is done by you.{' '}
        <span className="font-semibold text-gray-600 dark:text-neutral-300">
          Bantu Hive disclaims any responsibility.
        </span>
        <a
          href="/learn-more"
          className="text-orange-500 dark:text-orange-400 hover:underline ml-2"
        >
          Learn more
        </a>
      </p>
      <Accordion type="single" collapsible>
        {pledges.map((campaign) => (
          <AccordionItemWrapper
            key={campaign.campaign_id}
            value={campaign.campaign_id.toString()}
          >
            <AccordionTriggerWrapper>
              {campaign.campaign_name}
            </AccordionTriggerWrapper>
            <AccordionContentWrapper>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaign.pledges.map((pledge) => (
                  <div
                    key={pledge.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Details Section */}
                      <div className="flex-1 p-6">
                        {/* Pledge Details */}
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
                            <span className="font-medium">
                              Shipping Status:
                            </span>{' '}
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
                            <span className="font-medium">
                              Delivery Option:
                            </span>{' '}
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

                        {/* Selected Rewards */}
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-4">
                            Selected Rewards
                          </h3>
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
                        </div>

                        {/* Delete Button */}
                        <div className="mt-6">
                          <button
                            onClick={() => deletePledge(pledge.id)}
                            className="w-1/2 bg-red-300 text-white py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                          >
                            Delete Pledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContentWrapper>
          </AccordionItemWrapper>
        ))}
      </Accordion>
    </div>
  );
};

export default PledgesListPage;
