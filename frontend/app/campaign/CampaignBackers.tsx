// components/campaigns/CampaignBackers.tsx
import React, { useEffect } from 'react';
import DonationList from '@/app/components/backerlist/DonationList';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import InvestmentList from '../components/backerlist/InvestmentList';
import { useEquityCampaignContext } from '@/app/context/account/campaign/EquityCampaignContext';

interface CampaignBackersProps {
  campaign: SingleCampaignResponseDataType | null;
  isEquityCampaign: boolean;
}

const CampaignBackers: React.FC<CampaignBackersProps> = ({
  campaign,
  isEquityCampaign,
}) => {
  const { fetchPublicInvestments, investments, pagination } = useEquityCampaignContext();
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  // Fetch public investments immediately when component mounts
  useEffect(() => {
    if (isEquityCampaign && campaign?.id) {
      fetchPublicInvestments(String(campaign.id), 1, 10);
    }
  }, [isEquityCampaign, campaign?.id, fetchPublicInvestments]);

  const handlePageChange = async (page: number) => {
    if (campaign?.id) {
      await fetchPublicInvestments(String(campaign.id), page, pagination?.per_page || 10);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 mx-auto px-2 py-6">
      <h3 className="text-2xl font-bold mb-6 dark:text-white">
        {isEquityCampaign ? 'Investors' : 'Backers'}
      </h3>
      {isEquityCampaign ? (
        <InvestmentList
          currencySymbol={fundraiserCurrency}
          campaignId={String(campaign?.id)}
          investments={investments}
          pagination={pagination}
          onPageChange={handlePageChange}
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