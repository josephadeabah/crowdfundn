import React, { useEffect, useState } from 'react';
import { Button } from '../components/button/Button';
import { HiShieldCheck } from 'react-icons/hi';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useTransferContext } from '../context/account/transfers/TransfersContext';

export default function Transfers() {
  const { campaigns } = useCampaignContext(); // Fetch campaigns data
  const { fetchTransfers, createTransferRecipient, transfers, loading } =
    useTransferContext();

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleRequestTransfer = async (campaignId: string | number) => {
    try {
      await createTransferRecipient(campaignId);
      fetchTransfers();
    } catch (error) {
      console.error('Error requesting transfer:', error);
    }
  };

  return (
    <div className="h-full mb-20">
      {/* Header Section */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        Transfers
      </h2>
      <p className="text-gray-500 dark:text-neutral-400 mb-4">
        Review your transfer history or request new transfers.
      </p>
      {/* Secure Transfers Button */}
      <Button
        variant="ghost"
        className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6"
      >
        <HiShieldCheck className="mr-2 w-5 h-5" />
        Transfers are secure on our platform
      </Button>

      {/* Campaigns Section */}
      <div className="space-y-4">
        {campaigns?.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow w-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {campaign.title}
                </h3>
                <p className="text-gray-500 dark:text-neutral-400">
                  Raised: ${campaign.current_amount} / ${campaign.goal_amount}
                </p>
              </div>
              <Button
                onClick={() => handleRequestTransfer(campaign.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Request Transfer'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer History Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Transaction History
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transfers?.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">
                    ${transfer.amount}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-green-500 dark:text-green-400">
                    {transfer.status}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">
                    {transfer.reason}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">
                    {transfer.reference}
                  </td>
                </tr>
              ))}
              {transfers?.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-2 text-gray-500 dark:text-neutral-400 text-center"
                  >
                    No transfers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Space Below the Page */}
      <div className="h-20"></div>
    </div>
  );
}
