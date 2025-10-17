import React, { useEffect, useState } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ToastComponent from '@/app/components/toast/Toast';
import { Reward } from '@/app/context/account/rewards/RewardsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import { InvestmentCreatePayload } from '@/app/types/equityCampaigns.types';
import {
  BillingFrequency,
  DonationTransactionData,
} from '@/app/types/donations.types';
import { useAuth } from '@/app/context/auth/AuthContext';

interface PaystackFormProps {
  cardholderName: string;
  paymentEmail: string;
  paymentPhone: string;
  paymentAmount: string;
  campaignId: string;
  campaignTitle: string;
  billingFrequency: BillingFrequency | null;
  errors: { [key: string]: string };
  shippingData?: {
    firstName: string;
    lastName: string;
    shippingAddress: string;
    entityType: string;
  };
  selectedRewards?: Reward[];
  deliveryOption?: 'home' | 'pickup' | null;
  isPaymentFormValidated: () => boolean;
  setCardholderName: React.Dispatch<React.SetStateAction<string>>;
  setPaymentEmail: React.Dispatch<React.SetStateAction<string>>;
  setPaymentPhone: React.Dispatch<React.SetStateAction<string>>;
  setPaymentAmount: React.Dispatch<React.SetStateAction<string>>;
  isEquityCampaign?: boolean;
}

