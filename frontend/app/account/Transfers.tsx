import React, { useEffect, useState } from 'react';
import { Button } from '../components/button/Button';
import { HiShieldCheck } from 'react-icons/hi';
import { useCampaignContext } from '../context/account/campaign/CampaignsContext';
import { useTransferContext } from '../context/account/transfers/TransfersContext';
import ToastComponent from '../components/toast/Toast';
import TransferCampaignLoader from '../loaders/TransferCampaignLoader';
import Pagination from '../components/pagination/Pagination';
import moment from 'moment';
import ProgressRing from '../components/ring/ProgressRing';
import { CampaignResponseDataType } from '../types/campaigns.types';
import TransferLoader from '../loaders/TransferLoader ';
import InfoTooltip from '../components/tooltip/tooltip';

export default function Transfers() {
  const {
    userCampaigns,
    fetchUserCampaigns,
    loading: isLoadingCampaigns,
  } = useCampaignContext();

  const {
    fetchTransfers,
    fetchTransfersFromPaystack,
    createTransferRecipient,
    initiateTransfer,
    transfers,
    loading,
    loadingCampaigns,
    currentPage,
    totalPages,
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
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  useEffect(() => {
    fetchTransfersFromPaystack();
  }, [fetchTransfersFromPaystack]);

  useEffect(() => {
    fetchTransfers(currentPage);
  }, [fetchTransfers, currentPage]);

  const handleRequestTransfer = async (campaignId: string | number) => {
    try {
      const response = await createTransferRecipient(campaignId);
      if (response && response.recipient_code) {
        const initiateResponse = await initiateTransfer(
          campaignId,
          response.recipient_code,
        );
        if (typeof initiateResponse === 'object' && initiateResponse !== null) {
          if (initiateResponse && 'error' in initiateResponse) {
            showToast(
              'Error',
              (initiateResponse as { error: string }).error,
              'error',
            );
          } else {
            showToast('Success', 'Transfer initiated successfully', 'success');
            fetchTransfersFromPaystack();
            fetchTransfers(currentPage);
            fetchUserCampaigns();
          }
        } else {
          showToast('Error', 'Failed to initiate transfer', 'error');
        }
      } else {
        showToast('Error', 'Please add your account number first', 'error');
      }
    } catch (err) {
      showToast('Error', String(err), 'error');
    }
  };

  const isTransferDisabled = (campaign: CampaignResponseDataType) => {
    const currentAmount = parseFloat(campaign.current_amount?.toString() || '0');
    const goalAmount = parseFloat(campaign.goal_amount?.toString() || '0');
    
    // For regular campaigns: minimum is 1/2 of goal amount
    const minimumAmount = goalAmount * 0.5;

    if (campaign.type === 'EquityCampaign') {
      // Equity campaigns still use 50% of goal as minimum
      return currentAmount < goalAmount * 0.5;
    }

    // Regular campaigns: disabled if current < goal OR current < (goal * 0.5)
    return currentAmount < goalAmount || currentAmount < minimumAmount;
  };

  const getTransferRestrictionMessage = (
    campaign: CampaignResponseDataType,
  ) => {
    const currentAmount = parseFloat(
      campaign.current_amount?.toString() || '0',
    );
    const goalAmount = parseFloat(campaign.goal_amount?.toString() || '0');

    if (campaign.type === 'EquityCampaign') {
      const requiredAmount = Math.max(goalAmount * 0.5, 60.0);
      return `Transfer available when campaign reaches at least 50% of goal (${campaign.currency.toUpperCase()}${requiredAmount.toLocaleString()})`;
    } else {
      return `Transfer available only when campaign reaches 100% or half of goal (${campaign.currency.toUpperCase()}${goalAmount.toLocaleString()})`;
    }
  };

  return (
    <div className="px-2 py-4">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Transfers</h2>
        <p className="text-gray-600">
          Review your transfer history or request new transfers.
          <span className="text-gray-500">
            {' '}
            Typically request for transfer weekdays from 10:30AM
          </span>
        </p>
        <Button
          variant="ghost"
          className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mt-2"
        >
          <HiShieldCheck className="mr-2 w-5 h-5" />
          Transfers are secure on our platform
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Campaigns */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Campaigns Available for Transfer
            </h3>
          </div>

          {isLoadingCampaigns ? (
            <TransferCampaignLoader />
          ) : userCampaigns === null ? (
            <div className="text-center py-4 text-gray-600">
              Loading your campaigns...
            </div>
          ) : userCampaigns.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
              You have no campaigns available for transfer
            </div>
          ) : (
            userCampaigns.map((campaign: CampaignResponseDataType) => (
              <div key={campaign.id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="shrink-0">
                      <ProgressRing
                        value={Math.round(
                          (parseFloat(
                            campaign.current_amount?.toString() || '0',
                          ) /
                            parseFloat(
                              campaign.goal_amount?.toString() || '1',
                            )) *
                            100,
                        )}
                        size={60}
                        strokeWidth={5}
                        color="#22c55e"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">
                          {campaign.title}
                        </h3>
                        {isTransferDisabled(campaign) && (
                          <InfoTooltip
                            id={`tooltip-${campaign.id}`}
                            content={getTransferRestrictionMessage(campaign)}
                            className="ml-2"
                            iconSize={14}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        <span
                          className={
                            parseFloat(
                              campaign.current_amount?.toString() || '0',
                            ) >=
                            parseFloat(campaign.goal_amount?.toString() || '0')
                              ? 'text-green-600'
                              : 'text-orange-500'
                          }
                        >
                          {campaign.currency.toUpperCase()}
                          {parseFloat(
                            campaign.current_amount?.toString() || '0',
                          ).toLocaleString()}
                        </span>
                        <span> raised of </span>
                        <span className="text-green-600">
                          {campaign.currency.toUpperCase()}
                          {parseFloat(campaign.goal_amount).toLocaleString()}
                        </span>
                      </p>
                      {campaign.type === 'EquityCampaign' && (
                        <p className="text-xs text-blue-600">
                          Equity Campaign (50% threshold)
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleRequestTransfer(campaign.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-green-400 text-white rounded-full hover:bg-green-600 whitespace-nowrap"
                    disabled={
                      loadingCampaigns[campaign.id] ||
                      isTransferDisabled(campaign)
                    }
                  >
                    {loadingCampaigns[campaign.id]
                      ? 'Transferring...'
                      : 'Request Transfer'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column - Transfer History */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Transaction History
          </h3>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Bank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-4">
                        <TransferLoader />
                      </td>
                    </tr>
                  ) : transfers?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-4 text-center text-gray-600"
                      >
                        You have no transfer history.
                      </td>
                    </tr>
                  ) : (
                    transfers?.map((transfer) => (
                      <tr key={transfer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                          {transfer.currency}{' '}
                          {parseFloat(
                            transfer.amount.toString(),
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {moment(transfer.created_at).format(
                            'MMM D, YYYY h:mm A',
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {transfer.status === 'success' ? (
                            <span className="text-sm text-white px-2 bg-lime-400 rounded-full">
                              PAID
                            </span>
                          ) : (
                            <span className="text-gray-600">
                              {transfer.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                          {transfer.reference}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                          {transfer.account_number || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                          {transfer.bank_name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 max-w-xs truncate">
                          {transfer.reason}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={fetchTransfers}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
