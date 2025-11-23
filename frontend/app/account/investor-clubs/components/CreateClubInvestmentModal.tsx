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
import { InfoIcon, Calculator, TrendingUp, CreditCard } from 'lucide-react';
import { useKYCStatus } from '@/app/hooks/useKYCStatus';

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

  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose || setOpen;

  const selectedCampaign = approvedCampaigns.find(
    (c) => c.campaign.id.toString() === selectedCampaignId,
  );

  // Calculate fees and total amount with processing fee cap
  const calculateFees = (amount: number) => {
    const processingFee = Math.min(amount * 0.07, 600); // 7% processing fee, capped at 600
    const platformFee = amount * 0.03; // 3% platform fee
    const totalFees = processingFee + platformFee;
    const totalAmount = amount + totalFees; // Investment amount + all fees
    const netToCampaign = amount - platformFee; // Only platform fee is deducted from campaign amount

    return {
      processingFee,
      platformFee,
      totalFees,
      totalAmount, // This is what gets deducted from club balance
      netToCampaign,
      isProcessingFeeCapped: processingFee >= 600,
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

    // Add admin check
    if (!club.is_admin) {
      setError('Only club admins can create investments');
      return;
    }

    // Add KYC check using the hook
    if (!kycStatus?.verified) {
      setError('You must complete KYC verification before making investments');
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

    // Check if club has sufficient balance (investment amount + fees)
    const totalAmount = fees?.totalAmount || amount;
    if (totalAmount > club.financials.current_balance) {
      setError(
        `Insufficient club balance. Available: ${club.currency_symbol}${club.financials.current_balance.toLocaleString()}. Required: ${club.currency_symbol}${totalAmount.toLocaleString()}`,
      );
      return;
    }

    setLoading(true);

    try {
      const investmentData = {
        campaign_id: selectedCampaignId,
        investment_amount: fees?.totalAmount || amount,
        notes: notes || undefined,
      };

      console.log('Sending investment data:', investmentData);

      const result = await investmentService.createInvestment(
        token,
        club.id,
        investmentData,
      );

      if (result.success) {
        if (result.authorization_url) {
          // Redirect to payment page for equity investments
          window.location.href = result.authorization_url;
        } else {
          // For voting investments, just close the modal
          setModalOpen(false);
          resetForm();
          onSuccess?.();
        }
      } else {
        // Handle backend validation errors
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
        } else {
          setError(result.message || 'Failed to create investment');
        }
      }
    } catch (err: any) {
      console.error('Failed to create investment:', err);

      // Handle structured error response
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.validationErrors) {
          setValidationErrors(errorData.validationErrors);
        } else {
          setError(errorData.error || 'Failed to create investment');
        }
      } else {
        setError(err.message || 'Failed to create investment');
      }
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

  const isKycVerified = kycStatus?.verified;

  return (
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
            Invest club funds in an approved campaign
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <form
            id="investment-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* KYC Status Warning */}
            {!isKycVerified && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-yellow-800 text-sm">
                  <strong>KYC Verification Required:</strong> You must complete
                  your KYC verification before making investments. Current
                  status: {getKycStatusMessage()}
                </AlertDescription>
              </Alert>
            )}

            {/* KYC Status Success */}
            {isKycVerified && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 text-sm">
                  <strong>KYC Verified:</strong> Your KYC verification is
                  complete and you can make investments.
                </AlertDescription>
              </Alert>
            )}

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
              >
                <SelectTrigger
                  className={`w-full z-[150] border-gray-300 text-gray-900 [&>span]:text-gray-900 focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${
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
                    <SelectItem value="none" disabled className="text-gray-500">
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
                      {club.currency_symbol}
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
                className={`border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:outline-none ${
                  validationErrors.amount ? 'border-red-500' : ''
                }`}
              />
              {renderValidationErrors('amount')}
              <p className="text-xs text-gray-500">
                Available balance: {club.currency_symbol}
                {club.financials.current_balance.toLocaleString()}
              </p>
            </div>

            {/* Fee Breakdown */}
            {fees && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Fee Breakdown</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount:</span>
                    <span className="font-medium">
                      {club.currency_symbol}
                      {parseFloat(investmentAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      Processing Fee{' '}
                      {fees.isProcessingFeeCapped ? '(Capped at 7%)' : '(7%)'}:
                    </span>
                    <span className="text-red-600 font-medium">
                      +{club.currency_symbol}
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
                      +{club.currency_symbol}
                      {fees.platformFee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">
                        Total Deducted from Club:
                      </span>
                      <span className="text-red-700 font-bold">
                        {club.currency_symbol}
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
                        {club.currency_symbol}
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
                    {fees.isProcessingFeeCapped ? (
                      <>
                        The processing fee is capped at {club.currency_symbol}
                        600 for large investments. The platform fee (3%) is
                        deducted from the campaign amount. The total amount
                        deducted from your club balance ({club.currency_symbol}
                        {fees.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        ) will be sent to the campaign.
                      </>
                    ) : (
                      <>
                        The platform fee (3%) is deducted from the campaign
                        amount, while the processing fee (7%) is an additional
                        cost to your club. The total amount deducted from your
                        club balance ({club.currency_symbol}
                        {fees.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        ) will be sent to the campaign.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Balance Check Warning */}
            {fees && fees.totalAmount > club.financials.current_balance && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700 text-sm">
                  <strong>Insufficient Balance:</strong> This investment
                  requires {club.currency_symbol}
                  {fees.totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  but your club only has {club.currency_symbol}
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
                className="border-gray-300 text-gray-900 placeholder:text-gray-500 resize-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:outline-none"
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
                !club.is_admin ||
                !isKycVerified || // Use the computed KYC status
                !!(fees && fees.totalAmount > club.financials.current_balance)
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Make Investment'}
            </Button>
          </div>

          {/* Enhanced permission messages */}
          <div className="mt-2 space-y-1">
            {!club.is_admin && (
              <p className="text-xs text-red-600 text-center">
                Only club admins can create investments
              </p>
            )}
            {!isKycVerified && (
              <p className="text-xs text-yellow-600 text-center">
                KYC verification required to make investments
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateClubInvestmentModal;
