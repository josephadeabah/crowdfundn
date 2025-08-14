import React, { useEffect, useState } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ToastComponent from '@/app/components/toast/Toast';
import { Reward } from '@/app/context/account/rewards/RewardsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import { EquityInvestment, InvestmentCreateResponse } from '@/app/types/equityCampaigns.types';

interface PaystackFormProps {
  cardholderName: string;
  paymentEmail: string;
  paymentPhone: string;
  paymentAmount: string;
  campaignId: string;
  campaignTitle: string;
  billingFrequency: string;
  errors: { [key: string]: string };
  combinedMetadata?: {
    shippingData: {
      firstName: string;
      lastName: string;
      shippingAddress: string;
      entityType: string;
    };
    selectedRewards: Reward[];
    deliveryOption: 'home' | 'pickup' | null;
  };
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
  combinedMetadata,
  isPaymentFormValidated: validatePaystackForm,
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
  } = useDonationsContext();
  const { createInvestment, loading: investmentLoading } =
    useEquityCampaignContext();
  const [showToast, setShowToast] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [investmentError, setInvestmentError] = useState<string>('');

  // Calculate processing fee and total amount
  useEffect(() => {
    if (isEquityCampaign && paymentAmount) {
      const amount = parseFloat(paymentAmount) || 0;
      const fee = Math.min(amount * 0.02, 120); // 2% fee capped at 120 GHS
      setProcessingFee(fee);
      setTotalAmount(amount + fee);
    } else {
      setProcessingFee(0);
      setTotalAmount(parseFloat(paymentAmount) || 0);
    }
  }, [paymentAmount, isEquityCampaign]);

  // Trigger toast visibility when error changes
  useEffect(() => {
    const error = isEquityCampaign ? investmentError : donationError;
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [donationError, investmentError, isEquityCampaign]);

const handlePayment = async () => {
  setShowToast(false);
  setInvestmentError('');
  if (!validatePaystackForm()) return;

  const amount = parseFloat(paymentAmount);
  if (isNaN(amount) || amount <= 0) return;

  if (isEquityCampaign) {
    try {
      const investmentData = {
        amount: totalAmount,
        email: paymentEmail,
        phone: paymentPhone,
        full_name: cardholderName,
        metadata: {
          ...(combinedMetadata || {}),
          processingFee,
          originalAmount: amount,
        },
      };

      const result = await createInvestment(campaignId, investmentData);

      if (!result.success) {
        let errorMessage = result.error || 'Investment failed';

        // Special handling for share availability errors
        if (result.data?.shares_available !== undefined) {
          const pricePerShare = result.data.shares_available > 0 
            ? (totalAmount / result.data.shares_available).toFixed(2)
            : 0;
          errorMessage += `. Current share price: ${pricePerShare}`;
        }

        if (result.validationErrors) {
          errorMessage = Object.entries(result.validationErrors)
            .map(([field, messages]) => {
              const message = Array.isArray(messages)
                ? messages.join(', ')
                : messages;
              return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`;
            })
            .join('\n');
        }

        if (result.code) {
          errorMessage += ` (Code: ${result.code})`;
        }

        setInvestmentError(errorMessage);
        setShowToast(true);
      }
    } catch (error) {
      setInvestmentError('An unexpected error occurred. Please try again.');
      setShowToast(true);
    }
  } else {
    createDonationTransaction(
      paymentEmail,
      cardholderName,
      paymentPhone,
      Number(paymentAmount),
      campaignId,
      campaignTitle,
      billingFrequency,
      combinedMetadata,
    );
  }
};

  const loading = isEquityCampaign ? investmentLoading : donationLoading;
  const error = isEquityCampaign ? investmentError : donationError;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable form content */}
      <div className="flex-grow overflow-y-auto p-4">
        {showToast && (error || investmentError) && (
          <ToastComponent
            type="error"
            isOpen={showToast}
            onClose={() => setShowToast(false)}
            description={(isEquityCampaign ? investmentError : error) || ''}
          />
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="cardholderName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="cardholderName"
              className={`w-full px-4 py-3 border rounded-lg ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
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
              Email
            </label>
            <input
              type="email"
              id="paymentEmail"
              className={`w-full px-4 py-3 border ${errors.paymentEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
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
              Phone
            </label>
            <input
              type="text"
              id="paymentPhone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your phone number"
              value={paymentPhone}
              onChange={(e) => setPaymentPhone(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="paymentAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="text"
              id="paymentAmount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
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

          {isEquityCampaign && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Processing Fee (2%):</span>
                <span className="font-medium">
                  {processingFee.toFixed(2)} GHS
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>{totalAmount.toFixed(2)} GHS</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                *Processing fee is capped at 120 GHS for equity campaigns
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed button at the bottom */}
      <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
        <button
          type="button"
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-medium"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </div>
    </div>
  );
};

export default PaystackForm;
