// app/components/club/CreateClubInvestmentModal.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { investmentService } from '@/app/account/investor-clubs/clubservice';
import { Club } from '../clubTypes';
import { EquityCampaignResponseDataType } from '@/app/types/equityCampaigns.types';

interface CreateClubInvestmentModalProps {
  club: Club;
  campaign?: EquityCampaignResponseDataType;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  token?: string | null;
}

const CreateClubInvestmentModal: React.FC<CreateClubInvestmentModalProps> = ({
  club,
  campaign,
  trigger,
  onSuccess,
  isOpen,
  onClose,
  token,
}) => {
  const [open, setOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use controlled open state if provided, otherwise use internal state
  const modalOpen = isOpen !== undefined ? isOpen : open;
  const setModalOpen = onClose || setOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaign || !club || !token) {
      setError('Missing required information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const investmentData = {
        campaign_id: String(campaign.id),
        investment_amount: parseFloat(investmentAmount),
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
    setInvestmentAmount('');
    setNotes('');
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setModalOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make Club Investment</DialogTitle>
          <DialogDescription>
            {campaign
              ? `Invest club funds in ${campaign.company_info.name}`
              : 'Create a new investment for your club'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {campaign && (
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-medium">{campaign.title}</h4>
              <p className="text-sm text-muted-foreground">
                {campaign.company_info.name}
              </p>
              <div className="text-xs mt-1 space-y-1">
                <div>
                  Valuation: {campaign.currency_symbol}
                  {campaign.valuation?.toLocaleString()}
                </div>
                <div>Equity Offered: {campaign.equity_offered}%</div>
                {campaign.minimum_investment && (
                  <div>
                    Minimum: {campaign.currency_symbol}
                    {campaign.minimum_investment}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="investmentAmount">Investment Amount</Label>
            <Input
              id="investmentAmount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter investment amount"
              required
              min={campaign?.minimum_investment || 1}
              step="0.01"
            />
            {campaign?.minimum_investment && (
              <p className="text-xs text-muted-foreground">
                Minimum investment: {campaign.currency_symbol}
                {campaign.minimum_investment}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context or reasoning for this investment..."
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Invest Now'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClubInvestmentModal;