// components/campaigns/CampaignBackers.tsx
import React from 'react';
import DonationList from '@/app/components/backerlist/DonationList';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import InvestmentList from '../components/backerlist/InvestmentList';

interface CampaignBackersProps {
  campaign: SingleCampaignResponseDataType | null;
  isEquityCampaign: boolean;
}

const CampaignBackers: React.FC<CampaignBackersProps> = ({
  campaign,
  isEquityCampaign,
}) => {
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-800 mx-auto px-2 py-6">
      <h3 className="text-2xl font-bold mb-6 dark:text-white">
        {isEquityCampaign ? 'Investors' : 'Backers'}
      </h3>
      {isEquityCampaign ? (
        <InvestmentList
          currencySymbol={fundraiserCurrency}
          campaignId={String(campaign?.id)}
        />
      ) : (
        <DonationList
          fundraiserCurrency={fundraiserCurrency}
          campaignId={String(campaign?.id)}
        />
      )}
    </div>
  );
};

export default CampaignBackers;
