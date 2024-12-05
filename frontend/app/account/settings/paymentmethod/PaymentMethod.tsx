import React, { useEffect, useState } from 'react';
import { FaPlus, FaTimes, FaEdit } from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

import PaymentMethodIcons from './PaymethodIcons';
import { validateField } from './validatedfield';
import { useAuth } from '@/app/context/auth/AuthContext';

type Bank = {
  display_name: string;
  variable_name: string;
  value: string; // Settlement bank code
};

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
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);

  const { user } = useAuth();

  const [userDetails, setUserDetails] = useState({
    accountId: '',
    name: '',
    userEmail: '',
  });

  // Fetch the bank list on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);
        if (!user) {
          console.error('User is not authenticated.');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user.country.toLowerCase()}&per_page=20`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', // Ensure content type is set to JSON
              Accept: 'application/json', // Accept JSON responses
            },
          },
        );
        const data = await response.json();

        // Assuming `data` is the array of bank details
        const formattedBanks = data.data.map((bank: any) => ({
          display_name: bank.name,
          variable_name: bank.slug,
          value: bank.code, // Settlement bank code
        }));

        console.log('Formatted Banks:', formattedBanks);

        setBanks(formattedBanks);
      } catch (error) {
        console.error('Failed to fetch banks', error);
        alert('Failed to load the bank list. Please try again.');
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });

    // Update errors state by passing current errors and the field being validated
    // const updatedErrors = validateField(name, value, errors);
    // setErrors(updatedErrors); // Update the errors state
  };

  const handleAddPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if there are errors
    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setIsLoading(true);

    // Ensure bank is selected and user is authenticated
    if (!selectedBank) {
      alert('Please select a bank.');
      return;
    }

    if (!user) {
      alert('User is not authenticated.');
      return;
    }

    // Add a delay to simulate a loading state
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Prepare the payload for the payment method and subaccount creation
    const payload = {
      subaccount: {
        business_name: user.full_name,
        settlement_bank: selectedBank.value,
        account_number: newPayment.cardNumber,
        percentage_charge: 20,
        metadata: {
          custom_fields: [
            {
              display_name: selectedBank.display_name,
              variable_name: selectedBank.variable_name,
              value: selectedBank.value,
            },
          ],
        },
      },
    };

    // Handle editing or adding payment method to the state
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

    // Call the API to create the subaccount
    try {
      setIsSubmitting(true);
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user.id}/create_subaccount`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      alert('Subaccount created successfully!');
      console.log(data);
    } catch (error) {
      alert('Error creating subaccount. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }

    // Close the modal and reset form data
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
                    {PaymentMethodIcons(method.type)}
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
            Add where to receive your money
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
          </select>
        </div>

        <form onSubmit={handleAddPayment}>
          {/* Conditional Fields Rendering */}
          {newPayment.type === 'Credit Card' ? (
            <>
              <div className="mb-4">
                <label htmlFor="bank">Select Your Bank</label>
                {isLoadingBanks ? (
                  <p>Loading banks...</p>
                ) : (
                  <select
                    id="bank"
                    value={selectedBank?.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedBank(
                        banks.find((bank) => bank.value === e.target.value) ||
                          null,
                      )
                    }
                    className="w-full p-2 border rounded-md border-gray-300"
                    required
                  >
                    <option value="" disabled>
                      Select a bank
                    </option>
                    {banks.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.display_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block mb-1 font-medium">
                  Account Number
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
            </>
          ) : null}

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
