import React from 'react';
import { Button } from '@/app/components/button/Button';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import { Mail, Shield, Building, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';

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

  const isVerified =
    campaign?.fundraiser_kyc_verified && !campaign?.fundraiser_kyc_expired;
  const isIssuerVerified = campaign?.fundraiser?.issuer_kyc_verified;
  const isInvestorVerified = campaign?.fundraiser?.investor_kyc_verified;

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
            {/* Verification Badge on Avatar */}
            {isVerified && (
              <div className="absolute -bottom-2 -right-2">
                <Badge
                  variant="default"
                  className="bg-green-500 text-white px-2 py-1 text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">
                Fundraiser
              </div>

              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {fundraiserName}
                </h3>

                {/* Verification Status Badges */}
                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        KYC Verified
                      </Badge>

                      {isIssuerVerified && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Building className="h-3 w-3 mr-1" />
                          Business
                        </Badge>
                      )}

                      {isInvestorVerified && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Investor
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-600"
                    >
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* KYC Status Details */}
              {campaign?.fundraiser_kyc_status &&
                campaign.fundraiser_kyc_status !== 'none' && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500">
                      KYC Status:{' '}
                      <span className="font-medium capitalize">
                        {campaign.fundraiser_kyc_status.replace('_', ' ')}
                      </span>
                      {campaign?.fundraiser.kyc_verified_at && (
                        <span className="ml-2">
                          • Verified:{' '}
                          {new Date(
                            campaign?.fundraiser.kyc_verified_at,
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {campaign.fundraiser_kyc_expired && (
                        <span className="ml-2 text-orange-600">• Expired</span>
                      )}
                    </div>
                  </div>
                )}

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

          {/* Additional Verification Info */}
          {isVerified && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    Verification Type
                  </div>
                  <div className="text-gray-600 capitalize">
                    {campaign?.fundraiser_kyc_type || 'Standard'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Status</div>
                  <div className="text-green-600 font-medium">Active</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">Trust Level</div>
                  <div className="text-gray-600">
                    {isIssuerVerified && isInvestorVerified
                      ? 'Full Platform'
                      : isIssuerVerified
                        ? 'Business Only'
                        : isInvestorVerified
                          ? 'Investor Only'
                          : 'Standard'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignFundraiserInfo;
