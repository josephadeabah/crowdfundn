import React, { useState } from 'react';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import Modal from '@/app/components/modal/Modal';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import ProcessingPayment from '@/app/components/donate/ProcessingPayment';

const DonationButton = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // State for payment details
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '12345678901234567',
    expirationDate: '01/22',
    cvv: '123',
    billingAddress: '123 Main St, Anytown USA',
    country: 'USA',
    first_name: 'John',
    last_name: 'Doe',
    phone: '1234567890',
    email: 'h7S7H@example.com',
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

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setIsPaymentModalOpen(false); // Close the payment modal
    setIsProcessing(true); // Start processing

    // Start processing and pass payment details
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedPaymentMethod('');
      setPaymentDetails({
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
    <div className="flex items-center">
      <button
        onClick={handleDonateClick}
        className="px-6 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
        aria-label="Donate Now"
      >
        Donate Now
      </button>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        size="medium"
        closeOnBackdropClick={true}
      >
        <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
        <form onSubmit={handlePaymentSubmit}>
          <div className="space-y-4 mb-6">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
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
                      ? 'border-red-500 bg-red-500'
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
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Processing Payment Modal */}
      {isProcessing && (
        <Modal
          isOpen={isProcessing}
          onClose={() => setIsProcessing(false)} // Optional: You may want to prevent closing this modal manually
          size="xlarge"
          closeOnBackdropClick={false}
        >
          <ProcessingPayment
            selectedPaymentMethod={selectedPaymentMethod}
            paymentDetails={paymentDetails} // Pass payment details here
          />
        </Modal>
      )}
    </div>
  );
};

export default DonationButton;
