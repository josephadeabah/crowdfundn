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
  const [modalType, setModalType] = useState<'add' | 'update' | null>(null); // Separate state for modal type
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [subaccountData, setSubaccountData] = useState<any>(null);
  const { user } = useAuth();
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (title: string, description: string, type: 'success' | 'error' | 'warning') => {
    setToast({ isOpen: true, title, description, type });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    const fetchBanks = async () => {
      if (!user) {
        showToast('Error', 'You are not authenticated.', 'error');
        return;
      }
      try {
        setIsLoadingBanks(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user.country.toLowerCase()}&per_page=20`
        );
        const data = await response.json();
        setBanks(data.data.map((bank: any) => ({
          display_name: bank.name,
          variable_name: bank.slug,
          value: bank.code,
          type: bank.type,
        })));
      } catch {
        showToast('Error', 'Failed to load banks.', 'error');
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
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user.id}/subaccount`
          );
          const data = await response.json();
          setSubaccountData(data || null);
        } catch {
          showToast('Error', 'Failed to fetch account details.', 'error');
        }
      }
    };

    fetchSubaccount();
  }, [user]);

  const handleOpenModal = (type: 'add' | 'update') => {
    setModalType(type); // Set modal type to "add" or "update"
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) return showToast('Error', 'Please select a bank.', 'error');
    setIsLoading(true);

    const endpoint = modalType === 'update'
      ? `/members/users/${user?.id}/update_subaccount`
      : `/members/users/${user?.id}/create_subaccount`;

    const payload = {
      subaccount: {
        business_name: user?.full_name,
        settlement_bank: selectedBank.value,
        account_number: accountNumber,
        percentage_charge: 20,
      },
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${endpoint}`, {
        method: modalType === 'update' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      showToast('Success', `Bank account ${modalType}d successfully.`, 'success');
      setIsModalOpen(false);
    } catch {
      showToast('Error', `Failed to ${modalType} bank account.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-white text-gray-800 p-6 rounded-md">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <h2 className="text-xl font-semibold mb-4">Bank Account Information</h2>
      {subaccountData ? (
        <div className="p-4 border rounded-md shadow-md mb-4">
          <p><strong>Name:</strong> {subaccountData.business_name}</p>
          <p><strong>Account Number:</strong> {subaccountData.account_number}</p>
          <p>
            <strong>Bank:</strong> {subaccountData.metadata?.custom_fields?.[0]?.display_name}
          </p>
        </div>
      ) : (
        <p>No Bank Account Added. Please add one.</p>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => handleOpenModal('add')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          <FaPlus className="inline mr-2" /> Add Bank Account
        </button>
        {subaccountData && (
          <button
            onClick={() => handleOpenModal('update')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Update Bank Account
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="small">
        <h2 className="text-2xl font-bold mb-4">
          {modalType === 'update' ? 'Update Bank Account' : 'Add Bank Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bank" className="block mb-1 font-medium">Select Your Bank</label>
            {isLoadingBanks ? <p>Loading banks...</p> : (
              <select
                id="bank"
                value={selectedBank?.value || ''}
                onChange={(e) =>
                  setSelectedBank(banks.find((bank) => bank.value === e.target.value) || null)
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="" disabled>Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.value} value={bank.value}>{bank.display_name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="accountNumber" className="block mb-1 font-medium">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="1234567890"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mr-4 bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-theme-color-primary text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : modalType === 'update' ? 'Update Account' : 'Add Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentMethod;
