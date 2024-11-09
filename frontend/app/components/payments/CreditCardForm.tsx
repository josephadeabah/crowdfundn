import React from 'react';

interface CreditCardFormProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  paymentAmount: string;
  errors: { [key: string]: string };
  setCardNumber: React.Dispatch<React.SetStateAction<string>>;
  setExpiryDate: React.Dispatch<React.SetStateAction<string>>;
  setCvv: React.Dispatch<React.SetStateAction<string>>;
  setCardholderName: React.Dispatch<React.SetStateAction<string>>;
  setPaymentAmount: React.Dispatch<React.SetStateAction<string>>;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  cardNumber,
  expiryDate,
  cvv,
  cardholderName,
  paymentAmount,
  errors,
  setCardNumber,
  setExpiryDate,
  setCvv,
  setCardholderName,
  setPaymentAmount,
}) => {
  return (
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
          aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
        />
        {errors.cardNumber && (
          <p id="cardNumber-error" className="mt-1 text-sm text-red-500">
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
            <p id="expiryDate-error" className="mt-1 text-sm text-red-500">
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
          <p id="cardholderName-error" className="mt-1 text-sm text-red-500">
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
  );
};

export default CreditCardForm;
