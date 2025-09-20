import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import Modal from '@/app/components/modal/Modal';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import ProcessingPayment from '@/app/components/donate/ProcessingPayment';
import { Button } from '../button/Button';
import { useUserContext } from '@/app/context/users/UserContext';
import { cn } from '@/app/lib/utils';
import InfoTooltip from '../tooltip/tooltip';

interface DonationButtonProps {
  selectedTier: number | null;
  pledgeAmount: string;
  billingFrequency: string;
  isEquityCampaign?: boolean;
  fundraiserDetails: {
    id: string;
    campaignId: string;
    campaignTitle?: string;
  };
}

const DonationButton: React.FC<DonationButtonProps> = ({
  selectedTier,
  pledgeAmount,
  billingFrequency,
  isEquityCampaign,
  fundraiserDetails,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { userAccountData, fetchUserProfile } = useUserContext();

  useEffect(() => {
    // Fetch user profile if not available or if needed
    if (!userAccountData) {
      fetchUserProfile();
    }
  }, [userAccountData, fetchUserProfile]);

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '12345678901234567',
    expirationDate: '01/22',
    cvv: '123',
    billingAddress: '',
    country: userAccountData?.country || 'Ghana',
    first_name: userAccountData?.full_name || '',
    last_name: '',
    phone: `${userAccountData?.phone_code || ''}${userAccountData?.phone_number || ''}`,
    amount: pledgeAmount,
    email: userAccountData?.email || '',
    type: userAccountData?.payment_method || 'paystack',
  });

  const paymentMethods = [
    {
      id: 'creditCard',
      name: ' Credit Card with Bank Payment',
      icon: <FaCreditCard />,
    },
    { id: 'paypal', name: 'Credit Card with PayPal', icon: <FaPaypal /> },
    {
      id: 'flutterwave',
      name: 'Mobile Money &  Credit Card with Flutterwave',
      icon: <SiFlutter />,
    },
    {
      id: 'paystack',
      name: 'Mobile Money &  Credit Card with PayStack',
      icon: <PaystackIcon />,
    },
    {
      id: 'stripe',
      name: 'Credit Card & Google Pay with Stripe',
      icon: <SiStripe />,
    },
  ];

  const handleDonateClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setError('');
  };

  const billing = {
    frequency: billingFrequency,
    amount: pledgeAmount,
    tier: selectedTier !== null ? selectedTier.toString() : 'N/A',
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setIsPaymentModalOpen(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSelectedPaymentMethod('');
      setPaymentDetails({
        amount: billing.amount,
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        billingAddress: '',
        country: '',
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        type: '',
      });
    }, 6000);
  };

  // Tooltip content with the payment information
  const paymentInfoTooltip = `
    We currently support payment with PayStack. If your preferred
    payment method is disabled, kindly wait for future availability.
    <br /><br />
    You'll receive one email from us and one from Paystack after payment.
  `;

  return (
    <div className="flex items-center max-w-full">
      <button
        onClick={handleDonateClick}
        className={cn(
          'w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r focus:outline-none focus:ring-2 transform hover:scale-105 transition-all duration-200 shadow',
          isEquityCampaign
            ? 'from-orange-500 to-orange-800 hover:from-orange-800 hover:to-orange-600 focus:ring-orange-500'
            : 'from-green-500 to-green-800 hover:from-green-800 hover:to-green-600 focus:ring-green-500 focus:ring-opacity-50',
        )}
        aria-label="Fund Now"
      >
        {isEquityCampaign ? 'Invest' : 'Support Now'}
      </button>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        size="xlarge"
        closeOnBackdropClick={true}
      >
        <div className="overflow-y-auto max-h-[80vh] py-6 bg-white text-gray-800">
          {/* Header with title and action buttons at the top */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Select Payment Type</h2>
              <InfoTooltip
                id="payment-info-tooltip"
                content={paymentInfoTooltip}
                iconSize={18}
              />
            </div>

            {/* Action buttons moved to top */}
            <div className="flex space-x-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="payment-form"
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? 'Processing...' : 'Proceed'}
              </Button>
            </div>
          </div>

          <hr className="mb-6" />

          <form id="payment-form" onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  } ${method.id !== 'paystack' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => {
                      if (method.id === 'paystack') {
                        handlePaymentMethodSelect(method.id);
                      }
                    }}
                    className="sr-only"
                    disabled={method.id !== 'paystack'}
                  />
                  <span className="flex items-center flex-1">
                    <span className="text-lg mr-3">{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </span>
                  <span
                    className={`ml-3 flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                      selectedPaymentMethod === method.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPaymentMethod === method.id && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {error && (
              <p className="text-red-500 mb-4 text-sm" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </Modal>

      {/* Processing Payment Modal */}
      {isProcessing && (
        <Modal
          isOpen={isProcessing}
          onClose={() => setIsProcessing(false)}
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <ProcessingPayment
            selectedPaymentMethod={selectedPaymentMethod}
            paymentDetails={paymentDetails}
            billing={billing}
            fundraiserDetails={{
              id: String(fundraiserDetails?.id),
              campaignId: String(fundraiserDetails?.campaignId),
              campaignTitle: fundraiserDetails?.campaignTitle,
            }}
            isEquityCampaign={isEquityCampaign}
          />
        </Modal>
      )}
    </div>
  );
};

export default DonationButton;
