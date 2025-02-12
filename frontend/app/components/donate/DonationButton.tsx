import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import Modal from '@/app/components/modal/Modal';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import ProcessingPayment from '@/app/components/donate/ProcessingPayment';
import { Button } from '../button/Button';
import { useUserContext } from '@/app/context/users/UserContext';

interface DonationButtonProps {
  selectedTier: number | null;
  pledgeAmount: string;
  billingFrequency: string;
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

  return (
    <div className="flex items-center max-w-full">
      <button
        onClick={handleDonateClick}
        className="w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-green-500 to-green-800 hover:from-green-800 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow"
        aria-label="Donate Now"
      >
        Back Now
      </button>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        size="xlarge"
        closeOnBackdropClick={true}
      >
        <div className="overflow-y-auto max-h-[60vh] p-2 bg-white dark:bg-neutral-800">
          <h2 className="text-2xl font-bold mb-1">Select Payment Type</h2>
          <div className="text-orange-500 text-xs">
            We currently support payment with PayStack. If your preferred
            payment method is disabled, kindly wait for future availability.
            <p className="text-gray-600">
              You'll receive one email from us and one from Paystack after
              payment.
            </p>
          </div>
          <hr className="my-4" />
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-3 border rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === method.id
                      ? 'border-green bg-green-100'
                      : 'border-green-200 hover:border-green-800'
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
                  <span className="flex items-center">
                    {method.icon}
                    <span className="ml-3">{method.name}</span>
                  </span>
                  <span
                    className={`ml-auto w-5 h-5 border-2 rounded-full ${
                      selectedPaymentMethod === method.id
                        ? 'border-green-600 bg-green-600'
                        : 'border-green-300'
                    }`}
                  ></span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-red-500 mb-4" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                size="lg"
                variant="default"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-gray-800 dark:text-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
                disabled={isProcessing}
                size="lg"
                variant="default"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </div>
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
            billing={billing} // Ensure billing is correctly structured
            fundraiserDetails={{
              id: String(fundraiserDetails?.id),
              campaignId: String(fundraiserDetails?.campaignId),
              campaignTitle: fundraiserDetails?.campaignTitle,
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default DonationButton;
