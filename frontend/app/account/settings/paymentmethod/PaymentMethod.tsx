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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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

  const closeToast = () => setToast((prevState) => ({ ...prevState, isOpen: false }));

  // Fetch available banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user?.country.toLowerCase()}&per_page=20`,
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
        showToast('Error', 'Failed to load the bank list.', 'error');
      } finally {
        setIsLoadingBanks(false);
      }
    };
    fetchBanks();
  }, [user]);

  // Fetch existing subaccount
  useEffect(() => {
    const fetchSubaccount = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user.id}/subaccount`,
          );
          const data = await response.json();

          if (data && Object.keys(data).length > 0) {
            setSubaccountData(data);
          } else {
            setSubaccountData(null); // If no subaccount exists
          }
        } catch (error) {
          showToast('Error', 'Failed to fetch account details.', 'error');
        }
      }
    };

    fetchSubaccount();
  }, [user]);

  // Verify account number before submission
  const verifyAccountNumber = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/resolve_account_details?account_number=${accountNumber}&bank_code=${selectedBank?.value}`,
      );
      const data = await response.json();

      if (data.status) {
        return data.data.account_name;
      } else {
        showToast('Error', 'Invalid account number.', 'error');
        return null;
      }
    } catch (error) {
      showToast('Error', 'Failed to verify account number.', 'error');
      return null;
    }
  };

  // Handle add/update form submission
  const handleSubmitSubaccount = async (e: React.FormEvent<HTMLFormElement>, isUpdate: boolean) => {
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
        ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/update_subaccount`
        : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/create_subaccount`;

      const method = isUpdate ? 'PUT' : 'POST';

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
        showToast(
          'Success',
          isUpdate ? 'Account updated successfully.' : 'Account added successfully.',
          'success',
        );
      }
    } catch (error) {
      showToast('Error', 'An error occurred while saving the account.', 'error');
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

      {subaccountData.error !== "User has no associated subaccount" ? (
        <div>
          <p>Name: {subaccountData.business_name}</p>
          <p>Account Number: {subaccountData.account_number}</p>
          <p>Bank: {subaccountData.metadata?.custom_fields?.[0]?.display_name}</p>
          <button onClick={() => setIsUpdateModalOpen(true)}>Update Bank Account</button>
        </div>
      ) : (
        <button onClick={() => setIsAddModalOpen(true)}>
          <FaPlus /> Add Bank Account
        </button>
      )}

      {/* Add Modal */}
      {subaccountData.error !== "User has no associated subaccount" ? (
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2>Add Bank Account</h2>
        <form onSubmit={(e) => handleSubmitSubaccount(e, false)}>
          <select
            onChange={(e) =>
              setSelectedBank(banks.find((bank) => bank.value === e.target.value) || null)
            }
            required
          >
            <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank.value} value={bank.value}>
                {bank.display_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <button type="submit">Add Account</button>
        </form>
      </Modal>
      ) : ( <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <h2>Update Bank Account</h2>
        <form onSubmit={(e) => handleSubmitSubaccount(e, true)}>
          <select
            value={selectedBank?.value || ''}
            onChange={(e) =>
              setSelectedBank(banks.find((bank) => bank.value === e.target.value) || null)
            }
            required
          >
            <option value="">Select Bank</option>
            {banks.map((bank) => (
              <option key={bank.value} value={bank.value}>
                {bank.display_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
          <button type="submit">Update Account</button>
        </form>
      </Modal>
      )}
    </div>
  );
};

export default PaymentMethod;
