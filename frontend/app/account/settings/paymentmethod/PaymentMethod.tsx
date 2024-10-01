import React, { useState } from 'react';
import { FaCreditCard, FaPlus, FaTimes, FaEdit } from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    billingAddress: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expirationDate?: string;
    cvv?: string;
    billingAddress?: string;
    country?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [paymentToRemove, setPaymentToRemove] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'cardNumber':
        newErrors.cardNumber = /^\d{16}$/.test(value)
          ? ''
          : 'Invalid card number';
        break;
      case 'expirationDate':
        newErrors.expirationDate = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
          ? ''
          : 'Invalid expiration date';
        break;
      case 'cvv':
        newErrors.cvv = /^\d{3,4}$/.test(value) ? '' : 'Invalid CVV';
        break;
      case 'billingAddress':
        newErrors.billingAddress = value.trim()
          ? ''
          : 'Billing address required';
        break;
      case 'country':
        newErrors.country = value.trim() ? '' : 'Country required';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isEditing && editingPaymentId) {
      setPaymentMethods((prevMethods) =>
        prevMethods.map((method) =>
          method.id === editingPaymentId
            ? {
                ...method,
                last4: newPayment.cardNumber.slice(-4),
                email: undefined,
              }
            : method,
        ),
      );
    } else {
      const newMethod = {
        id: paymentMethods.length + 1,
        type: 'Credit Card',
        last4: newPayment.cardNumber.slice(-4),
        icon: FaCreditCard,
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }

    setIsModalOpen(false);
    setNewPayment({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      billingAddress: '',
      country: '',
    });
    setIsEditing(false);
    setEditingPaymentId(null);
    setIsLoading(false);
  };

  const handleRemovePayment = (id: number) => {
    setPaymentToRemove(id);
    setIsAlertOpen(true);
  };

  const confirmRemovePayment = async () => {
    if (paymentToRemove !== null) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentMethods(
        paymentMethods.filter((method) => method.id !== paymentToRemove),
      );
      setIsLoading(false);
    }
    setIsAlertOpen(false);
    setPaymentToRemove(null);
  };

  const cancelRemovePayment = () => {
    setIsAlertOpen(false);
    setPaymentToRemove(null);
  };

  const handleEditPayment = (method: any) => {
    setNewPayment({
      cardNumber: '**** **** **** ' + method.last4,
      expirationDate: '',
      cvv: '',
      billingAddress: '',
      country: '',
    });
    setIsEditing(true);
    setEditingPaymentId(method.id);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50">
      <div className="rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-theme-color-primary-content">
          Payment Information
        </h2>
        <p className="mb-2">
          <span className="font-medium">Name:</span> John Doe
        </p>
        <p className="mb-4">
          <span className="font-medium">Account ID:</span> 123456789
        </p>

        {paymentMethods.length === 0 ? (
          <p>No payment method found. Please add one.</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-3 text-theme-color-primary-content">
              Payment Methods
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-theme-color-base rounded-md p-4 flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center">
                    <method.icon className="text-2xl mr-3 text-theme-color-primary" />
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-gray-600">
                        {method.last4 ? `**** ${method.last4}` : method.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => handleEditPayment(method)}
                      className="text-theme-color-primary hover:text-theme-color-primary-dark transition-colors mr-3"
                      aria-label={`Edit ${method.type}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemovePayment(method.id)}
                      aria-label={`Remove ${method.type}`}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <AlertPopup
              title="Confirm Removal"
              message="Are you sure you want to remove this payment method?"
              isOpen={isAlertOpen}
              setIsOpen={setIsAlertOpen}
              onConfirm={confirmRemovePayment}
              onCancel={cancelRemovePayment}
            />
          </>
        )}

        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setNewPayment({
              cardNumber: '',
              expirationDate: '',
              cvv: '',
              billingAddress: '',
              country: '',
            });
          }}
          className="mt-6 bg-theme-color-primary text-gray-800 px-4 py-2 rounded-md hover:bg-theme-color-primary-dark transition-colors flex items-center"
          aria-label="Add Payment Method"
        >
          <FaPlus className="mr-2" />{' '}
          {isEditing ? 'Edit Payment Method' : 'Add Payment'}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="medium"
      >
        <h2 className="text-2xl font-bold mb-4 text-theme-color-primary">
          {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
        </h2>
        <form onSubmit={handleAddPayment}>
          {/* Card Number Field */}
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block mb-1 font-medium">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={newPayment.cardNumber}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="expirationDate"
                className="block mb-1 font-medium"
              >
                Expiration Date
              </label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={newPayment.expirationDate}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.expirationDate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                required
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expirationDate}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="cvv" className="block mb-1 font-medium">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={newPayment.cvv}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123"
                required
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="billingAddress" className="block mb-1 font-medium">
              Billing Address
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={newPayment.billingAddress}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.billingAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main St, City, State, ZIP"
              required
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.billingAddress}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="country" className="block mb-1 font-medium">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={newPayment.country}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="United States"
              required
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-theme-color-primary text-gray-800 px-4 py-2 rounded-md hover:bg-theme-color-primary-dark transition-colors"
              disabled={isLoading}
            >
              {isLoading
                ? 'Processing...'
                : isEditing
                  ? 'Update Payment'
                  : 'Add Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentMethod;
