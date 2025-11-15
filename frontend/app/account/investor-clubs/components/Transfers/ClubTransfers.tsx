import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/button/Button';
import { HiShieldCheck, HiX } from 'react-icons/hi';
import ToastComponent from '@/app/components/toast/Toast';
import Pagination from '@/app/components/pagination/Pagination';
import moment from 'moment';
import { AlertTriangle, DollarSign, History, Info } from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { clubTransferService } from '../../services/clubTransferService';
import { ClubTransfer, ClubTransfersResponse } from '../../types/club.types';

interface ClubTransfersProps {
  club: any;
  formatCurrency: (amount: number, currency?: string) => string;
  onTransferSuccess?: () => void;
}

export default function ClubTransfers({
  club,
  formatCurrency,
  onTransferSuccess,
}: ClubTransfersProps) {
  const { user, token } = useAuth();

  const [transfers, setTransfers] = useState<ClubTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transferring, setTransferring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

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

  const fetchClubTransfers = async (page: number = 1) => {
    if (!token || !club?.slug) return;

    setLoading(true);
    setError(null);

    try {
      const response: ClubTransfersResponse =
        await clubTransferService.getClubTransfers(token, club.slug, page);

      setTransfers(response.transfers);
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
      setTotalCount(response.total_count);
    } catch (err: any) {
      setError(err.message || 'Error fetching club transfers');
      console.error('Failed to fetch club transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfersFromPaystack = async () => {
    if (!token || !club?.slug) return;

    try {
      await clubTransferService.fetchTransfersFromPaystack(token, club.slug);
      // Refresh the transfers list after fetching from Paystack
      fetchClubTransfers(currentPage);
    } catch (err: any) {
      console.error('Failed to fetch transfers from Paystack:', err);
    }
  };

  useEffect(() => {
    if (club?.slug) {
      fetchClubTransfers(currentPage);
    }
  }, [club?.slug, currentPage]);

  useEffect(() => {
    if (club?.slug) {
      fetchTransfersFromPaystack();
    }
  }, [club?.slug]);

  const handleRequestTransfer = async () => {
    if (!token || !club?.slug) return;

    try {
      // Check if user is admin
      const isAdmin = club.is_admin;
      if (!isAdmin) {
        showToast(
          'Access Denied',
          'Only club admins can initiate transfers.',
          'error',
        );
        return;
      }

      // Check if transfers are locked for the admin user
      if (user?.transfer_locked) {
        showToast(
          'Transfer Locked',
          `Transfers are currently locked for your account. Reason: ${user?.transfer_locked_reason || 'Contact support for details'}`,
          'error',
        );
        return;
      }

      // Check if club has sufficient balance
      if (club.current_balance <= 0) {
        showToast(
          'Insufficient Funds',
          'Club has no funds available for transfer.',
          'error',
        );
        return;
      }

      setTransferring(true);

      // Step 1: Create transfer recipient
      const recipientResponse =
        await clubTransferService.createTransferRecipient(token, club.slug);

      if (recipientResponse && recipientResponse.recipient_code) {
        // Step 2: Initialize transfer
        const transferResponse = await clubTransferService.initiateTransfer(
          token,
          club.slug,
          recipientResponse.recipient_code,
        );

        if (transferResponse && transferResponse.transfer_code) {
          showToast(
            'Success',
            `Transfer initiated successfully! Club balance will be updated shortly.`,
            'success',
          );

          // Refresh data
          fetchTransfersFromPaystack();
          fetchClubTransfers(currentPage);
          onTransferSuccess?.();
        } else {
          showToast('Error', 'Failed to initiate club transfer', 'error');
        }
      } else {
        showToast(
          'Setup Required',
          'Please ensure the club admin has a valid bank account setup for transfers.',
          'error',
        );
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to process transfer', 'error');
      console.error('Transfer error:', err);
    } finally {
      setTransferring(false);
    }
  };

  const isTransferDisabled = () => {
    return !club.is_admin || club.current_balance <= 0 || transferring;
  };

  const getTransferButtonText = () => {
    if (!club.is_admin) return 'Admin Only';
    if (club.current_balance <= 0) return 'No Funds Available';
    if (transferring) return 'Processing Transfer...';
    return `Transfer ${formatCurrency(club.current_balance, club.currency)}`;
  };

  return (
    <div className="p-1">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              Club Funds Transfer
            </h2>
            <p className="text-gray-600 mt-1">
              Manage transfers for{' '}
              <span className="font-semibold text-emerald-600">
                {club.name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200"
            >
              <HiShieldCheck className="mr-2 w-4 h-4" />
              Secure
            </Button>
          </div>
        </div>
      </div>

      {/* Transfer lock status */}
      {user?.transfer_locked && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">
              Transfers are locked for your account
            </span>
          </div>
          {user?.transfer_locked_reason && (
            <p className="text-red-600 text-sm mt-1">
              Reason: {user?.transfer_locked_reason}
            </p>
          )}
          <p className="text-red-600 text-sm">
            Please contact support to unlock transfers.
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Transfer Actions */}
        <div className="xl:col-span-2 space-y-6">
          {/* Club Balance Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">
                  Available Balance
                </p>
                <p className="text-3xl font-bold mt-1">
                  {formatCurrency(club.current_balance, club.currency)}
                </p>
                <p className="text-emerald-100 text-sm mt-2">
                  Total club funds available for transfer
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Transfer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Transfer Details
              </h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Admin Account</p>
                    <p className="text-gray-600">
                      Uses club admin's bank details
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Full Balance</p>
                    <p className="text-gray-600">
                      Transfers entire club balance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Secure Processing
                    </p>
                    <p className="text-gray-600">Bank-level security</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Admin Only</p>
                    <p className="text-gray-600">Restricted to club admins</p>
                  </div>
                </div>
              </div>

              {/* Transfer Button */}
              <Button
                onClick={handleRequestTransfer}
                className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isTransferDisabled()}
              >
                {transferring ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Transfer...
                  </div>
                ) : (
                  getTransferButtonText()
                )}
              </Button>

              {!club.is_admin && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-700 text-center font-medium">
                    🔒 Only club administrators can initiate transfers
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Transfer History */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Transfer History
              </h3>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {totalCount}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2">Loading transfer history...</p>
                </div>
              ) : transfers?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No transfer history found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Club transfers will appear here
                  </p>
                </div>
              ) : (
                transfers?.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transfer.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : transfer.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : transfer.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {transfer.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {moment(transfer.created_at).format('MMM D, YYYY')}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Reference:</span>
                        <p className="truncate">{transfer.reference}</p>
                      </div>
                      <div>
                        <span className="font-medium">Initiated by:</span>
                        <p>{transfer.user?.full_name || 'N/A'}</p>
                      </div>
                    </div>

                    {transfer.bank_name && (
                      <div className="mt-2 text-xs text-gray-500">
                        {transfer.bank_name} •{' '}
                        {transfer.account_number || 'N/A'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchClubTransfers(page);
                  }}
                />
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-900">Need Help?</h4>
                <p className="text-emerald-700 text-sm mt-1">
                  Transfers are typically processed on weekdays from 10:30 AM.
                  Contact support if you encounter any issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
