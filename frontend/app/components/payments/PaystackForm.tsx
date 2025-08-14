import React, { useEffect, useState } from 'react';
import { useDonationsContext } from '@/app/context/account/donations/DonationsContext';
import ToastComponent from '@/app/components/toast/Toast';
import { Reward } from '@/app/context/account/rewards/RewardsContext';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';
import { EquityInvestment } from '@/app/types/equityCampaigns.types';

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

interface InvestmentResponse {
  success: boolean;
  data?: {
    investment?: {
      id: string;
      amount: number;
      shares: number;
      percentage: number;
    };
    authorization_url?: string;
    reference?: string;
    code?: string;
  };
  error?: string;
  validationErrors?: Record<string, string | string[]>;
  code?: string;
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
    
    if (!validatePaystackForm()) {
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setInvestmentError('Please enter a valid amount');
      setShowToast(true);
      return;
    }

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
            shippingData: combinedMetadata?.shippingData,
            selectedRewards: combinedMetadata?.selectedRewards,
            deliveryOption: combinedMetadata?.deliveryOption,
          },
        };

        const result = (await createInvestment(
          campaignId,
          investmentData,
        )) as InvestmentResponse;

        if (!result.success) {
          let errorMessage = result.error || 'Investment failed';

          if (result.validationErrors) {
            errorMessage = Object.entries(result.validationErrors)
              .map(([field, messages]) => {
                const message = Array.isArray(messages)
                  ? messages.join(', ')
                  : messages;
                // Map backend field names to frontend names
                const displayField = field === 'full_name' ? 'name' : 
                                  field === 'metadata.email' ? 'email' : 
                                  field === 'metadata.phone' ? 'phone' : field;
                return `${displayField.charAt(0).toUpperCase() + displayField.slice(1)}: ${message}`;
              })
              .join('\n');
          }

          if (result.code) {
            errorMessage += ` (Code: ${result.code})`;
          }

          setInvestmentError(errorMessage);
          setShowToast(true);
        } else if (result.data?.authorization_url) {
          window.location.href = result.data.authorization_url;
        } else {
          setInvestmentError('No authorization URL received from server');
          setShowToast(true);
        }
      } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        setInvestmentError(errorMessage);
        setShowToast(true);
        console.error('Investment error:', error);
      }
    } else {
      try {
        await createDonationTransaction(
          paymentEmail,
          cardholderName,
          paymentPhone,
          Number(paymentAmount),
          campaignId,
          campaignTitle,
          billingFrequency,
          combinedMetadata,
        );
      } catch (error: any) {
        setInvestmentError(error.message || 'Donation processing failed');
        setShowToast(true);
      }
    }
  };

  const loading = isEquityCampaign ? investmentLoading : donationLoading;
  const error = isEquityCampaign ? investmentError : donationError;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable form content */}
      <div className="flex-grow overflow-y-auto p-4">
        {showToast && error && (
          <ToastComponent
            type="error"
            isOpen={showToast}
            onClose={() => setShowToast(false)}
            description={error}
          />
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="cardholderName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="cardholderName"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.cardholderName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              aria-invalid={!!errors.cardholderName}
              aria-describedby={
                errors.cardholderName ? 'cardholderName-error' : undefined
              }
              required
            />
            {errors.cardholderName && (
              <p id="cardholderName-error" className="mt-1 text-sm text-red-500">
                {errors.cardholderName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentEmail"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="paymentEmail"
              className={`w-full px-4 py-3 border ${
                errors.paymentEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-lg`}
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
              Phone Number
            </label>
            <input
              type="tel"
              id="paymentPhone"
              className={`w-full px-4 py-3 border ${
                errors.paymentPhone ? 'border-red-500' : 'border-gray-300'
              } rounded-lg`}
              placeholder="+233XXXXXXXXX"
              value={paymentPhone}
              onChange={(e) => setPaymentPhone(e.target.value)}
              aria-invalid={!!errors.paymentPhone}
              aria-describedby={
                errors.paymentPhone ? 'paymentPhone-error' : undefined
              }
            />
            {errors.paymentPhone && (
              <p id="paymentPhone-error" className="mt-1 text-sm text-red-500">
                {errors.paymentPhone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Amount (GHS)
            </label>
            <input
              type="number"
              id="paymentAmount"
              className={`w-full px-4 py-3 border ${
                errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
              } rounded-lg`}
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                  setPaymentAmount(value);
                }
              }}
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
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-medium transition-colors duration-200"
          disabled={loading}
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
            'Proceed to Pay'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaystackForm;