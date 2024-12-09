import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from '@/app/components/modal/Modal';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';

type Bank = {
  display_name: string;
  variable_name: string;
  value: string; // Settlement bank code
  type: string; // nuban or ghipss
};

const PaymentMethod = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    accountId: '',
    name: '',
    userEmail: '',
  });
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [subaccountData, setSubaccountData] = useState<any>(null); // Updated to handle subaccount structure
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const { user } = useAuth();

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

  const closeToast = () => {
    setToast((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);

        if (!user) {
          showToast('Error', 'You are not authenticated.', 'error');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user.country.toLowerCase()}&per_page=20`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );
        const data = await response.json();

        const formattedBanks = data.data.map((bank: any) => ({
          display_name: bank.name,
          variable_name: bank.slug,
          value: bank.code,
          type: bank.type,
        }));

        setBanks(formattedBanks);
      } catch (error) {
        console.error('Failed to fetch banks', error);
        showToast(
          'Error',
          'Failed to load the bank list. Please try again.',
          'error',
        );
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [user]);

  useEffect(() => {
    const fetchSubaccount = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user.id}/subaccount`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const subaccountData = await response.json();
          setSubaccountData(subaccountData[0]); // Assuming the response is an array and we use the first object

          setUserDetails({
            name: user.full_name,
            userEmail: user.email,
            accountId: subaccountData[0]?.account_number || '', // Update to access the first item
          });
        } catch (error) {
          console.error('Error fetching account:', error);
          showToast('Error', 'Failed to fetch account details.', 'error');
        }
      }
    };

    fetchSubaccount();
  }, [user]);

  const verifyAccountNumber = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/resolve_account_details?account_number=${accountNumber}&bank_code=${selectedBank?.value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (data.status) {
        return data.data.account_name;
      } else {
        showToast('Error', 'Invalid account number.', 'error');
      }
    } catch (error) {
      console.error('Error verifying account number:', error);
      showToast(
        'Error',
        (error as any).message || 'Failed to verify account number.',
        'error',
      );
      return null;
    }
  };

  const handleAddSubaccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBank) {
      showToast('Error', 'Please select a bank.', 'error');
      return;
    }

    setIsLoading(true);

    if (!user) {
      showToast('Error', 'You are not authenticated.', 'error');
      return;
    }

    const accountName = await verifyAccountNumber();

    if (!accountName) {
      setIsLoading(false);
      return;
    }

    const payload = {
      subaccount: {
        business_name: user.full_name,
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

      await response.json();
      showToast('Success', 'Account added successfully!', 'success');

      const subaccountResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user.id}/subaccount`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const subaccountData = await subaccountResponse.json();
      setSubaccountData(subaccountData[0]); // Assuming the response is an array and we use the first item
    } catch (error) {
      showToast('Error', 'Error creating account. Please try again.', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <div className="rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-theme-color-primary-content md:text-2xl">
          Bank Account Information
        </h2>
        <div className="py-3 text-green-600">
          This is where we'll pay your money to.
        </div>

        {subaccountData && Object.keys(subaccountData).length > 0 ? (
          // Show subaccount details if subaccount exists
          <div className="bg-theme-color-base rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-md">
            <div className="mb-2 sm:mr-4">
              <p className="font-medium">Business Name</p>
              <p>{subaccountData.business_name || 'Not Available'}</p>
            </div>
            <div className="mb-2 sm:mr-4">
              <p className="font-medium">Account Number</p>
              <p>{subaccountData.account_number || 'Not Available'}</p>
            </div>
            <div className="mb-4 sm:mr-4">
              <p className="font-medium">Settlement Bank</p>
              <p>
                {subaccountData.metadata?.custom_fields?.[0]?.display_name ||
                  'Not Available'}
              </p>
            </div>
          </div>
        ) : (
          <p>No Bank Account Added. Please add one.</p>
        )}

        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="mt-6 bg-theme-color-primary text-gray-800 px-6 py-3 rounded-md hover:bg-theme-color-primary-dark transition-colors flex items-center justify-center w-full sm:w-auto"
          aria-label="Add Subaccount"
        >
          <FaPlus className="mr-2" />
          Add Bank Account
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="small"
      >
        <h2 className="text-2xl font-bold mb-4 text-theme-color-primary">
          Add Bank Account Number
        </h2>
        <form onSubmit={handleAddSubaccount}>
          <div className="mb-4">
            <label htmlFor="bank" className="block mb-1 font-medium">
              Select Your Bank
            </label>
            {isLoadingBanks ? (
              <p>Loading banks...</p>
            ) : (
              <select
                id="bank"
                value={selectedBank?.value || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedBank(
                    banks.find((bank) => bank.value === e.target.value) || null,
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
            <label htmlFor="accountNumber" className="block mb-1 font-medium">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 border rounded-md border-gray-300"
              placeholder="123456789012"
              required
            />
          </div>

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
              {isLoading ? 'Adding...' : 'Add Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentMethod;
