import React from 'react';

interface PayPalFormProps {
  cardholderName: string;
  paymentEmail: string;
  paymentPhone: string;
  paymentAmount: string;
  errors: { [key: string]: string };
  setCardholderName: React.Dispatch<React.SetStateAction<string>>;
  setPaymentEmail: React.Dispatch<React.SetStateAction<string>>;
  setPaymentPhone: React.Dispatch<React.SetStateAction<string>>;
  setPaymentAmount: React.Dispatch<React.SetStateAction<string>>;
}

const PayPalForm: React.FC<PayPalFormProps> = ({
  cardholderName,
  paymentEmail,
  paymentPhone,
  paymentAmount,
  errors,
  setCardholderName,
  setPaymentEmail,
  setPaymentPhone,
  setPaymentAmount,
}) => {
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
    </>
  );
};

export default PayPalForm;
