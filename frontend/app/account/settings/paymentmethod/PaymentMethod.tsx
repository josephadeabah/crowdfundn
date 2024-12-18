import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';
import BankAccountLoader from '@/app/loaders/BankAccountLoader';

type Bank = {
  display_name: string;
  variable_name: string;
  value: string; // Settlement bank code
  type: string; // nuban or ghipss
};

const PaymentMethod = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [subaccountData, setSubaccountData] = useState<any>(null);
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const { user } = useAuth();

  // Utility for toast messages
  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const closeToast = () =>
    setToast((prevState) => ({ ...prevState, isOpen: false }));

  // Fetch available banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user?.country.toLowerCase()}&per_page=20`,
        );
        const data = await response.json();
        setBanks(
          data.data.map((bank: any) => ({
            display_name: bank.name,
            variable_name: bank.slug,
            value: bank.code,
            type: bank.type,
          })),
        );
      } catch {
        showToast('Error', 'Failed to load the bank list.', 'error');
      }
    };
    fetchBanks();
  }, [user]);

  // Fetch existing subaccount
  const fetchSubaccount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/subaccount`,
      );
      const data = await response.json();
      setSubaccountData(data.error ? null : data);
    } catch {
      showToast('Error', 'Failed to fetch account details.', 'error');
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchSubaccount();
  }, [user]);

  // Verify account number
  const verifyAccountNumber = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/resolve_account_details?account_number=${accountNumber}&bank_code=${selectedBank?.value}`,
      );
      const data = await response.json();
      if (!data.status) throw new Error('Invalid account number');
      return data.data.account_name;
    } catch {
      showToast('Error', 'Invalid or unverified account number.', 'error');
      return null;
    }
  };

  // Submit Subaccount
  const handleSubmitSubaccount = async (
    e: React.FormEvent<HTMLFormElement>,
    isUpdate: boolean,
  ) => {
    e.preventDefault();

    if (!selectedBank) {
      showToast('Error', 'Please select a bank.', 'error');
      return;
    }

    setIsLoading(true);

    const accountName = await verifyAccountNumber();
    if (!accountName) {
      setIsLoading(false);
      return;
    }

    const payload = {
      subaccount: {
        business_name: user?.full_name,
        settlement_bank: selectedBank.value,
        account_number: accountNumber,
        percentage_charge: 20,
        metadata: {
          custom_fields: [
            {
              display_name: selectedBank.display_name,
              variable_name: selectedBank.variable_name,
              value: selectedBank.value,
              type: selectedBank.type,
            },
          ],
        },
      },
    };

    try {
      const url = isUpdate
        ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/create_subaccount`
        : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/create_subaccount`;

      const method = isUpdate ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data) {
        setSubaccountData(data);
        fetchSubaccount();
        showToast(
          'Success',
          isUpdate
            ? 'Account updated successfully.'
            : 'Account added successfully.',
          'success',
        );
      }
    } catch {
      showToast(
        'Error',
        'An error occurred while saving the account.',
        'error',
      );
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
      setIsUpdateModalOpen(false);
    }
  };

  return (
    <div>
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <h2 className="text-xl font-semibold">Bank Account Information</h2>
      <span className="font-semibold text-green-500 py-2">
        You'll receive your money through this account
      </span>

      {isLoading ? (
        <BankAccountLoader /> // Show skeleton loader while data is loading
      ) : subaccountData ? (
        <div>
          <div className="p-4 max-w-md bg-white rounded-sm shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-800">
                  {subaccountData.business_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">
                  Account Number:
                </span>
                <span className="text-gray-800">
                  {subaccountData.account_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Bank:</span>
                <span className="text-gray-800">
                  {subaccountData.metadata?.custom_fields?.[0]?.display_name}
                </span>
              </div>
            </div>
          </div>

          <button
            className="flex items-center gap-2 p-3 my-3 shadow-sm"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            Update Bank Account
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 p-3 my-3 shadow-sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus /> Add Bank Account
        </button>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2>Add Bank Account</h2>
        <form
          onSubmit={(e) => handleSubmitSubaccount(e, !!subaccountData)}
          className="w-full max-w-md mx-auto p-6 bg-white shadow-sm space-y-4"
        >
          {/* Select Input */}
          <div>
            <label
              htmlFor="bank-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Bank
            </label>
            <select
              id="bank-select"
              value={selectedBank?.value || ''}
              onChange={(e) =>
                setSelectedBank(
                  banks.find((bank) => bank.value === e.target.value) || null,
                )
              }
              required
              className="block mt-1 w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number Input */}
          <div>
            <label
              htmlFor="account-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <input
              id="account-number"
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="block mt-1 w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            {isLoading ? 'Adding...' : 'Add Account'}
          </button>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <h2>Update Bank Account</h2>
        <form
          onSubmit={(e) => handleSubmitSubaccount(e, true)}
          className="w-full max-w-md mx-auto p-6 bg-white shadow-sm space-y-4"
        >
          {/* Select Input */}
          <div>
            <label
              htmlFor="bank-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Bank
            </label>
            <select
              id="bank-select"
              value={selectedBank?.value || ''}
              onChange={(e) =>
                setSelectedBank(
                  banks.find((bank) => bank.value === e.target.value) || null,
                )
              }
              required
              className="block mt-1 w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number Input */}
          <div>
            <label
              htmlFor="account-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <input
              id="account-number"
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="block mt-1 w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            {isLoading ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentMethod;
