import React, { useState } from 'react';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import Modal from '@/app/components/modal/Modal';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import ProcessingPayment from '@/app/components/donate/ProcessingPayment';
import { Button } from '../button/Button';

interface DonationButtonProps {
  selectedTier: number | null;
  pledgeAmount: string;
  billingFrequency: string;
}

const DonationButton: React.FC<DonationButtonProps> = ({
  selectedTier,
  pledgeAmount,
  billingFrequency,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '12345678901234567',
    expirationDate: '01/22',
    cvv: '123',
    billingAddress: '123 Main St, Anytown USA',
    country: 'USA',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    amount: pledgeAmount,
    email: 'test@example.com',
    type: 'Credit Card',
  });

  const paymentMethods = [
    { id: 'creditCard', name: 'Credit Card', icon: <FaCreditCard /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
    { id: 'flutterwave', name: 'Flutterwave', icon: <SiFlutter /> },
    { id: 'paystack', name: 'PayStack', icon: <PaystackIcon /> },
    { id: 'stripe', name: 'Stripe', icon: <SiStripe /> },
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
        className="w-full px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-red-500 to-gray-800 hover:from-gray-800 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow"
        aria-label="Donate Now"
      >
        Back Now
      </button>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        size="large"
        closeOnBackdropClick={true}
      >
        <h2 className="text-2xl font-bold mb-1">Select Payment Type</h2>
        <div className="text-gray-400 text-xs">
          Your payment information is saved in a payments profile, which is
          associated with your Bantuhive Account. If you want to change your
          payment method, you can do so from your account
          <a href="/account" className="ml-1 mr-1 text-red-500">
            settings
          </a>
          otherwise proceed to enter manually
        </div>
        <hr className="my-4" />
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4 mb-6">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? 'border-black bg-gray-100'
                    : 'border-gray-200 hover:border-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => handlePaymentMethodSelect(method.id)}
                  className="sr-only"
                />
                <span className="flex items-center">
                  {method.icon}
                  <span className="ml-3">{method.name}</span>
                </span>
                <span
                  className={`ml-auto w-5 h-5 border-2 rounded-full ${
                    selectedPaymentMethod === method.id
                      ? 'border-black bg-black'
                      : 'border-gray-300'
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
          />
        </Modal>
      )}
    </div>
  );
};

export default DonationButton;
