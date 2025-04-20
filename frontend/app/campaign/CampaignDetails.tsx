import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { FaFlag, FaBookmark, FaRegBookmark, FaLink } from 'react-icons/fa';
import { deslugify } from '@/app/utils/helpers/categories';
import CampaignShareSection from './CampaignShareSection';
import CampaignFundraiserInfo from './CampaignFundraiserInfo';
import EquityCampaignSections from './EquityCampaignSections';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import { LoginUserType } from '../types/auth.login.types';

interface CampaignDetailsProps {
  campaign: SingleCampaignResponseDataType | null;
  isEquityCampaign: boolean;
  showToast: (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => void;
  setIsContactModalOpen: (isOpen: boolean) => void;
  user: LoginUserType | null;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  isEquityCampaign,
  showToast,
  setIsContactModalOpen,
  user,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
      {isEquityCampaign && <EquityCampaignSections campaign={campaign} />}

      {/* Campaign Description */}
      <div
        className="prose dark:prose-dark max-w-none"
        dangerouslySetInnerHTML={{
          __html: campaign?.description?.body || '',
        }}
      />

      <CampaignShareSection
        campaign={campaign}
        showToast={showToast}
        user={user}
      />

      <CampaignFundraiserInfo
        campaign={campaign}
        setIsContactModalOpen={setIsContactModalOpen}
      />

      <hr className="border-t-1 my-2" />
      <div className="w-full px-1 flex items-center">
        <span>Created</span>
        <span className="ml-2">
          {campaign?.created_at
            ? moment(campaign.created_at).format('D MMMM YYYY')
            : 'Unknown Date'}
        </span>
        <div className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
        <Link href="/explore/category">
          <span className="text-gray-500 font-semibold underline ml-1">
            {campaign?.category
              ? deslugify(campaign.category)
              : 'Unknown Category'}
          </span>
        </Link>
      </div>
      <hr className="border-t-1 border-gray-300 my-2" />
      <div className="flex items-center justify-between mt-4">
        <Link href="/report-fundraiser">
          <a className="flex items-center px-4 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300 ease-in-out">
            <FaFlag className="mr-2" />
            Report a Fundraiser
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CampaignDetails;
