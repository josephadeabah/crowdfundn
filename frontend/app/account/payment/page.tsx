'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import PaystackIcon from '@/app/components/icons/PaystackIcon';

const PaymentPageContent = () => {
  const searchParams = useSearchParams();
  const method = searchParams.get('method');

  // Get other payment details from the query params (using camelCase)
  const cardNumber = searchParams.get('cardNumber') ?? '';
  const expirationDate = searchParams.get('expirationDate') ?? '';
  const cvv = searchParams.get('cvv') ?? '';
  const billingAddress = searchParams.get('billingAddress') ?? '';
  const country = searchParams.get('country') ?? '';
  const firstName = searchParams.get('firstName') ?? ''; // Use camelCase
  const lastName = searchParams.get('lastName') ?? ''; // Use camelCase
  const phone = searchParams.get('phone') ?? '';
  const email = searchParams.get('email') ?? '';

  const paymentMethods: {
    [key in 'creditCard' | 'paypal' | 'flutterwave' | 'paystack' | 'stripe']: {
      name: string;
      icon: JSX.Element;
    };
  } = {
    creditCard: { name: 'Credit Card', icon: <FaCreditCard /> },
    paypal: { name: 'PayPal', icon: <FaPaypal /> },
    flutterwave: { name: 'Flutterwave', icon: <SiFlutter /> },
    paystack: { name: 'PayStack', icon: <PaystackIcon /> },
    stripe: { name: 'Stripe', icon: <SiStripe /> },
  };

  const selectedMethod =
    typeof method === 'string' && method in paymentMethods
      ? paymentMethods[method as keyof typeof paymentMethods]
      : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {selectedMethod ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
          <div className="text-4xl mb-4">{selectedMethod.icon}</div>
          <h2 className="text-2xl font-semibold mb-2">{selectedMethod.name}</h2>
          <p className="text-gray-600">
            You selected {selectedMethod.name} as your payment method.
          </p>
          {/* Display payment details */}
          <p>Card Number: {cardNumber}</p>
          <p>Expiration Date: {expirationDate}</p>
          <p>CVV: {cvv}</p> {/* Add CVV display */}
          <p>Billing Address: {billingAddress}</p>
          <p>Country: {country}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
        </div>
      ) : (
        <p className="text-gray-600">No payment method selected.</p>
      )}
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense fallback={<p>Loading payment details...</p>}>
      <PaymentPageContent />
    </Suspense>
  );
};

export default PaymentPage;
