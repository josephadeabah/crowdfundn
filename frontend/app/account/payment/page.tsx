'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
import { SiFlutter, SiStripe } from 'react-icons/si';
import PaystackIcon from '@/app/components/icons/PaystackIcon';
import FullscreenLoader from '@/app/loaders/FullscreenLoader';
import dynamic from 'next/dynamic';
import CreditCardForm from '@/app/components/payments/CreditCardForm';
import StripeForm from '@/app/components/payments/StripeForm';
import FlutterwaveForm from '@/app/components/payments/FlutterwaveForm';
import PayPalForm from '@/app/components/payments/PayPalForm';
import { jwtVerify } from 'jose';

const PaystackForm = dynamic(
  () => import('@/app/components/payments/PaystackForm'),
  { ssr: false },
);

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET!;

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
  const [fundraiserId, setFundraiserId] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [billingFrequency, setBillingFrequency] = useState('');
  const [tokenState, setTokenState] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const decodeToken = async () => {
        try {
          // Prepare the secret key
          const encoder = new TextEncoder();
          const encodedSecret = encoder.encode(secretKey);

          // Verify and decode the token
          const { payload } = await jwtVerify(token, encodedSecret);

          // Populate state with decoded token data
          if (payload.method) setPaymentMethod(payload.method as string);
          if (payload.paymentDetails) {
            const {
              cardNumber,
              expirationDate,
              cvv,
              firstName,
              lastName,
              email,
              phone,
            } = payload.paymentDetails as any;

            setCardNumber(cardNumber || '');
            setExpiryDate(expirationDate || '');
            setCvv(cvv || '');
            setCardholderName(`${firstName || ''} ${lastName || ''}`.trim());
            setPaymentEmail(email || '');
            setPaymentPhone(phone || '');
          }
          if (
            payload.billing &&
            typeof payload.billing === 'object' &&
            'amount' in payload.billing &&
            'frequency' in payload.billing
          ) {
            setPaymentAmount(String(payload.billing.amount) || '');
            setBillingFrequency(String(payload.billing.frequency) || '');
          }
          if (payload.fundraiserDetails) {
            const { id, campaignId, campaignTitle } =
              payload.fundraiserDetails as any;
            setFundraiserId(id || '');
            setCampaignId(campaignId || '');
            setCampaignTitle(campaignTitle || '');
          }
        } catch (error) {
          setTokenState(
            'Invalid or expired token. Please restart the payment process.',
          );
        }
      };

      decodeToken();
    }
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
    const newErrors: {
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

  const validatePayStackForm = () => {
    const newErrors: {
      paymentEmail?: string;
      paymentAmount?: string;
    } = {};
    // Validate email
    if (!/\S+@\S+\.\S+/.test(paymentEmail)) {
      newErrors.paymentEmail = 'Invalid email address';
    }
    // Validate payment amount (must be a positive number)
    const amount = parseFloat(paymentAmount);
    if (!paymentAmount || isNaN(amount) || amount <= 0) {
      newErrors.paymentAmount = 'Amount must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            <>
              <p className="text-gray-600">No Payment Method Selected.</p>
              <p className="text-red-500 text-sm">{tokenState}</p>
            </>
          )}
        </div>

        <form>
          {paymentMethod === 'creditCard' && (
            <CreditCardForm
              cardNumber={cardNumber}
              expiryDate={expiryDate}
              cvv={cvv}
              cardholderName={cardholderName}
              paymentAmount={paymentAmount}
              errors={errors}
              setCardNumber={setCardNumber}
              setExpiryDate={setExpiryDate}
              setCvv={setCvv}
              setCardholderName={setCardholderName}
              setPaymentAmount={setPaymentAmount}
            />
          )}

          {paymentMethod === 'paystack' && (
            <PaystackForm
              cardholderName={cardholderName}
              paymentEmail={paymentEmail}
              paymentPhone={paymentPhone}
              paymentAmount={paymentAmount}
              campaignId={campaignId}
              campaignTitle={campaignTitle}
              billingFrequency={billingFrequency}
              errors={errors}
              isPaymentFormValidated={validatePayStackForm}
              setCardholderName={setCardholderName}
              setPaymentEmail={setPaymentEmail}
              setPaymentPhone={setPaymentPhone}
              setPaymentAmount={setPaymentAmount}
            />
          )}

          {paymentMethod === 'paypal' && (
            <PayPalForm
              cardholderName={cardholderName}
              paymentEmail={paymentEmail}
              paymentPhone={paymentPhone}
              paymentAmount={paymentAmount}
              errors={errors}
              setCardholderName={setCardholderName}
              setPaymentEmail={setPaymentEmail}
              setPaymentPhone={setPaymentPhone}
              setPaymentAmount={setPaymentAmount}
            />
          )}

          {paymentMethod === 'flutterwave' && (
            <FlutterwaveForm
              cardholderName={cardholderName}
              paymentEmail={paymentEmail}
              paymentPhone={paymentPhone}
              paymentAmount={paymentAmount}
              errors={errors}
              setCardholderName={setCardholderName}
              setPaymentEmail={setPaymentEmail}
              setPaymentPhone={setPaymentPhone}
              setPaymentAmount={setPaymentAmount}
            />
          )}

          {paymentMethod === 'stripe' && (
            <StripeForm
              cardholderName={cardholderName}
              paymentEmail={paymentEmail}
              paymentPhone={paymentPhone}
              paymentAmount={paymentAmount}
              errors={errors}
              setCardholderName={setCardholderName}
              setPaymentEmail={setPaymentEmail}
              setPaymentPhone={setPaymentPhone}
              setPaymentAmount={setPaymentAmount}
            />
          )}
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