const PaystackForm: React.FC<PaystackFormProps> = ({
  cardholderName,
  paymentEmail,
  paymentPhone,
  paymentAmount,
  campaignId,
  campaignTitle,
  billingFrequency,
  errors,
  shippingData,
  selectedRewards,
  deliveryOption,
  isPaymentFormValidated,
  setCardholderName,
  setPaymentEmail,
  setPaymentPhone,
  setPaymentAmount,
  isEquityCampaign = false,
}) => {
  const {
    createDonationTransaction,
    loading: donationLoading,
    error: donationError,
    clearError: clearDonationError,
  } = useDonationsContext();
  const { user } = useAuth();

  const { createInvestment, loading: investmentLoading } =
    useEquityCampaignContext();

  const [showToast, setShowToast] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Calculate processing fee and total amount - 7% capped at 300
  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    if (isEquityCampaign && amount > 0) {
      const rawFee = Math.min(amount * 0.07, 300);
      const fee = parseFloat(rawFee.toFixed(2));
      setProcessingFee(fee);
      setTotalAmount(parseFloat((amount + fee).toFixed(2)));
    } else {
      setProcessingFee(0);
      setTotalAmount(amount);
    }
  }, [paymentAmount, isEquityCampaign]);

  // Handle errors and show toast
  useEffect(() => {
    if (donationError) {
      setToastMessage(donationError);
      setToastType('error');
      setShowToast(true);
    }
  }, [donationError]);

  const handleToastClose = () => {
    setShowToast(false);
    if (!isEquityCampaign) {
      clearDonationError();
    }
  };

  const validateForm = (): boolean => {
    if (!isPaymentFormValidated()) {
      return false;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setToastMessage('Please enter a valid amount greater than 0');
      setToastType('error');
      setShowToast(true);
      return false;
    }

    // For anonymous donations, we still need email for payment processing
    if (!paymentEmail && isAnonymous) {
      setToastMessage(
        'Email is required for payment processing, even for anonymous donations',
      );
      setToastType('error');
      setShowToast(true);
      return false;
    }

    return true;
  };

  const handleDonationPayment = async () => {
    if (!validateForm()) return;

    const amount = parseFloat(paymentAmount);
    const transactionData: DonationTransactionData = {
      email: paymentEmail,
      fullName: isAnonymous ? 'Anonymous' : cardholderName,
      phoneNumber: isAnonymous ? '' : paymentPhone,
      amount: amount,
      campaignId: campaignId,
      campaignTitle: campaignTitle,
      billingFrequency: billingFrequency,
      anonymous: isAnonymous,
      metadata: {
        shippingData: shippingData,
        selectedRewards: selectedRewards?.map((reward) => ({
          ...reward,
          image: reward.image ?? '',
        })),
        deliveryOption: deliveryOption,
      },
    };

    try {
      await createDonationTransaction(transactionData);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleEquityInvestment = async () => {
    if (!validateForm()) return;

    const amount = parseFloat(paymentAmount);
    try {
      // Create properly structured payload for backend
      const investmentPayload: InvestmentCreatePayload = {
        equity_investment: {
          amount: totalAmount,
          email: paymentEmail,
          phone: paymentPhone,
          full_name: cardholderName,
          metadata: {
            processingFee,
            originalAmount: amount,
            shippingData,
            selectedRewards,
            deliveryOption,
          },
        },
      };

      const result = await createInvestment(campaignId, investmentPayload);

      if (!result.success) {
        let errorMessage = result.error || 'Investment failed';

        if (result.validationErrors) {
          const formattedErrors = Object.entries(result.validationErrors)
            .map(([field, messages]) => {
              const fieldName =
                field === 'base' ? '' : `${field.replace(/_/g, ' ')}: `;
              const messageList = Array.isArray(messages)
                ? messages
                : [messages];
              return `${fieldName}${messageList.join(', ')}`;
            })
            .join('\n');

          errorMessage = formattedErrors || errorMessage;
        }

        if (result.data?.shares_available !== undefined) {
          const pricePerShare =
            result.data.shares_available > 0
              ? (totalAmount / result.data.shares_available).toFixed(2)
              : 0;
          errorMessage += `\nCurrent share price: ${pricePerShare} ${user?.currency_symbol || user?.currency || ''}`;
        }

        if (result.code) {
          errorMessage += `\n(Code: ${result.code})`;
        }

        setToastMessage(errorMessage);
        setToastType('error');
        setShowToast(true);
      } else {
        setToastMessage('Investment created successfully!');
        setToastType('success');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('An unexpected error occurred. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handlePayment = async () => {
    setShowToast(false);

    if (isEquityCampaign) {
      await handleEquityInvestment();
    } else {
      await handleDonationPayment();
    }
  };

  const loading = isEquityCampaign ? investmentLoading : donationLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable form content */}
      <div className="flex-grow overflow-y-auto p-4">
        {showToast && (
          <ToastComponent
            type={toastType}
            isOpen={showToast}
            onClose={handleToastClose}
            description={toastMessage}
          />
        )}

        <div className="space-y-4">
          {/* Anonymous Donation Checkbox - Only show for non-equity campaigns */}
          {!isEquityCampaign && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymousDonation"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="anonymousDonation"
                className="ml-2 block text-sm text-gray-700"
              >
                Donate anonymously (your name won't appear publicly)
              </label>
            </div>
          )}

          <div>
            <label
              htmlFor="cardholderName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Full Name{' '}
              {isAnonymous &&
                !isEquityCampaign &&
                '(Will not be shown publicly)'}
            </label>
            <input
              type="text"
              id="cardholderName"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cardholderName
                  ? 'border-red-500 ring-2 ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isAnonymous && !isEquityCampaign}
              aria-invalid={!!errors.cardholderName}
              aria-describedby={
                errors.cardholderName ? 'cardholderName-error' : undefined
              }
            />
            {errors.cardholderName && (
              <p
                id="cardholderName-error"
                className="mt-1 text-sm text-red-500"
              >
                {errors.cardholderName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentEmail"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address{' '}
              {isAnonymous &&
                !isEquityCampaign &&
                '(Required for payment receipt)'}
            </label>
            <input
              type="email"
              id="paymentEmail"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.paymentEmail
                  ? 'border-red-500 ring-2 ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
              aria-invalid={!!errors.paymentEmail}
              aria-describedby={
                errors.paymentEmail ? 'paymentEmail-error' : undefined
              }
              required
            />
            {errors.paymentEmail && (
              <p id="paymentEmail-error" className="mt-1 text-sm text-red-500">
                {errors.paymentEmail}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentPhone"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Phone Number {isAnonymous && !isEquityCampaign && '(Optional)'}
            </label>
            <input
              type="tel"
              id="paymentPhone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+233 XX XXX XXXX"
              value={paymentPhone}
              onChange={(e) => setPaymentPhone(e.target.value)}
              disabled={isAnonymous && !isEquityCampaign}
            />
          </div>

          <div>
            <label
              htmlFor="paymentAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {isEquityCampaign
                ? `Investment Amount (${user?.currency_symbol || user?.currency.toUpperCase() || 'GHS'})`
                : `Donation Amount (${user?.currency_symbol || user?.currency.toUpperCase() || 'GHS'})`}
            </label>
            <input
              type="number"
              id="paymentAmount"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.paymentAmount
                  ? 'border-red-500 ring-2 ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="0.00"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              min="1"
              step="0.01"
              aria-invalid={!!errors.paymentAmount}
              aria-describedby={
                errors.paymentAmount ? 'paymentAmount-error' : undefined
              }
              required
            />
            {errors.paymentAmount && (
              <p id="paymentAmount-error" className="mt-1 text-sm text-red-500">
                {errors.paymentAmount}
              </p>
            )}
          </div>

          {/* Equity Investment Fee Breakdown */}
          {isEquityCampaign && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">
                Investment Summary
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-medium">
                    {parseFloat(paymentAmount || '0').toFixed(2)}{' '}
                    {user?.currency_symbol ||
                      user?.currency.toUpperCase() ||
                      'GHS'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee (7%):</span>
                  <span className="font-medium">
                    {processingFee.toFixed(2)}{' '}
                    {user?.currency_symbol ||
                      user?.currency.toUpperCase() ||
                      'GHS'}
                    {processingFee >= 300 && ' (capped)'}
                  </span>
                </div>

                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-blue-800">
                    <span>Total Amount to Pay:</span>
                    <span>
                      {totalAmount.toFixed(2)}{' '}
                      {user?.currency_symbol ||
                        user?.currency.toUpperCase() ||
                        'GHS'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> An additional 3% platform fee will be
                  deducted from your investment amount after successful payment.
                  Paystack transaction fee of 1.95% applies to all payments.
                  Learn more about our{' '}
                  <a
                    href="/info/pricing"
                    target="_blank"
                    className="underline text-orange-700"
                  >
                    pricing
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Donation Fee Information */}
          {!isEquityCampaign && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">
                Donation Information
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation Amount:</span>
                  <span className="font-medium">
                    {parseFloat(paymentAmount || '0').toFixed(2)}{' '}
                    {user?.currency_symbol ||
                      user?.currency.toUpperCase() ||
                      'GHS'}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> A 7% platform fee will be deducted from
                  your donation after successful payment. Paystack transaction
                  fee of 1.95% applies to all payments. Learn more about our{' '}
                  <a
                    href="/info/pricing"
                    target="_blank"
                    className="underline text-orange-700"
                  >
                    pricing
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed button at the bottom */}
      <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Proceed to ${isEquityCampaign ? 'Invest' : 'Pay'}`
          )}
        </button>

        {isEquityCampaign && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            You will complete your investment on the next page
          </p>
        )}
      </div>
    </div>
  );
};

export default PaystackForm;
