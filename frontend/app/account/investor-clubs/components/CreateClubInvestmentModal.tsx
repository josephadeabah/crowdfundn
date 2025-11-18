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

interface CreateClubInvestmentModalProps {
  club: Club;
  approvedCampaigns: ApprovedCampaign[];
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  token?: string | null;
}

const CreateClubInvestmentModal: React.FC<CreateClubInvestmentModalProps> = ({
  club,
  approvedCampaigns = [],
  onSuccess,
  isOpen,
  onClose,
  token,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose || setOpen;

  const selectedCampaign = approvedCampaigns.find(
    (c) => c.campaign.id.toString() === selectedCampaignId,
  );

  useEffect(() => {
    if (!modalOpen) resetForm();
  }, [modalOpen]);

  const resetForm = () => {
    setSelectedCampaignId('');
    setInvestmentAmount('');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add admin check
    if (!club.is_admin) {
      setError('Only club admins can create investments');
      return;
    }

    if (!selectedCampaignId || !club || !token) {
      setError('Please select a campaign and ensure all data is available');
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Enter a valid investment amount');
      return;
    }

    // Check if club has sufficient balance
    if (parseFloat(investmentAmount) > club.financials.current_balance) {
      setError(`Insufficient club balance. Available: ${club.currency_symbol}${club.financials.current_balance.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const investmentData = {
        campaign_id: selectedCampaignId,
        investment_amount: parseFloat(investmentAmount),
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
        setError(result.message || 'Failed to create investment');
      }
    } catch (err: any) {
      console.error('Failed to create investment:', err);
      setError(err.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={handleClose}
      size="large"
      closeOnBackdropClick={true}
      customStyles={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh', // Reduced from 95vh to ensure everything fits
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

        {/* Scrollable Content - with max height constraint */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0"> {/* Added min-h-0 for proper flex shrinking */}
          <form id="investment-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Select Campaign */}
            <div className="space-y-2">
              <Label htmlFor="campaign" className="text-gray-900">
                Select Campaign
              </Label>
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
              >
                <SelectTrigger className="w-full border-gray-300 text-gray-900 [&>span]:text-gray-900 focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
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
            </div>

            {/* Selected Campaign Details */}
            {selectedCampaign && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  {selectedCampaign.campaign.fundraiser?.name || 'Unknown fundraiser'}
                </p>
                <div className="text-xs mt-1 space-y-1 text-gray-700">
                  <div>
                    Goal: {selectedCampaign.campaign.currency_symbol || selectedCampaign.campaign.currency}
                    {selectedCampaign.campaign.goal_amount?.toLocaleString()}
                  </div>
                  <div>
                    Raised: {selectedCampaign.campaign.currency_symbol || selectedCampaign.campaign.currency}
                    {selectedCampaign.campaign.current_amount?.toLocaleString()}
                  </div>
                  <div>Category: {selectedCampaign.campaign.category}</div>
                  {selectedCampaign.club_investment?.proposed_amount && (
                    <div>
                      Proposed: {club.currency_symbol}
                      {selectedCampaign.club_investment.proposed_amount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="investmentAmount" className="text-gray-900">
                Investment Amount ({club.currency})
              </Label>
              <Input
                id="investmentAmount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Enter investment amount"
                required
                min="1"
                step="0.01"
                className="border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:outline-none"
              />
              <p className="text-xs text-gray-500">
                Available balance: {club.currency_symbol}{club.financials.current_balance.toLocaleString()}
              </p>
            </div>

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

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
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
              disabled={loading || !selectedCampaignId || approvedCampaigns.length === 0 || !club.is_admin}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Investment'}
            </Button>
          </div>
          {!club.is_admin && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Only club admins can create investments
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateClubInvestmentModal;