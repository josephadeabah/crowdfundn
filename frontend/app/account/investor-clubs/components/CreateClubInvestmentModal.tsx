'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { investmentService } from '../clubservice';
import { ApprovedCampaign, Club } from '../clubTypes';
import Modal from '@/app/components/modal/Modal';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import {
  InfoIcon,
  Calculator,
  TrendingUp,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  UserX,
} from 'lucide-react';
import { useKYCStatus } from '@/app/hooks/useKYCStatus';
import ToastComponent from '@/app/components/toast/Toast';

interface CreateClubInvestmentModalProps {
  club: Club;
  approvedCampaigns: ApprovedCampaign[];
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  token?: string | null;
}

interface InvestmentValidationError {
  field: string;
  messages: string[];
  code?: string;
}

const CreateClubInvestmentModal: React.FC<CreateClubInvestmentModalProps> = ({
  club,
  approvedCampaigns = [],
  onSuccess,
  isOpen,
  onClose,
  token,
}) => {
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  const [open, setOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    title?: string;
    description: string;
    type: 'success' | 'error' | 'warning';
  }>({
    isOpen: false,
    description: '',
    type: 'success',
  });

  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose || setOpen;

  const selectedCampaign = approvedCampaigns.find(
    (c) => c.campaign.id.toString() === selectedCampaignId,
  );

  // Show toast notification
  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  // Calculate fees exactly like in the backend - FIXED: Now we add all fees together
  const calculateFees = (amount: number) => {
    const processingFee = amount * 0.07;
    const platformFee = amount * 0.03;
    const grossAmount = amount;
    const netAmount = amount - platformFee;

    // IMPORTANT: We add investment amount + processing fee + platform fee
    // This total gets deducted from club balance as one bulk amount
    const totalDeduction = grossAmount + processingFee + platformFee;

    return {
      processingFee,
      platformFee,
      totalFees: processingFee + platformFee,
      totalAmount: totalDeduction, // This is what gets deducted from club balance
      netToCampaign: netAmount,
      isProcessingFeeCapped: processingFee >= 600,
      investmentAmount: amount, // Base investment amount
    };
  };

  const fees = investmentAmount
    ? calculateFees(parseFloat(investmentAmount))
    : null;

  useEffect(() => {
    if (!modalOpen) resetForm();
  }, [modalOpen]);

  const resetForm = () => {
    setSelectedCampaignId('');
    setInvestmentAmount('');
    setNotes('');
    setError(null);
    setValidationErrors({});
  };

  const handleClose = () => {
    setModalOpen(false);
    resetForm();
  };

  // Enhanced validation function
  const validateInvestment = (amount: number, campaign: any) => {
    const errors: Record<string, string[]> = {};

    if (amount <= 0) {
      errors.amount = ['Investment amount must be greater than 0'];
    }

    if (campaign.is_equity_investment) {
      if (amount < campaign.minimum_investment) {
        errors.amount = [
          `Minimum investment is ${campaign.currency_symbol}${campaign.minimum_investment}`,
        ];
      }

      if (
        campaign.maximum_investment > 0 &&
        amount > campaign.maximum_investment
      ) {
        errors.amount = [
          `Maximum investment is ${campaign.currency_symbol}${campaign.maximum_investment}`,
        ];
      }

      // Check shares availability
      const pricePerShare = campaign.valuation / campaign.total_shares;
      const requestedShares = amount / pricePerShare;

      if (requestedShares > campaign.shares_available) {
        const availableAmount = Math.floor(
          campaign.shares_available * pricePerShare,
        );
        errors.amount = [
          `Not enough shares available. Maximum investment possible: ${campaign.currency_symbol}${availableAmount}`,
        ];
      }
    } else {
      if (amount < campaign.minimum_donation) {
        errors.amount = [
          `Minimum investment is ${campaign.currency_symbol}${campaign.minimum_donation}`,
        ];
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Add admin check - but don't show popup, just return early
    if (!club.is_admin) {
      return;
    }

    // Add KYC check using the hook
    if (!kycStatus?.verified) {
      return;
    }

    if (!selectedCampaignId || !club || !token) {
      setError('Please select a campaign and ensure all data is available');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (!investmentAmount || amount <= 0) {
      setError('Enter a valid investment amount');
      return;
    }

    const selectedCampaign = approvedCampaigns.find(
      (c) => c.campaign.id.toString() === selectedCampaignId,
    );

    if (!selectedCampaign) {
      setError('Selected campaign not found');
      return;
    }

    // Client-side validation
    const clientValidationErrors = validateInvestment(
      amount,
      selectedCampaign.campaign,
    );
    if (Object.keys(clientValidationErrors).length > 0) {
      setValidationErrors(clientValidationErrors);
      return;
    }

    // Check if club has sufficient balance (investment amount + ALL fees)
    const totalAmount = fees?.totalAmount || amount;
    if (totalAmount > club.financials.current_balance) {
      setError(
        `Insufficient club balance. Available: ${club.currency}${club.financials.current_balance.toLocaleString()}. Required: ${club.currency}${totalAmount.toLocaleString()}`,
      );
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT: Send only the base investment amount to backend
      // Backend will calculate and handle the fee splitting internally
      const investmentData = {
        campaign_id: selectedCampaignId,
        investment_amount: amount, // Base amount only - backend handles fee calculations
        notes: notes || undefined,
      };

      console.log('Creating investment with club balance:', {
        ...investmentData,
        calculatedTotalDeduction: fees?.totalAmount,
        feeBreakdown: fees,
      });

      const result = await investmentService.createInvestment(
        token,
        club.id,
        investmentData,
      );

      if (result.success) {
        // SUCCESS: Investment created using club balance
        console.log(
          'Investment created successfully using club balance:',
          result,
        );

        // Show success toast with fee breakdown
        showToast(
          'Investment Successful',
          result.message ||
            `Successfully invested ${club.currency}${amount.toLocaleString()} in ${selectedCampaign.campaign.title}. Total deducted from club balance: ${club.currency}${fees?.totalAmount.toLocaleString()}`,
          'success',
        );

        setModalOpen(false);
        resetForm();
        onSuccess?.();
      } else {
        // Handle backend validation errors
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
          showToast(
            'Validation Error',
            'Please fix the errors in the form',
            'error',
          );
        } else {
          const errorMessage = result.message || 'Failed to create investment';
          setError(errorMessage);
          showToast('Investment Failed', errorMessage, 'error');
        }
      }
    } catch (err: any) {
      console.error('Failed to create investment:', err);

      const errorMessage = err.message || 'Failed to create investment';
      setError(errorMessage);
      showToast('Investment Failed', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add validation error display in the form
  const renderValidationErrors = (field: string) => {
    if (!validationErrors[field]) return null;

    return (
      <div className="text-red-600 text-sm mt-1">
        {validationErrors[field].map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  // Get KYC status message
  const getKycStatusMessage = (): string => {
    if (kycLoading) return 'Checking KYC status...';

    if (kycStatus) {
      if (!kycStatus.verified) {
        return 'KYC verification pending';
      }
      if (kycStatus.is_expired) {
        return 'KYC verification has expired';
      }
      return 'KYC verified';
    }

    return 'KYC status unknown';
  };

  const isKycVerified = kycStatus?.verified && !kycStatus?.is_expired;
  const isAdmin = club.is_admin;

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        size="large"
        closeOnBackdropClick={true}
        customStyles={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold">Make Club Investment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Invest club funds directly from club balance
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            <form
              id="investment-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Admin Access Alert */}
              {!isAdmin && (
                <Alert className="bg-red-50 border-red-200">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800 text-sm">
                      <strong>Admin Access Required:</strong> Only club
                      administrators can create investments for the club.
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* KYC Status Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900">
                    KYC Verification Status
                  </h3>
                </div>

                {kycLoading ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800 text-sm">
                      Checking your KYC verification status...
                    </AlertDescription>
                  </Alert>
                ) : isKycVerified ? (
                  <Alert className="bg-green-50 border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-sm">
                        <strong>KYC Verified:</strong> Your identity has been
                        verified and you can make investments.
                      </AlertDescription>
                    </div>
                  </Alert>
                ) : (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 text-sm">
                        <strong>KYC Verification Required:</strong> You must
                        complete your KYC verification before making
                        investments. Current status: {getKycStatusMessage()}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>

              {/* Select Campaign */}
              <div className="space-y-2">
                <Label htmlFor="campaign" className="text-gray-900">
                  Select Campaign
                </Label>
                <Select
                  value={selectedCampaignId}
                  onValueChange={(value) => {
                    setSelectedCampaignId(value);
                    setValidationErrors({}); // Clear errors when campaign changes
                  }}
                  disabled={!isAdmin || !isKycVerified || loading}
                >
                  <SelectTrigger
                    className={`w-full z-[150] border-gray-300 text-gray-900 [&>span]:text-gray-900 focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      validationErrors.campaign ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue
                      placeholder="Choose an approved campaign"
                      className="text-gray-900 placeholder:text-gray-500"
                    />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 bg-white">
                    {approvedCampaigns.length === 0 ? (
                      <SelectItem
                        value="none"
                        disabled
                        className="text-gray-500"
                      >
                        No approved campaigns available
                      </SelectItem>
                    ) : (
                      approvedCampaigns.map((campaign) => (
                        <SelectItem
                          key={campaign.id}
                          value={campaign.campaign.id.toString()}
                          className="!text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {campaign.campaign.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {renderValidationErrors('campaign')}
              </div>

              {/* Selected Campaign Details */}
              {selectedCampaign && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedCampaign.campaign.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Goal:</span>{' '}
                      {selectedCampaign.campaign.currency_symbol ||
                        selectedCampaign.campaign.currency}
                      {selectedCampaign.campaign.goal_amount?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Raised:</span>{' '}
                      {selectedCampaign.campaign.currency_symbol ||
                        selectedCampaign.campaign.currency}
                      {selectedCampaign.campaign.current_amount?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{' '}
                      {selectedCampaign.campaign.category}
                    </div>
                    {selectedCampaign.club_investment?.proposed_amount && (
                      <div>
                        <span className="font-medium">Proposed:</span>{' '}
                        {club.currency}
                        {selectedCampaign.club_investment.proposed_amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Investment Amount with Validation */}
              <div className="space-y-2">
                <Label htmlFor="investmentAmount" className="text-gray-900">
                  Investment Amount ({club.currency})
                </Label>
                <Input
                  id="investmentAmount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => {
                    setInvestmentAmount(e.target.value);
                    // Clear amount errors when user types
                    if (validationErrors.amount) {
                      setValidationErrors((prev) => {
                        const { amount, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  placeholder="Enter investment amount"
                  required
                  min="1"
                  step="0.01"
                  className={`border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.amount ? 'border-red-500' : ''
                  }`}
                  disabled={!isAdmin || !isKycVerified || loading}
                />
                {renderValidationErrors('amount')}
                <p className="text-xs text-gray-500">
                  Available balance: {club.currency}
                  {club.financials.current_balance.toLocaleString()}
                </p>
              </div>

              {/* Fee Breakdown - UPDATED: Show total deduction including all fees */}
              {fees && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">
                      Total Deduction Breakdown
                    </h4>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Amount:</span>
                      <span className="font-medium">
                        {club.currency}
                        {fees.investmentAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        Processing Fee (7%):
                      </span>
                      <span className="text-red-600 font-medium">
                        +{club.currency}
                        {fees.processingFee.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        {fees.isProcessingFeeCapped && (
                          <span className="text-xs text-green-600 ml-1">
                            (Capped)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Platform Fee (3%):
                      </span>
                      <span className="text-orange-600 font-medium">
                        +{club.currency}
                        {fees.platformFee.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">
                          Total Deducted from Club Balance:
                        </span>
                        <span className="text-blue-700 font-bold">
                          {club.currency}
                          {fees.totalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between mt-1">
                        <span className="text-gray-700 font-medium">
                          Net to Fundraiser:
                        </span>
                        <span className="text-green-700 font-bold">
                          {club.currency}
                          {fees.netToCampaign.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-3 bg-blue-50 border-blue-200">
                    <InfoIcon className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-blue-500 text-xs">
                      The total amount ({club.currency}
                      {fees.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      ) will be deducted from your club balance as one bulk
                      amount.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Balance Check Warning */}
              {fees && fees.totalAmount > club.financials.current_balance && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-700 text-sm">
                    <strong>Insufficient Balance:</strong> This investment
                    requires {club.currency}
                    {fees.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    but your club only has {club.currency}
                    {club.financials.current_balance.toLocaleString()}.
                  </AlertDescription>
                </Alert>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-900">
                  Investment Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional context or reasoning for this investment..."
                  rows={3}
                  className="border-gray-300 text-gray-900 placeholder:text-gray-500 resize-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isAdmin || !isKycVerified || loading}
                />
              </div>

              {/* Display general errors */}
              {error && !Object.keys(validationErrors).length && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Display validation errors summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-2">
                    Please fix the following errors:
                  </h4>
                  <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) =>
                      errors.map((error, index) => (
                        <li key={`${field}-${index}`}>{error}</li>
                      )),
                    )}
                  </ul>
                </div>
              )}
            </form>
          </div>

          {/* Fixed Buttons - ALWAYS VISIBLE */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="investment-form"
                disabled={
                  loading ||
                  !selectedCampaignId ||
                  approvedCampaigns.length === 0 ||
                  !isAdmin ||
                  !isKycVerified ||
                  !!(fees && fees.totalAmount > club.financials.current_balance)
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : !isAdmin ? (
                  'Admin Required'
                ) : !isKycVerified ? (
                  'KYC Required'
                ) : (
                  `Invest ${club.currency}${fees?.totalAmount.toLocaleString() || 0}`
                )}
              </Button>
            </div>

            {/* Enhanced permission messages */}
            <div className="mt-2 space-y-1">
              {!isAdmin && (
                <p className="text-xs text-red-600 text-center">
                  Only club administrators can create investments
                </p>
              )}
              {isAdmin && !isKycVerified && (
                <p className="text-xs text-yellow-600 text-center">
                  Complete KYC verification to make investments
                </p>
              )}
            </div>

            {/* Requirements Notice */}
            {isAdmin && !isKycVerified && !kycLoading && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Requirements:</strong> You have admin access but need
                  to complete KYC verification to make investments.
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
    </>
  );
};

export default CreateClubInvestmentModal;
