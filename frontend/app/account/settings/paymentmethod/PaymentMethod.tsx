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
    <div>
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            Bank Account Information
          </h2>
          <p className="text-success font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            You'll receive your payout through this account
          </p>
        </div>

        {isLoading ? (
          <BankAccountLoader />
        ) : subaccountData ? (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-card rounded-xl shadow-card border border-border">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-muted-foreground">
                      Name
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {subaccountData.business_name}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-muted-foreground">
                      Account Number
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-foreground tracking-wider">
                    {maskAccountNumber(subaccountData.account_number)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-muted-foreground">
                      Bank
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {subaccountData.metadata?.custom_fields?.[0]?.display_name}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="flex items-center justify-center gap-3 w-full p-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold shadow-button transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <Edit3 className="h-5 w-5" />
              Update Bank Account
            </button>
          </div>
        ) : (
          <button
            className="flex items-center justify-center gap-3 w-full p-6 bg-gradient-primary hover:opacity-90 text-white rounded-xl font-semibold shadow-button transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-dashed border-primary/30"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
            Add Bank Account
          </button>
        )}

        {/* Add Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Add Bank Account
              </h2>
              <p className="text-muted-foreground">
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
                  className="block text-sm font-semibold text-foreground"
                >
                  Select Bank
                </label>
                <select
                  id="bank-select"
                  value={selectedBank?.value || ''}
                  onChange={(e) =>
                    setSelectedBank(
                      banks.find((bank) => bank.value === e.target.value) ||
                        null,
                    )
                  }
                  required
                  className="w-full px-4 py-3 bg-card border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder-muted-foreground appearance-none cursor-pointer relative z-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="">Choose your bank</option>
                  {banks.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-number"
                  className="block text-sm font-semibold text-foreground"
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
                  className="w-full px-4 py-3 bg-background border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder-muted-foreground font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-success hover:bg-success-hover disabled:opacity-50 disabled:cursor-not-allowed text-success-foreground rounded-lg font-semibold shadow-button transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin"></div>
                    Adding Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Add Account
                  </>
                )}
              </button>
            </form>
          </div>
        </Modal>

        {/* Update Modal */}
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Update Bank Account
              </h2>
              <p className="text-muted-foreground">Modify your bank details</p>
            </div>

            <form
              onSubmit={(e) => handleSubmitSubaccount(e, true)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="bank-select-update"
                  className="block text-sm font-semibold text-foreground"
                >
                  Select Bank
                </label>
                <select
                  id="bank-select-update"
                  value={selectedBank?.value || ''}
                  onChange={(e) =>
                    setSelectedBank(
                      banks.find((bank) => bank.value === e.target.value) ||
                        null,
                    )
                  }
                  required
                  className="w-full px-4 py-3 bg-card border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder-muted-foreground appearance-none cursor-pointer relative z-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="">Choose your bank</option>
                  {banks.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="account-number-update"
                  className="block text-sm font-semibold text-foreground"
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
                  className="w-full px-4 py-3 bg-background border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder-muted-foreground font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-success hover:bg-success-hover disabled:opacity-50 disabled:cursor-not-allowed text-success-foreground rounded-lg font-semibold shadow-button transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin"></div>
                    Updating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Update Account
                  </>
                )}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentMethod;
