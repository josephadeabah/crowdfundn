import React, { useEffect, useState } from 'react';
import { Button } from '../components/button/Button';
import { HiShieldCheck } from 'react-icons/hi';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useTransferContext } from '../context/account/transfers/TransfersContext';
import ToastComponent from '../components/toast/Toast';
import TransferLoader from '../loaders/TransferLoader ';
import TransferCampaignLoader from '../loaders/TransferCampaignLoader';

export default function Transfers() {
  const {
    campaigns,
    fetchCampaigns,
    loading: isLoadingCampaigns,
  } = useCampaignContext();
  const {
    fetchTransfers,
    createTransferRecipient,
    initiateTransfer,
    transfers,
    loading,
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
      // Step 1: Create the transfer recipient
      const response = await createTransferRecipient(campaignId);

      // Step 2: Check if recipient creation was successful
      if (response && response.recipient_code) {
        // Step 3: If successful, initiate the transfer
        const initiateResponse = await initiateTransfer(
          campaignId,
          response.recipient_code,
        );

        if (typeof initiateResponse === 'object' && initiateResponse !== null) {
          // Check if the response from initiateTransfer contains an error
          if (
            initiateResponse &&
            typeof initiateResponse === 'object' &&
            'error' in initiateResponse
          ) {
            // Show error toast if there's an error from the backend
            showToast(
              'Error',
              (initiateResponse as { error: string }).error,
              'error',
            );
          } else {
            // Success toast if transfer initiation is successful
            showToast('Success', 'Transfer initiated successfully', 'success');
            fetchTransfers(); // Refresh the transfers list
            fetchCampaigns(); // Refresh the campaigns list
          }
        } else {
          // Error toast if the initiateTransfer response is invalid
          showToast('Error', 'Failed to initiate transfer', 'error');
        }
      } else {
        // Error toast if creating transfer recipient fails
        showToast('Error', 'Failed to create transfer recipient', 'error');
      }
    } catch (err) {
      // Catch any unexpected errors and show an error toast
      showToast('Error', String(err), 'error');
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
          {isLoadingCampaigns ? (
            <TransferCampaignLoader />
          ) : (
            campaigns?.map((campaign) => (
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
                      <span className="mr-1"> Raised:</span>
                      <span
                        className={`${
                          parseFloat(
                            campaign.current_amount?.toString() || '0',
                          ) >=
                          parseFloat(campaign.goal_amount?.toString() || '0')
                            ? 'text-green-600'
                            : 'text-orange-500'
                        }`}
                      >
                        <span className="text-gray-900 dark:text-gray-100 mr-1">
                          {campaign.currency.toUpperCase()}
                        </span>
                        {parseFloat(
                          campaign.current_amount?.toString() || '0',
                        ).toLocaleString()}
                      </span>{' '}
                      /{' '}
                      <span className="text-green-600">
                        <span className="text-gray-900 dark:text-gray-100 mr-1">
                          {campaign.currency.toUpperCase()}
                        </span>
                        {parseFloat(campaign.goal_amount).toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRequestTransfer(campaign.id)}
                    className="px-4 py-2 bg-green-400 text-white rounded-full hover:bg-green-600 dark:hover:bg-green-700"
                    disabled={
                      loadingCampaigns[campaign.id] ||
                      parseFloat(campaign.current_amount) < 10.0
                    }
                  >
                    {loadingCampaigns[campaign.id]
                      ? 'Processing...'
                      : 'Request Transfer'}
                  </Button>
                </div>
              </div>
            ))
          )}
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
                {loading ? (
                  <TransferLoader />
                ) : transfers?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-2 text-center text-gray-800 dark:text-white"
                    >
                      You have no transfer history.
                    </td>
                  </tr>
                ) : (
                  transfers?.map((transfer) => (
                    <tr key={transfer.id}>
                      <td className="px-4 py-2 text-gray-800 dark:text-white whitespace-nowrap">
                        {transfer.currency}{' '}
                        {parseFloat(
                          transfer.amount.toString(),
                        ).toLocaleString()}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
