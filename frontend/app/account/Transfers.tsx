import React, { useEffect, useState } from 'react';
import { Button } from '../components/button/Button';
import { HiShieldCheck } from 'react-icons/hi';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useTransferContext } from '../context/account/transfers/TransfersContext';
import ToastComponent from '../components/toast/Toast';

export default function Transfers() {
  const { campaigns, fetchCampaigns } = useCampaignContext(); // Fetch campaigns data
  const {
    fetchTransfers,
    createTransferRecipient,
    transfers,
    loading,
    error,
    loadingCampaigns,
  } = useTransferContext();

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleRequestTransfer = async (campaignId: string | number) => {
    try {
      await createTransferRecipient(campaignId);
      fetchTransfers(); // Fetch updated transfers after initiating a new transfer
    } catch (err) {
      console.log("Error from api", err);
      // Handle error: Check if there is a specific error from the context or a generic one
      const errorMessage = error
        ? error
        : err instanceof Error
          ? err.message
          : 'An unknown error occurred';
          console.log("Error Message:", errorMessage); 
      showToast('Error', errorMessage, 'error');
    }
  };

  return (
    <>
      {/* Toast component to show notifications */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

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
                    Raised: {campaign.currency.toUpperCase()}{campaign.current_amount} / {campaign.currency.toUpperCase()}{campaign.goal_amount}
                  </p>
                </div>
                <Button
                  onClick={() => handleRequestTransfer(campaign.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 dark:hover:bg-red-700"
                  disabled={loadingCampaigns[campaign.id]} // Disable button if the specific campaign is loading
                >
                  {loadingCampaigns[campaign.id]
                    ? 'Processing...'
                    : 'Request Transfer'}
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
          <div className="overflow-x-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
            <table className="min-w-full bg-white dark:bg-neutral-800 rounded-lg">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Reference
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Account Number
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Settlement Bank
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {transfers?.map((transfer) => (
                  <tr key={transfer.id}>
                    <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                      {transfer.currency} {transfer.amount}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                      {new Date(transfer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-green-500 dark:text-green-400 whitespace-nowrap">
                      {transfer.status}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                      {transfer.reference}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                      {transfer.account_number || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                      {transfer.bank_name || 'N/A'}
                    </td>
                    <td className="px-4 py-2 truncate text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                      {transfer.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
