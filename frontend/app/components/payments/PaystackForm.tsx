import React, { useState } from 'react';
import PaystackPop from '@paystack/inline-js';

interface PaystackFormProps {
  cardholderName: string;
  paymentEmail: string;
  paymentPhone: string;
  paymentAmount: string;
  fundraiserId: string;
  campaignId: string;
  billingFrequency: string;
  errors: { [key: string]: string };
  setCardholderName: React.Dispatch<React.SetStateAction<string>>;
  setPaymentEmail: React.Dispatch<React.SetStateAction<string>>;
  setPaymentPhone: React.Dispatch<React.SetStateAction<string>>;
  setPaymentAmount: React.Dispatch<React.SetStateAction<string>>;
}

const PaystackForm: React.FC<PaystackFormProps> = ({
  cardholderName,
  paymentEmail,
  paymentPhone,
  paymentAmount,
  fundraiserId,
  campaignId,
  billingFrequency,
  errors,
  setCardholderName,
  setPaymentEmail,
  setPaymentPhone,
  setPaymentAmount,
}) => {
  const [loading, setLoading] = useState(false); // Add loading state

  const handlePayment = async () => {
    setLoading(true); // Set loading to true when starting the payment process

    try {
      // Step 1: Create the donation transaction in the backend
      const donationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/donations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: paymentAmount,
            email: paymentEmail,
            metadata: {
              custom_data: 'any additional info', // You can add additional metadata here
            },
          }),
        },
      );

      const donationData = await donationResponse.json();

      if (!donationResponse.ok) {
        throw new Error(donationData.error || 'Failed to create donation');
      }

      const { authorization_url, donation } = donationData;

      // Step 2: Redirect to Paystack using the authorization URL
      if (authorization_url) {
        window.location.href = authorization_url; // Redirect the user to Paystack for payment
      } else {
        throw new Error('Authorization URL not found');
      }

      // Initialize Paystack and create a new transaction
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: paymentEmail,
        amount: Number(paymentAmount) * 100, // Convert to kobo
        metadata: {
          custom_fields: [
            {
              display_name: 'Donation ID',
              variable_name: 'donation_id',
              value: donation.id,
            },
            {
              display_name: 'Campaign ID',
              variable_name: 'campaign_id',
              value: campaignId,
            },
            {
              display_name: 'Fundraiser ID',
              variable_name: 'fundraiser_id',
              value: fundraiserId,
            },
          ],
        },
        onSuccess: async (transaction) => {
          try {
            // Step 3: Perform transaction verification after successful payment
            if (transaction && transaction.reference) {
              const verifyResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/donations/${transaction.reference}/verify`,
                {
                  method: 'GET', // Assuming GET for verification, but update if POST is required
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              );

              const verificationData = await verifyResponse.json();

              console.log('Verification data', verificationData);

              if (verifyResponse.ok) {
                alert('Donation successful! Thank you for your contribution.');
                // You can redirect to a confirmation page or show a success message
              } else {
                alert('Donation verification failed. Please try again.');
              }
            } else {
              alert(
                'Transaction was successful, but no transaction reference was found.',
              );
            }
          } catch (error) {
            alert('An error occurred while verifying the payment.');
          }
        },
        onCancel: () => {
          alert('Transaction was canceled.');
        },
        onError: (error) => {
          alert(`An error occurred: ${error.message}`);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setLoading(false); // Set loading to false after the process ends
    }
  };

  return (
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

      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Pay'}
      </button>
    </>
  );
};

export default PaystackForm;
