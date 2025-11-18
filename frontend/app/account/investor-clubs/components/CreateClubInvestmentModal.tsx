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

  // Use controlled open state if provided, otherwise use internal state
  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose || setOpen;

  // Get selected campaign details
  const selectedCampaign = approvedCampaigns.find(
    (campaign) => campaign.campaign.id === selectedCampaignId,
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!modalOpen) {
      resetForm();
    }
  }, [modalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCampaignId || !club || !token) {
      setError(
        'Please select a campaign and ensure all required information is available',
      );
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Please enter a valid investment amount');
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

      const result = await investmentService.createInvestment(
        token,
        club.id,
        investmentData,
      );

      if (result.success) {
        setModalOpen(false);
        resetForm();
        onSuccess?.();

        // For equity investments, redirect to payment
        if (result.authorization_url) {
          window.location.href = result.authorization_url;
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

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        size="medium"
        closeOnBackdropClick={true}
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Make Club Investment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Invest club funds in an approved campaign
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campaign Selection */}
            <div className="space-y-2">
              <Label htmlFor="campaign" className="text-gray-900">
                Select Campaign
              </Label>
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none [&>span]:text-gray-900">
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
                        value={campaign.campaign.id}
                        className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {campaign.campaign.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {approvedCampaigns.length === 0 && (
                <p className="text-xs text-gray-500">
                  No approved campaigns available. Campaigns must be approved by
                  club members before investment.
                </p>
              )}
            </div>

            {/* Selected Campaign Details */}
            {selectedCampaign && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900">
                  {selectedCampaign.campaign.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedCampaign.campaign.fundraiser?.name ||
                    'Unknown fundraiser'}
                </p>
                <div className="text-xs mt-1 space-y-1 text-gray-700">
                  <div>
                    Goal: {selectedCampaign.campaign.currency_symbol}
                    {selectedCampaign.campaign.goal_amount?.toLocaleString()}
                  </div>
                  <div>
                    Raised: {selectedCampaign.campaign.currency_symbol}
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
                className="border-gray-300 focus:ring-0 focus:ring-gray-200 focus:border-gray-200 focus:outline-none text-gray-900 placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Enter the amount you want to invest from the club's funds
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
                className="border-gray-300 focus:ring-0 focus:ring-gray-50 focus:border-gray-50 focus:outline-none text-gray-900 placeholder:text-gray-500 resize-none"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
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
                disabled={
                  loading ||
                  !selectedCampaignId ||
                  approvedCampaigns.length === 0
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Investment'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateClubInvestmentModal;