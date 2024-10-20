'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';

const PaymentPageContent = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentEmail, setPaymentEmail] = useState('');
  const [paymentPassword, setPaymentPassword] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const method = searchParams.get('method');
    const cardNumberParam = searchParams.get('cardNumber') ?? '';
    const expiryDateParam = searchParams.get('expirationDate') ?? '';
    const cvvParam = searchParams.get('cvv') ?? '';
    const firstName = searchParams.get('firstName') ?? '';
    const lastName = searchParams.get('lastName') ?? '';
    const paymentEmailParam = searchParams.get('email') ?? '';
    const payAmount = searchParams.get('amount');
    const phone = searchParams.get('phone');

    if (method) setPaymentMethod(method);
    if (cardNumberParam) setCardNumber(cardNumberParam);
    if (expiryDateParam) setExpiryDate(expiryDateParam);
    if (cvvParam) setCvv(cvvParam);
    if (firstName || lastName) setCardholderName(`${firstName} ${lastName}`);
    if (paymentEmailParam) setPaymentEmail(paymentEmailParam);
    if (payAmount) setPaymentAmount(payAmount);
    if (phone) setPaymentPhone(phone);
  }, [searchParams]);

  const paymentMethods: {
    [key in 'creditCard' | 'paypal' | 'flutterwave' | 'paystack' | 'stripe']: {
      name: string;
      icon: JSX.Element;
    };
  } = {
    creditCard: { name: 'Credit Card', icon: <FaCreditCard /> },
    paypal: { name: 'PayPal', icon: <FaPaypal /> },
    flutterwave: { name: 'Flutterwave', icon: <SiFlutter /> },
    paystack: {
      name: 'PayStack',
      icon: <PaystackIcon />,
    },
    stripe: { name: 'Stripe', icon: <SiStripe /> },
  };

  const selectedMethod =
    typeof paymentMethod === 'string' && paymentMethod in paymentMethods
      ? paymentMethods[paymentMethod as keyof typeof paymentMethods]
      : undefined;

  const validatePaymentForm = () => {
    let newErrors: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
      cardholderName?: string;
      paymentEmail?: string;
      paymentPassword?: string;
    } = {};
    if (!/^\d{16}$/.test(cardNumber))
      newErrors.cardNumber = 'Invalid card number';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate))
      newErrors.expiryDate = 'Invalid expiry date';
    if (!/^\d{3}$/.test(cvv)) newErrors.cvv = 'Invalid CVV';
    if (cardholderName.trim() === '')
      newErrors.cardholderName = 'Cardholder name is required';
    if (!/\S+@\S+\.\S+/.test(paymentEmail))
      newErrors.paymentEmail = 'Invalid email address';
    if (paymentPassword.trim() === '')
      newErrors.paymentPassword = 'Payment password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = validatePaymentForm();
    if (isValid) {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        alert('Payment processed successfully!');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center justify-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>

        <div className="max-w-md flex flex-col items-center justify-center">
          {selectedMethod ? (
            <div className="w-full flex items-center gap-6 p-6 shadow-sm max-w-md text-center mb-2">
              <div className="text-4xl mb-4">{selectedMethod.icon}</div>
              <h2 className="text-2xl font-semibold mb-2">
                {selectedMethod.name}
              </h2>
            </div>
          ) : (
            <p className="text-gray-600">No payment method selected.</p>
          )}
        </div>

        <form onSubmit={handleSubmitPayment}>
          {paymentMethod == 'creditCard' ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="cardNumber"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={
                    errors.cardNumber ? 'cardNumber-error' : undefined
                  }
                />
                {errors.cardNumber && (
                  <p
                    id="cardNumber-error"
                    className="mt-1 text-sm text-red-500"
                  >
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="expiryDate"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    aria-invalid={!!errors.expiryDate}
                    aria-describedby={
                      errors.expiryDate ? 'expiryDate-error' : undefined
                    }
                  />
                  {errors.expiryDate && (
                    <p
                      id="expiryDate-error"
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="cvv"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    aria-invalid={!!errors.cvv}
                    aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                  />
                  {errors.cvv && (
                    <p id="cvv-error" className="mt-1 text-sm text-red-500">
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="cardholderName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                />
              </div>
            </>
          ) : null}

          {paymentMethod == 'paystack' ? (
            <>
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                />
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
                />
              </div>
            </>
          ) : null}

          {paymentMethod == 'paypal' ? (
            <>
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                />
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
                />
              </div>
            </>
          ) : null}

          {paymentMethod == 'flutterwave' ? (
            <>
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                />
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
                />
              </div>
            </>
          ) : null}

          {paymentMethod == 'stripe' ? (
            <>
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                />
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
                />
              </div>
            </>
          ) : null}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <PaymentPageContent />
    </Suspense>
  );
};

export default PaymentPage;
