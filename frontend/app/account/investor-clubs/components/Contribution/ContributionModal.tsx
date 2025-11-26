// app/account/investor-clubs/components/Contribution/ContributionModal.tsx
import React, { useState } from 'react';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '@/app/components/modal/Modal';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContributionSuccess?: () => void;
  club: any;
  token: string | null;
  formatCurrency: (amount: number, currency?: string) => string;
  showSuccess?: boolean;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  onContributionSuccess,
  club,
  token,
  formatCurrency,
  showSuccess = false,
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [
    club.minimum_monthly_contribution,
    club.minimum_monthly_contribution * 2,
    club.minimum_monthly_contribution * 5,
    club.minimum_monthly_contribution * 10,
  ];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
    setError('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
    setError('');
  };

  const validateAmount = (): boolean => {
    const numAmount = parseFloat(amount);

    if (!amount || numAmount <= 0 || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }

    if (numAmount < club.minimum_monthly_contribution) {
      setError(
        `Minimum contribution is ${formatCurrency(club.minimum_monthly_contribution, club.currency)}`,
      );
      return false;
    }

    return true;
  };

  const handleContribution = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    if (!validateAmount()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/contributions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process contribution');
      }

      if (data.success && data.authorization_url) {
        // Save club context for verification at the single source of truth
        localStorage.setItem('selectedClubSlug', club.slug);

        // Check if we're already on the verification route
        const currentHash = window.location.hash;
        const isOnVerificationRoute = currentHash === '#Your%20Clubs';

        if (isOnVerificationRoute) {
          // We're already on the correct route, proceed with payment
          window.location.href = data.authorization_url;
        } else {
          // We're not on the verification route, redirect to single source of truth
          const paymentUrl = new URL(data.authorization_url);
          const paymentRef =
            paymentUrl.searchParams.get('reference') ||
            data.reference ||
            Math.random().toString(36).substring(7);

          // Redirect to the single source of truth route with payment context
          const verificationUrl = `${window.location.pathname}?reference=${paymentRef}#Your%20Clubs`;
          window.location.href = verificationUrl;
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Contribution error:', err);
      setError(
        err.message || 'Failed to process contribution. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setSuccess(false);
    onClose();
  };

  // Only show success state if explicitly enabled and we have success
  const shouldShowSuccess = showSuccess && success;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="medium"
      closeOnBackdropClick={true}
      customStyles={{ padding: 0 }}
    >
      <div className="bg-white rounded-xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Make Contribution
              </h2>
              <p className="text-sm text-gray-600">{club.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {shouldShowSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Contribution Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your contribution of{' '}
                {formatCurrency(parseFloat(amount), club.currency)} has been
                processed successfully.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Club Balance Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Current Club Balance:
                  </span>
                  <span className="text-lg font-semibold text-emerald-700">
                    {formatCurrency(
                      club.financials?.current_balance || 0,
                      club.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Minimum Contribution:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      club.minimum_monthly_contribution,
                      club.currency,
                    )}
                  </span>
                </div>
              </div>

              {/* Quick Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Select Amount
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedAmounts.map((predefinedAmount, index) => (
                    <button
                      key={index}
                      onClick={() => handleAmountSelect(predefinedAmount)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        amount === predefinedAmount.toString()
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-25'
                      }`}
                    >
                      <div className="font-medium">
                        {formatCurrency(predefinedAmount, club.currency)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {getCurrencySymbol(club.currency)}
                    </span>
                  </div>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {club.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContribution}
                  disabled={loading || !amount}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Contribute
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string) => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    GHS: '₵',
    KES: 'KSh',
  };
  return symbols[currency] || '$';
};