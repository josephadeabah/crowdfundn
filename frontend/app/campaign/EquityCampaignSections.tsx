import React from 'react';
import {
  FaChartLine,
  FaMoneyBillWave,
  FaPercentage,
  FaHandHoldingUsd,
  FaUsers,
  FaBuilding,
  FaLink,
  FaFileContract,
  FaShareAlt,
} from 'react-icons/fa';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import InfoTooltip from '../components/tooltip/tooltip';
import { deslugify } from '../utils/helpers/categories';

interface EquityCampaignSectionsProps {
  campaign: SingleCampaignResponseDataType | null;
}

const EquityCampaignSections: React.FC<EquityCampaignSectionsProps> = ({
  campaign,
}) => {
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  // Filter only contract documents
  const contractDocuments =
    campaign?.investor_documents?.filter(
      (doc) => doc.document_type === 'contract',
    ) || [];

  const CONTRACT_TERM = `The contract term for this investment opportunity will depend on the structure agreed between the company and investors.\n\n
Please note: BantuHive does not provide default legal documents. Companies should work with their legal advisors to ensure all agreements meet regulatory standards.\n\n
<a href="/investment-contracts" target="_blank" class="text-blue-400 hover:underline">Learn more about investment contracts in Ghana</a>`;

  return (
    <div className="mb-10 space-y-6">
      {/* Investment Details Section */}
      <div className="bg-white py-6 px-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="mr-2 text-green-600" />
          Investment Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <FaMoneyBillWave className="text-green-600" />
              </div>
              <h3 className="font-medium text-gray-700">Valuation</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {fundraiserCurrency}
              {parseFloat(String(campaign?.valuation || '0')).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <FaPercentage className="text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-700">Equity Offered</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {campaign?.equity_offered}%
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <FaHandHoldingUsd className="text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-700">Investment Range</h3>
            </div>
            <p className="text-xl font-semibold text-gray-800">
              Min: {fundraiserCurrency}
              {parseFloat(
                String(campaign?.minimum_investment || '0'),
              ).toLocaleString()}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-1">
              Max: {fundraiserCurrency}
              {parseFloat(
                String(campaign?.maximum_investment || '0'),
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                <FaShareAlt className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-700">Shares Issued</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {parseFloat(
                campaign?.shares_issued?.toString() || '0',
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-yellow-100 rounded-full mr-3">
                <FaUsers className="text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-700">Selling Shares</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {parseFloat(
                campaign?.shares_available?.toString() || '0',
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <FaShareAlt className="text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-700">Total Shares</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {parseFloat(
                campaign?.total_equity_shares.toString() || '0',
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-white py-6 px-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaBuilding className="mr-2 text-blue-600" />
          Company Information
        </h2>
        <div className="space-y-5">
          <div className="pb-3">
            <h3 className="font-semibold text-gray-700 mb-1">Name</h3>
            <p className="text-gray-800">
              {campaign?.company_info?.name || 'N/A'}
            </p>
          </div>
          <div className="pb-3">
            <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {campaign?.company_info?.description || 'No description provided'}
            </p>
          </div>
          <div className="pb-3">
            <h3 className="font-semibold text-gray-700 mb-1">Headquarters</h3>
            <p className="text-gray-700">
              {campaign?.company_info?.headquarters || 'N/A'}
            </p>
          </div>
          <div className="pb-3">
            <h3 className="font-semibold text-gray-700 mb-1">
              <span className="flex gap-2 items-center">
                Contract Term
                <InfoTooltip
                  id={`contract-term-tooltip`}
                  content={CONTRACT_TERM}
                />
              </span>
            </h3>
            <p className="text-gray-700">
              {deslugify(campaign?.company_info?.contract_term || 'N/A')}
            </p>
          </div>
          {campaign?.company_info?.website && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Website</h3>
              <a
                href={campaign.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center transition-colors"
              >
                <FaLink className="mr-2" />
                {campaign.company_info.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Investment Documents Section */}
      {contractDocuments.length > 0 && (
        <div className="bg-white py-6 px-4 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaFileContract className="mr-2 text-orange-500" />
            Contract Documents
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Review the legal documents for this investment opportunity:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {contractDocuments.map((document) => (
                <div
                  key={document.id}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  {document.files.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center">
                        <FaFileContract className="text-orange-500 mr-3 text-lg" />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {document.display_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {file.human_size} • {file.content_type}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-md border border-gray-300 transition-colors font-medium text-sm whitespace-nowrap"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      <div className="bg-white py-6 px-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUsers className="mr-2 text-purple-600" />
          Team Members
        </h2>
        {campaign?.team_members?.length ? (
          <div className="grid grid-cols-1 gap-4">
            {campaign.team_members.map((member) => (
              <div key={member.id} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <Avatar
                      name={member.name}
                      size="xl"
                      imageUrl={member.avatar_url}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 font-medium">{member.title}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 py-4 text-center">No team members available.</p>
        )}
      </div>
    </div>
  );
};

export default EquityCampaignSections;