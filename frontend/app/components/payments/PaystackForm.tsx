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
    investment: EquityInvestment;
    authorization_url?: string;
  };
  error?: string;
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
  const {
    createInvestment,
    loading: investmentLoading,
    error: investmentError,
  } = useEquityCampaignContext();
  const [showToast, setShowToast] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

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
    if (!validatePaystackForm()) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (isEquityCampaign) {
      // Handle equity investment
      const investmentData = {
        amount: amount, // Use base amount without fees for the investment record
        email: paymentEmail,
        phone: paymentPhone,
        full_name: cardholderName,
        metadata: combinedMetadata || {},
      };

      const result = (await createInvestment(
        campaignId,
        investmentData,
      )) as InvestmentResponse;
      if (result.success && result.data?.authorization_url) {
        window.location.href = result.data.authorization_url;
      }
    } else {
      // Handle regular donation
      createDonationTransaction(
        paymentEmail,
        cardholderName,
        paymentPhone,
        amount,
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
    <div className="max-h-screen my-10">
      {showToast && error && (
        <ToastComponent
          type="error"
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          description={error}
        />
      )}
      <div className="mb-4">
        <label
          htmlFor="cardholderName"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="cardholderName"
          className={`w-full px-3 py-2 border rounded-md ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="John Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          aria-invalid={!!errors.cardholderName}
          aria-describedby={
            errors.cardholderName ? 'cardholderName-error' : undefined
          }
        />
        {errors.cardholderName && (
          <p id="cardholderName-error" className="mt-1 text-sm text-red-500">
            {errors.cardholderName}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="paymentEmail"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="paymentEmail"
          className={`w-full px-3 py-2 border ${errors.paymentEmail ? 'border-red-500' : 'border-gray-300'} rounded-md`}
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

      <div className="mb-4">
        <label
          htmlFor="paymentPhone"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="text"
          id="paymentPhone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your phone number"
          value={paymentPhone}
          onChange={(e) => setPaymentPhone(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="paymentAmount"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="text"
          id="paymentAmount"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Processing Fee (2%):</span>
            <span className="font-medium">{processingFee.toFixed(2)} GHS</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total Amount:</span>
            <span>{totalAmount.toFixed(2)} GHS</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            *Processing fee is capped at 120 GHS for equity campaigns
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Pay'}
      </button>
    </div>
  );
};

export default PaystackForm;
