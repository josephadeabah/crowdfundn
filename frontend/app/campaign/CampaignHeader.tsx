import React from 'react';
import Image from 'next/image';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignHeaderProps {
  campaign: SingleCampaignResponseDataType | null;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{campaign?.title}</h1>
      <div className="h-[600px]">
        <div className="relative w-full h-full mb-4">
          <Image
            src={campaign?.media || '/bantuhive.svg'}
            alt={campaign?.title as string}
            loading="eager"
            layout="fill"
            objectFit="cover"
            unoptimized
            className="absolute top-0 left-0 w-full h-full rounded-t"
            quality={100}
            priority
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.currentTarget.src = '/bantuhive.svg';
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CampaignHeader;
