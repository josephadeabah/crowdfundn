import React, { useState } from 'react';
import {
  FaCreditCard,
  FaPlus,
  FaTimes,
  FaEdit,
  FaPaypal,
  FaStripe,
} from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { SiFlutter } from 'react-icons/si';
import PaystackIcon from '@/app/components/icons/PaystackIcon';

const PaymentMethod = () => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [paymentToRemove, setPaymentToRemove] = useState<number | null>(null);

  const [userDetails, setUserDetails] = useState({
    accountId: '',
    name: '',
    userEmail: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
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

  const renderPayentMethodIcons = (type: string) => {
    switch (type) {
      case 'Credit Card':
        return (
          <FaCreditCard className="text-2xl mr-3 text-theme-color-primary" />
        );
      case 'PayPal':
        return <FaPaypal className="text-2xl mr-3 text-theme-color-primary" />;
      case 'Stripe':
        return <FaStripe className="text-2xl mr-3 text-theme-color-primary" />;
      case 'Flutterwave':
        return <SiFlutter className="text-2xl mr-3 text-theme-color-primary" />;
      case 'Paystack':
        return (
          <PaystackIcon className="text-2xl mr-3 text-theme-color-primary" />
        );
      default:
        return null;
    }
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
                email: newPayment.email,
                expirationDate: newPayment.expirationDate,
                billingAddress: newPayment.billingAddress,
                country: newPayment.country,
                type: newPayment.type,
                cardNumber: newPayment.cardNumber,
                first_name: newPayment.first_name,
                last_name: newPayment.last_name,
                phone: newPayment.phone,
              }
            : method,
        ),
      );
    } else {
      const newMethod = {
        id: paymentMethods.length + 1,
        type: newPayment.type, // Use the type from newPayment
        last4: newPayment.cardNumber.slice(-4),
        email: newPayment.email,
        first_name: newPayment.first_name,
        last_name: newPayment.last_name,
      };
      setPaymentMethods([...paymentMethods, newMethod]);

      // Set user details to display
      setUserDetails({
        name: newMethod.first_name + ' ' + newMethod.last_name,
        userEmail: newMethod.email, // or any other name field you might have
        accountId: newMethod.id.toString(), // using ID as account ID for demo
      });
    }

    setIsModalOpen(false);
    setNewPayment({
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
      first_name: method.first_name,
      last_name: method.last_name,
      phone: method.phone,
      email: method.email,
      type: method.type,
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

        {userDetails.name && userDetails.accountId ? (
          <>
            <p className="mb-2">
              <span className="font-medium">Name:</span> {userDetails.name}
            </p>
            <p className="mb-4">
              <span className="font-medium">Account ID:</span>{' '}
              {userDetails.accountId}
            </p>
          </>
        ) : (
          <p>No payment method found. Please add one.</p>
        )}

        {paymentMethods.length > 0 && (
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
                    {renderPayentMethodIcons(method.type)}
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-gray-600">
                        {method.type === 'Credit Card'
                          ? `**** ${method.last4}`
                          : method.email}
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
          </>
        )}

        {/* Button to add a new payment method */}
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
              first_name: '',
              last_name: '',
              phone: '',
              email: '',
              type: '',
            });
          }}
          className="mt-6 bg-theme-color-primary text-gray-800 px-4 py-2 rounded-md hover:bg-theme-color-primary-dark transition-colors flex items-center"
          aria-label="Add Payment Method"
        >
          <FaPlus className="mr-2" />
          Add Payment
        </button>

        <AlertPopup
          title="Confirm Removal"
          message="Are you sure you want to remove this payment method?"
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          onConfirm={confirmRemovePayment}
          onCancel={cancelRemovePayment}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="medium"
      >
        <h2 className="text-2xl font-bold mb-4 text-theme-color-primary">
          {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
        </h2>

        <div className="mb-4">
          <label htmlFor="type" className="block mb-1 font-medium">
            Payment Type
          </label>
          <select
            id="type"
            name="type"
            value={newPayment.type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md border-gray-300"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
            <option value="Flutterwave">Flutterwave</option>
            <option value="Paystack">Paystack</option>
          </select>
        </div>

        <form onSubmit={handleAddPayment}>
          {/* Conditional Fields Rendering */}
          {newPayment.type === 'Credit Card' ? (
            <>
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
                  className={`w-full p-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
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
                    className={`w-full p-2 border rounded-md ${errors.expirationDate ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full p-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123"
                    required
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="billingAddress"
                  className="block mb-1 font-medium"
                >
                  Billing Address
                </label>
                <input
                  type="text"
                  id="billingAddress"
                  name="billingAddress"
                  value={newPayment.billingAddress}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.billingAddress ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="United States"
                  required
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
            </>
          ) : (
            // Render only the email field for other payment methods
            <>
              <div className="mb-6">
                <label htmlFor="first_name" className="block mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={newPayment.first_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John"
                  required
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="last_name" className="block mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={newPayment.last_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Doe"
                  required
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newPayment.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="(123) 456-7890"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newPayment.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-gray-300"
                  placeholder="example@example.com"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mr-4 bg-gray-100 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors"
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
