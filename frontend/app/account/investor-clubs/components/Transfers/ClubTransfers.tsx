import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/button/Button';
import { HiShieldCheck } from 'react-icons/hi';
import ToastComponent from '@/app/components/toast/Toast';
import Pagination from '@/app/components/pagination/Pagination';
import moment from 'moment';
import {
  AlertTriangle,
  DollarSign,
  History,
  Info,
  HelpCircle,
  Send,
  Users,
  Banknote,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { clubTransferService } from '../../services/clubTransferService';
import InfoTooltip from '@/app/components/tooltip/tooltip';
import { ClubTransfer, ClubTransfersResponse } from '../../types/club.types';
import { Club } from '../../clubTypes';

interface ClubTransfersProps {
  club: Club;
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
  const [transferAmount, setTransferAmount] = useState<string>('');

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

  // Safe number conversion to handle NaN
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 0;
    }
    return Number(value);
  };

  const clubBalance = safeNumber(club.current_balance);

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

  // Set initial transfer amount to full balance
  useEffect(() => {
    if (clubBalance > 0) {
      setTransferAmount(clubBalance.toString());
    }
  }, [clubBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTransferAmount(value);
    }
  };

  const handleMaxAmount = () => {
    setTransferAmount(clubBalance.toString());
  };

  const getTransferAmount = (): number => {
    const amount = parseFloat(transferAmount);
    return isNaN(amount) ? 0 : amount;
  };

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

      const amount = getTransferAmount();

      // Validate amount
      if (amount <= 0) {
        showToast(
          'Invalid Amount',
          'Please enter a valid transfer amount.',
          'error',
        );
        return;
      }

      if (amount > clubBalance) {
        showToast(
          'Insufficient Funds',
          `Transfer amount exceeds available club balance of ${formatCurrency(clubBalance, club.currency)}`,
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
            `Transfer of ${formatCurrency(amount, club.currency)} initiated successfully!`,
            'success',
          );

          // Refresh data
          fetchTransfersFromPaystack();
          fetchClubTransfers(currentPage);
          onTransferSuccess?.();
          setTransferAmount('');
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
    const amount = getTransferAmount();
    return (
      !club.is_admin || amount <= 0 || amount > clubBalance || transferring
    );
  };

  const getTransferButtonText = () => {
    if (!club.is_admin) return 'Admin Only';
    if (clubBalance <= 0) return 'No Funds Available';
    if (transferring) return 'Processing Transfer...';
    return `Transfer ${formatCurrency(getTransferAmount(), club.currency)}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { class: 'bg-green-100 text-green-800', label: 'PAID' },
      pending: { class: 'bg-yellow-100 text-yellow-800', label: 'PENDING' },
      failed: { class: 'bg-red-100 text-red-800', label: 'FAILED' },
      reversed: { class: 'bg-gray-100 text-gray-800', label: 'REVERSED' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-emerald-600" />
              Club Funds Transfer
              <InfoTooltip
                id="club-funds-transfer-info"
                content="Transfer club funds to the admin's registered bank account"
                iconSize={18}
              />
            </h2>
            <p className="text-gray-600 mt-2">
              Managing transfers for{' '}
              <span className="font-semibold text-emerald-600">
                {club.name}
              </span>
              <span className="text-gray-400 ml-2">
                •{' '}
                {club.club_type?.charAt(0).toUpperCase() +
                  club.club_type?.slice(1) || 'Private'}{' '}
                Club
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100"
            >
              <HiShieldCheck className="mr-2 w-4 h-4" />
              Secure Transfers
            </Button>
          </div>
        </div>
      </div>

      {/* Transfer lock status */}
      {user?.transfer_locked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <span className="text-red-700 font-medium">
                Transfers are locked for your account
              </span>
              {user?.transfer_locked_reason && (
                <p className="text-red-600 text-sm mt-1">
                  Reason: {user?.transfer_locked_reason}
                </p>
              )}
              <p className="text-red-600 text-sm">
                Please contact support to unlock transfers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Hamburger List Design */}
      <div className="space-y-6">
        {/* Club Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="w-5 h-5 text-emerald-100" />
                <p className="text-emerald-100 text-sm font-medium">
                  Available Club Balance
                </p>
                <InfoTooltip
                  content="Total funds available in the club for transfer"
                  id="available-club-balance-info"
                />
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(clubBalance, club.currency)}
              </p>
              <p className="text-emerald-100 text-sm mt-2">
                Funds available for transfer to admin account
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Transfer Amount Input */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Transfer Amount
            </h3>
            <InfoTooltip
              id="transfer-amount-info"
              content="Enter the amount you want to transfer from club funds"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label
                  htmlFor="transferAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount to Transfer ({club.currency})
                </label>
                <div className="relative">
                  <input
                    id="transferAmount"
                    type="text"
                    value={transferAmount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"
                  />
                  <button
                    onClick={handleMaxAmount}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded hover:bg-emerald-200 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    Available: {formatCurrency(clubBalance, club.currency)}
                  </span>
                  {getTransferAmount() > 0 && (
                    <span
                      className={`text-sm font-medium ${
                        getTransferAmount() > clubBalance
                          ? 'text-red-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {getTransferAmount() > clubBalance
                        ? 'Exceeds balance'
                        : 'Valid amount'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transfer Information List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Security Level
                  </span>
                </div>
                <span className="text-sm text-emerald-600 font-medium">
                  Bank Grade
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Account Type
                  </span>
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  Admin Bank Account
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Processing Time
                  </span>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  1-3 Business Days
                </span>
              </div>
            </div>

            {/* Transfer Button */}
            <Button
              onClick={handleRequestTransfer}
              className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              disabled={isTransferDisabled()}
            >
              {transferring ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Transfer...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {getTransferButtonText()}
                </>
              )}
            </Button>

            {!club.is_admin && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-orange-700 font-medium flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Only club administrators can initiate transfers
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer History with Horizontal Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Transfer History
            </h3>
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-sm font-medium">
              {totalCount} records
            </span>
            <InfoTooltip
              id="transfer-history-info"
              content="History of all club fund transfers"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-3">Loading transfer history...</p>
            </div>
          ) : transfers?.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No transfer history found
              </p>
              <p className="text-gray-500 mt-2">
                Club transfers will appear here once initiated
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Initiated By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Bank Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transfers.map((transfer) => (
                    <tr
                      key={transfer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {moment(transfer.created_at).format('MMM D, YYYY')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {moment(transfer.created_at).format('h:mm A')}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transfer.amount, transfer.currency)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(transfer.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {transfer.reference}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.user?.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{transfer.bank_name || 'N/A'}</div>
                        {transfer.account_number && (
                          <div className="text-gray-500 text-xs">
                            ****{transfer.account_number.slice(-4)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transfer.status === 'pending' && (
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Track
                          </button>
                        )}
                        {transfer.status === 'failed' && (
                          <button className="text-red-600 hover:text-red-700 font-medium">
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
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
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">
                Need Help With Transfers?
              </h4>
              <div className="space-y-2 text-emerald-700 text-sm">
                <p>
                  • Transfers are processed on weekdays from 10:30 AM to 4:00 PM
                </p>
                <p>• Standard processing time is 1-3 business days</p>
                <p>
                  • Contact support for urgent transfers or technical issues
                </p>
                <p>• Ensure admin bank account details are up to date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
