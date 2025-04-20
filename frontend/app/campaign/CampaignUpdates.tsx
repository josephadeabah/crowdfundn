import React from 'react';
import FundraiserUpdates from '@/app/components/fundraiserupdate/FundraiserUpdates';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignUpdatesProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignUpdates: React.FC<CampaignUpdatesProps> = ({ campaign }) => {
  const fundraiserName =
    campaign?.fundraiser?.profile?.name || campaign?.fundraiser?.name;

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
      <FundraiserUpdates
        updates={campaign?.updates || []}
        fundraiserName={fundraiserName}
      />
    </div>
  );
};

export default CampaignUpdates;
