'use client';
import React, { useEffect, useState } from 'react';
import Modal from '@/app/components/modal/Modal';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';
import BankAccountLoader from '@/app/loaders/BankAccountLoader';
import {
  Plus,
  CreditCard,
  Building2,
  User,
  Edit3,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

type Bank = {
  display_name: string;
  variable_name: string;
  value: string; // Settlement bank code
  type: string; // nuban or ghipss
};

// Utility function to mask the account number
const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;

  const visibleDigits = 4; // Number of visible digits
  const maskedLength = accountNumber.length - visibleDigits;
  const maskedPart = '•'.repeat(maskedLength); // Replace the rest with gray circles
  const visiblePart = accountNumber.slice(-visibleDigits); // Last 4 digits

  return `${maskedPart}${visiblePart}`;
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
      setIsLoading(false);
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

    // Prepare the payload based on whether we are creating or updating
    const payload = isUpdate
      ? {
          subaccount_code: subaccountData?.subaccount_code || '', // For updating
          business_name: user?.full_name,
          settlement_bank: selectedBank.value,
          account_number: accountNumber,
          percentage_charge: 100,
          description: subaccountData?.description || '',
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
        }
      : {
          subaccount: {
            business_name: user?.full_name,
            settlement_bank: selectedBank.value,
            account_number: accountNumber,
            percentage_charge: 100,
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
      if ((data && data.success === false) || (data && data.error)) {
        showToast('Error', data.error, 'error');
        return;
      }
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
    <div className="text-gray-900">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Bank Account Information
          </h2>
          <p className="text-green-600 font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            You'll receive your payout through this account
          </p>
        </div>

        {isLoading ? (
          <BankAccountLoader />
        ) : subaccountData ? (
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-none shadow-none">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-600">Name</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {subaccountData.business_name}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-600">
                      Account Number
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-gray-900 tracking-wider">
                    {maskAccountNumber(subaccountData.account_number)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-100/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-600">Bank</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {subaccountData.metadata?.custom_fields?.[0]?.display_name}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="flex items-center justify-center gap-3 w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-none font-semibold shadow-button transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <Edit3 className="h-5 w-5" />
              Update Bank Account
            </Button>
          </div>
        ) : (
          <Button
            className="flex items-center justify-center gap-3 w-full p-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold shadow-button transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-dashed border-green-300"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
            Add Bank Account
          </Button>
        )}

        {/* Add Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <div className="space-y-6 text-gray-900">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add Bank Account
              </h2>
              <p className="text-gray-600">
                Enter your bank details to receive payments
              </p>
            </div>

            <form
              onSubmit={(e) => handleSubmitSubaccount(e, false)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="bank-select"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Select Bank
                </label>
                <Select
                  value={selectedBank?.value || ''}
                  onValueChange={(value) =>
                    setSelectedBank(
                      banks.find((bank) => bank.value === value) || null,
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    {banks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-number"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Account Number
                </label>
                <input
                  id="account-number"
                  type="text"
                  placeholder="Enter your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-900 placeholder-gray-400 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-button transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Add Account
                  </>
                )}
              </Button>
            </form>
          </div>
        </Modal>

        {/* Update Modal */}
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <div className="space-y-6 text-gray-900">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Update Bank Account
              </h2>
              <p className="text-gray-600">Modify your bank details</p>
            </div>

            <form
              onSubmit={(e) => handleSubmitSubaccount(e, true)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="bank-select-update"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Select Bank
                </label>
                <Select
                  value={selectedBank?.value || ''}
                  onValueChange={(value) =>
                    setSelectedBank(
                      banks.find((bank) => bank.value === value) || null,
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    {banks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-number-update"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Account Number
                </label>
                <input
                  id="account-number-update"
                  type="text"
                  placeholder="Enter your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-900 placeholder-gray-400 font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-button transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Update Account
                  </>
                )}
              </Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentMethod;
