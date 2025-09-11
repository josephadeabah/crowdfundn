import React from 'react';
import { Button } from '@/app/components/button/Button';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignFundraiserInfoProps {
  campaign: SingleCampaignResponseDataType | null;
  setIsContactModalOpen: (isOpen: boolean) => void;
}

const CampaignFundraiserInfo: React.FC<CampaignFundraiserInfoProps> = ({
  campaign,
  setIsContactModalOpen,
}) => {
  const fundraiserName =
    campaign?.fundraiser?.profile?.name || campaign?.fundraiser?.name;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
      <div className="flex-shrink-0">
        <Avatar
          name={fundraiserName as string}
          size="lg"
          imageUrl={campaign?.fundraiser?.profile?.avatar as string}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
        <div className="text-center sm:text-left">
          <div className="text-sm italic text-gray-700 mb-1">
            Fundraiser
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {fundraiserName}
          </h3>
          <Button
            onClick={() => setIsContactModalOpen(true)}
            variant="outline"
            className="w-full flex items-center justify-center bg-white border hover:text-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 shadow-none"
          >
            Contact
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-700 p-2">
        {campaign?.fundraiser?.profile?.description ||
          'No description provided.'}
      </div>
    </div>
  );
};

export default CampaignFundraiserInfo;
