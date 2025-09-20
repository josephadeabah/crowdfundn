import React from 'react';
import { Button } from '@/app/components/button/Button';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import { Mail } from 'lucide-react';

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
    <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar
              name={fundraiserName as string}
              size="xl"
              imageUrl={campaign?.fundraiser?.profile?.avatar as string}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">
                Fundraiser
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {fundraiserName}
              </h3>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {campaign?.fundraiser?.profile?.description ||
                    'No description provided.'}
                </p>
              </div>
            </div>

            {/* Contact Button */}
            <div className="sm:text-right">
              <Button
                onClick={() => setIsContactModalOpen(true)}
                variant="outline"
                className="group flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">Contact</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignFundraiserInfo;
