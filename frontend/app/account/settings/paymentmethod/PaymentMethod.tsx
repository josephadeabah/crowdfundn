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
  AlertCircle,
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
  type: string; // nuban or ghipss or mobile_money
};

// Utility to mask account numbers
const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  const visibleDigits = 4;
  const maskedLength = accountNumber.length - visibleDigits;
  const maskedPart = '•'.repeat(maskedLength);
  const visiblePart = accountNumber.slice(-visibleDigits);
  return `${maskedPart}${visiblePart}`;
};

// List of mobile money bank codes (not supported for subaccounts)
const MOBILE_MONEY_BANKS = ['MTN', 'VOD', 'TGO']; // MTN, Vodafone, AirtelTigo

const PaymentMethod = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [supportedBanks, setSupportedBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [subaccountData, setSubaccountData] = useState<any>(null);
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const { user, token } = useAuth();

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({ isOpen: true, title, description, type });
  };

  const closeToast = () =>
    setToast((prevState) => ({ ...prevState, isOpen: false }));

  // Fetch available banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/get_bank_list?country=${user?.country.toLowerCase()}&per_page=100`,
        );
        const data = await response.json();
        if (data.status) {
          const allBanks = data.data.map((bank: any) => ({
            display_name: bank.name,
            variable_name: bank.slug,
            value: bank.code,
            type: bank.type,
          }));
          
          setBanks(allBanks);
          
          // Filter out mobile money banks for subaccounts
          const supported = allBanks.filter((bank: Bank) => 
            !MOBILE_MONEY_BANKS.includes(bank.value)
          );
          setSupportedBanks(supported);
        } else {
          showToast('Error', 'Failed to load the bank list.', 'error');
        }
      } catch {
        showToast('Error', 'Failed to load the bank list.', 'error');
      }
    };
    
    if (user?.country) {
      fetchBanks();
    }
  }, [user]);

  // Fetch existing subaccount
  const fetchSubaccount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${user?.id}/subaccount`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      
      if (response.ok) {
        const data = await response.json();
        setSubaccountData(data.error ? null : data);
      } else {
        setSubaccountData(null);
      }
    } catch {
      showToast('Error', 'Failed to fetch account details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchSubaccount();
    }
  }, [user, token]);

  // Verify account number
  const verifyAccountNumber = async () => {
    if (!selectedBank || !accountNumber) {
      showToast('Error', 'Please select a bank and enter account number.', 'error');
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/transfers/resolve_account_details?account_number=${accountNumber}&bank_code=${selectedBank.value}&country=${user?.country.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      
      const data = await response.json();
      
      if (data.status && data.data) {
        return data.data.account_name;
      } else {
        showToast('Error', data.message || 'Invalid or unverified account number.', 'error');
        return null;
      }
    } catch (error: any) {
      showToast('Error', 'Failed to verify account number.', 'error');
      return null;
    }
  };

  // Submit subaccount
  const handleSubmitSubaccount = async (
    e: React.FormEvent<HTMLFormElement>,
    isUpdate: boolean,
  ) => {
    e.preventDefault();

    if (!selectedBank) {
      showToast('Error', 'Please select a bank.', 'error');
      return;
    }

    if (!accountNumber) {
      showToast('Error', 'Please enter account number.', 'error');
      return;
    }

    // Check if this is a mobile money account (not supported)
    if (MOBILE_MONEY_BANKS.includes(selectedBank.value)) {
      showToast(
        'Unsupported Account Type', 
        'Mobile money accounts cannot be used for receiving payments. Please select a bank account instead.', 
        'error'
      );
      return;
    }

    setIsLoading(true);
    
    // Verify account first
    const accountName = await verifyAccountNumber();
    if (!accountName) {
      setIsLoading(false);
      return;
    }

    // For Ghanaian banks, we need to handle GHIPSS type differently
    const isGhanaGhipss = user?.country?.toLowerCase() === 'ghana' && selectedBank.type === 'ghipss';

    const payload = isUpdate
      ? {
          business_name: user?.full_name || accountName,
          settlement_bank: selectedBank.value,
          account_number: accountNumber,
          percentage_charge: 100,
          description: `Bank account for ${user?.full_name}`,
          metadata: {
            custom_fields: [
              {
                display_name: selectedBank.display_name,
                variable_name: selectedBank.variable_name,
                value: selectedBank.value,
                type: isGhanaGhipss ? 'ghipss' : 'nuban',
              },
            ],
          },
        }
      : {
          subaccount: {
            business_name: user?.full_name || accountName,
            settlement_bank: selectedBank.value,
            account_number: accountNumber,
            percentage_charge: 100,
            metadata: {
              custom_fields: [
                {
                  display_name: selectedBank.display_name,
                  variable_name: selectedBank.variable_name,
                  value: selectedBank.value,
                  type: isGhanaGhipss ? 'ghipss' : 'nuban',
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok || (data && data.success === false) || (data && data.error)) {
        const errorMessage = data.error || data.message || 'Failed to process account';
        showToast('Error', errorMessage, 'error');
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
    } catch (error: any) {
      showToast(
        'Error',
        error.message || 'An error occurred while saving the account.',
        'error',
      );
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
      setIsUpdateModalOpen(false);
      setAccountNumber('');
      setSelectedBank(null);
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setAccountNumber('');
    setSelectedBank(null);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setAccountNumber('');
    setSelectedBank(null);
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
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-green-500 rounded-xl">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Bank Account Information
          </h2>
          <p className="text-green-600 font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            You'll receive your payout through this account
          </p>
          
          {/* Information Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 text-sm">
                  Important Note
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Only bank accounts are supported for receiving payments. Mobile money accounts (MTN, Vodafone, AirtelTigo) cannot be used at this time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <BankAccountLoader />
        ) : subaccountData ? (
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-600">Name</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {subaccountData.business_name}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
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

                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-600">Bank</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {subaccountData.metadata?.custom_fields?.[0]?.display_name || subaccountData.settlement_bank}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="flex items-center justify-center gap-3 w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <Edit3 className="h-5 w-5" />
              Update Bank Account
            </Button>
          </div>
        ) : (
          <Button
            className="flex items-center justify-center gap-3 w-full p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-dashed border-green-300"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
            Add Bank Account
          </Button>
        )}

        {/* Add Modal */}
        <Modal isOpen={isAddModalOpen} onClose={handleAddModalClose}>
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-700 text-sm">
                  Only bank accounts are supported. Mobile money accounts will not work.
                </p>
              </div>
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
                  value={selectedBank?.value}
                  onValueChange={(value) =>
                    setSelectedBank(
                      supportedBanks.find((b) => b.value === value) || null,
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>

                  <SelectContent>
                    {supportedBanks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Mobile money providers are not shown as they are not supported for payouts.
                </p>
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
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  minLength={10}
                  maxLength={16}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-gray-900 placeholder-gray-400 font-mono transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedBank || !accountNumber}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
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
          onClose={handleUpdateModalClose}
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-700 text-sm">
                  Only bank accounts are supported. Mobile money accounts will not work.
                </p>
              </div>
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
                  value={selectedBank?.value}
                  onValueChange={(value) =>
                    setSelectedBank(
                      supportedBanks.find((b) => b.value === value) || null,
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>

                  <SelectContent>
                    {supportedBanks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Mobile money providers are not shown as they are not supported for payouts.
                </p>
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
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  minLength={10}
                  maxLength={16}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-gray-900 placeholder-gray-400 font-mono transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedBank || !accountNumber}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
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