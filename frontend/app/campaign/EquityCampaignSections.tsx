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
} from 'react-icons/fa';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

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

  return (
    <div className="mb-10">
      {/* Investment Details Section */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <FaChartLine className="mr-2 text-green-600" />
          Investment Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                <FaMoneyBillWave className="text-green-600 dark:text-green-300" />
              </div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">
                Valuation
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {fundraiserCurrency}
              {parseFloat(String(campaign?.valuation || '0')).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                <FaPercentage className="text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">
                Equity Offered
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign?.equity_offered}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                <FaHandHoldingUsd className="text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">
                Minimum Investment
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {fundraiserCurrency}
              {parseFloat(
                String(campaign?.minimum_investment || '0'),
              ).toLocaleString()}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full mr-3">
                <FaUsers className="text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">
                Shares Available
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {parseFloat(
                campaign?.shares_available?.toString() || '0',
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <FaBuilding className="mr-2 text-blue-600" />
          Company Information
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Name
            </h3>
            <p className="text-gray-900 dark:text-white">
              {campaign?.company_info?.name || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Description
            </h3>
            <p className="text-gray-900 dark:text-white">
              {campaign?.company_info?.description || 'No description provided'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Headquarters
            </h3>
            <p className="text-gray-900 dark:text-white">
              {campaign?.company_info?.headquarters || 'N/A'}
            </p>
          </div>
          {campaign?.company_info?.website && (
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Website
              </h3>
              <a
                href={campaign.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:underline flex items-center"
              >
                <FaLink className="mr-1" />
                {campaign.company_info.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Investment Documents Section */}
      {contractDocuments.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <FaFileContract className="mr-2 text-orange-500" />
            Contract Documents
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Review the legal documents for this investment opportunity:
            </p>
            <div className="grid grid-cols-1 gap-4">
              {contractDocuments.map((document) => (
                <div
                  key={document.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {document.files.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <FaFileContract className="text-orange-500 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {document.display_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {file.human_size} • {file.content_type}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <FaUsers className="mr-2 text-purple-600" />
          Team Members
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {campaign?.team_members?.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4 gap-3">
                <div className="w-16 h-16 flex-shrink-0">
                  <Avatar
                    name={member.name}
                    size="xl"
                    imageUrl={member.avatar_url}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {member.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {member.description}
                  </p>
                  {member.equity_percentage && (
                    <div className="mt-3">
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                        {member.equity_percentage}% Equity
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquityCampaignSections;
