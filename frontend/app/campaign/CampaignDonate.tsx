import React from 'react';
import RewardSelection from '@/app/components/selectreward/RewardSelection';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignDonateProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignDonate: React.FC<CampaignDonateProps> = ({ campaign }) => {
  const [selectedTier, setSelectedTier] = React.useState<number | null>(null);
  const [pledgeAmount, setPledgeAmount] = React.useState<string>('0');
  const [billingFrequency, setBillingFrequency] =
    React.useState<string>('once');

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    const selectedReward = campaign?.rewards.find(
      (reward) => reward.id === tierId,
    );
    if (selectedReward) setPledgeAmount(selectedReward.amount.toString());
  };

  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 dark:text-gray-100 px-2 py-6">
      <RewardSelection
        rewards={campaign?.rewards || []}
        selectedTier={selectedTier}
        onTierSelect={handleTierSelect}
        pledgeAmount={pledgeAmount}
        setPledgeAmount={setPledgeAmount}
        billingFrequency={billingFrequency}
        setBillingFrequency={setBillingFrequency}
        fundraiserDetails={{
          id: String(campaign?.fundraiser_id),
          campaignId: String(campaign?.id),
          campaignTitle: campaign?.title,
          campaignCurrency: fundraiserCurrency,
        }}
      />
    </div>
  );
};

export default CampaignDonate;
