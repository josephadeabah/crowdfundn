import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProcessingPaymentProps {
  selectedPaymentMethod: string;
  paymentDetails: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    billingAddress: string;
    country: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    type: string;
  };
}

const ProcessingPayment: React.FC<ProcessingPaymentProps> = ({
  selectedPaymentMethod,
  paymentDetails,
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + 10,
      );
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);

      setTimeout(() => {
        const query = new URLSearchParams({
          method: selectedPaymentMethod,
          cardNumber: paymentDetails.cardNumber,
          expirationDate: paymentDetails.expirationDate,
          cvv: paymentDetails.cvv,
          billingAddress: paymentDetails.billingAddress,
          country: paymentDetails.country,
          firstName: paymentDetails.first_name,
          lastName: paymentDetails.last_name,
          phone: paymentDetails.phone,
          email: paymentDetails.email,
        }).toString();

        window.location.href = `/account/payment?${query}`;
      }, 3000);
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-3 max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Processing Your Request
        </h2>
        <div
          className="relative pt-1"
          role="progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                {isProcessing ? 'Processing' : 'Redirecting'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
            ></motion.div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4">
          {isProcessing ? (
            <FaSpinner className="animate-spin text-4xl text-teal-500" />
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-green-500 text-2xl"
            >
              ✓
            </motion.div>
          )}
        </div>
        <p className="text-center mt-4 text-gray-600">
          {isProcessing
            ? 'Please wait while we process your request...'
            : 'Processing complete. Redirecting to payment page...'}
        </p>
      </motion.div>
    </div>
  );
};

export default ProcessingPayment;
