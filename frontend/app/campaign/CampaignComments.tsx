import React from 'react';
import CommentsSection from '@/app/components/comments/CommentSection';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignCommentsProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignComments: React.FC<CampaignCommentsProps> = ({ campaign }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 mx-auto px-2 py-6">
      <CommentsSection campaignId={String(campaign?.id)} />
    </div>
  );
};

export default CampaignComments;
