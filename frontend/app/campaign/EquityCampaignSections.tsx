'use client';
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
  FaExternalLinkAlt,
  FaChartBar,
  FaBullseye,
  FaChessBoard,
  FaRocket,
} from 'react-icons/fa';
import Avatar from '@/app/components/avatar/Avatar';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';
import InfoTooltip from '../components/tooltip/tooltip';
import { deslugify } from '../utils/helpers/categories';

interface EquityCampaignCardsProps {
  campaign: SingleCampaignResponseDataType | null;
}

const EquityCampaignSections: React.FC<EquityCampaignCardsProps> = ({
  campaign,
}) => {
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  const contractDocuments =
    campaign?.investor_documents?.filter(
      (doc) => doc.document_type === 'contract',
    ) || [];

  const CONTRACT_TERM = `The contract term for this investment opportunity will depend on the structure agreed between the company and investors.\n\nPlease note: BantuHive does not provide default legal documents. Companies should work with their legal advisors to ensure all agreements meet regulatory standards.\n\n<a href="/investment-contracts" target="_blank" class="text-gray-500 hover:underline">Learn more about investment contracts in Ghana</a>`;

  // Format large numbers with compact notation for better readability
  const formatLargeNumber = (value: string | number): string => {
    const num = parseFloat(String(value || '0'));

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }

    return parseFloat(String(value || '0')).toLocaleString();
  };

  const formatCurrency = (value: string | number): string => {
    const num = parseFloat(String(value || '0'));

    if (num >= 1000000) {
      return `${fundraiserCurrency}${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${fundraiserCurrency}${(num / 1000).toFixed(1)}K`;
    }

    return `${fundraiserCurrency}${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Investment Details */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl mr-4">
            <FaChartLine className="text-2xl text-green-600" />
          </div>
          <div className="block space-y-1">
            <h2 className="text-3xl font-bold text-gray-900">
              INVESTMENT DETAILS
            </h2>
            <h4 className="text-xl font-bold text-gray-500">
              {campaign?.company_info?.name}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={<FaMoneyBillWave className="text-green-600" />}
            label="Valuation"
            value={formatCurrency(campaign?.valuation || '0')}
            gradient="from-green-50 to-green-100"
            fullValue={`${fundraiserCurrency}${parseFloat(
              String(campaign?.valuation || '0'),
            ).toLocaleString()}`}
          />

          <MetricCard
            icon={<FaPercentage className="text-gray-600" />}
            label="Equity Offered"
            value={`${campaign?.equity_offered}%`}
            gradient="from-gray-50 to-gray-100"
          />

          <InvestmentRangeCard
            currency={fundraiserCurrency || ''}
            min={campaign?.minimum_investment || '0'}
            max={campaign?.maximum_investment || '0'}
            formatCurrency={formatCurrency}
          />

          <MetricCard
            icon={<FaShareAlt className="text-orange-600" />}
            label="Shares Issued"
            value={formatLargeNumber(campaign?.shares_issued || '0')}
            gradient="from-orange-50 to-orange-100"
            fullValue={parseFloat(
              campaign?.shares_issued?.toString() || '0',
            ).toLocaleString()}
          />

          <MetricCard
            icon={<FaUsers className="text-purple-600" />}
            label="Selling Shares"
            value={formatLargeNumber(campaign?.shares_available || '0')}
            gradient="from-purple-50 to-purple-100"
            fullValue={parseFloat(
              campaign?.shares_available?.toString() || '0',
            ).toLocaleString()}
          />

          <MetricCard
            icon={<FaShareAlt className="text-indigo-600" />}
            label="Total Shares"
            value={formatLargeNumber(campaign?.total_equity_shares || '0')}
            gradient="from-indigo-50 to-indigo-100"
            fullValue={parseFloat(
              campaign?.total_equity_shares?.toString() || '0',
            ).toLocaleString()}
          />
        </div>
      </div>

      {/* Equity Offering Structure */}
      {campaign?.equity_offering_details && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl mr-4">
              <FaChartBar className="text-2xl text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Offering Structure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaign.equity_offering_details.minimum_target && (
              <MetricCard
                icon={<FaBullseye className="text-indigo-600" />}
                label="Minimum Target"
                value={formatCurrency(
                  campaign.equity_offering_details.minimum_target,
                )}
                gradient="from-indigo-50 to-indigo-100"
                fullValue={`${fundraiserCurrency}${parseFloat(
                  campaign.equity_offering_details.minimum_target.toString(),
                ).toLocaleString()}`}
              />
            )}

            {campaign.equity_offering_details.price_per_share && (
              <MetricCard
                icon={<FaMoneyBillWave className="text-green-600" />}
                label="Price Per Share"
                value={`${fundraiserCurrency}${parseFloat(campaign.equity_offering_details.price_per_share.toString()).toFixed(4)}`}
                gradient="from-green-50 to-green-100"
                fullValue={`${fundraiserCurrency}${parseFloat(campaign.equity_offering_details.price_per_share.toString()).toLocaleString()}`}
              />
            )}

            {campaign.equity_offering_details.stock_type_display && (
              <MetricCard
                icon={<FaChessBoard className="text-purple-600" />}
                label="Stock Type"
                value={campaign.equity_offering_details.stock_type_display}
                gradient="from-purple-50 to-purple-100"
              />
            )}

            {campaign.equity_offering_details.funding_round_display && (
              <MetricCard
                icon={<FaRocket className="text-orange-600" />}
                label="Funding Round"
                value={campaign.equity_offering_details.funding_round_display}
                gradient="from-orange-50 to-orange-100"
              />
            )}

            {campaign.equity_offering_details.shares_offered && (
              <MetricCard
                icon={<FaShareAlt className="text-gray-600" />}
                label="Shares Offered"
                value={formatLargeNumber(
                  campaign.equity_offering_details.shares_offered,
                )}
                gradient="from-gray-50 to-gray-100"
                fullValue={parseFloat(
                  campaign.equity_offering_details.shares_offered.toString(),
                ).toLocaleString()}
              />
            )}

            {campaign.equity_offering_details.min_shares &&
              campaign.equity_offering_details.max_shares && (
                <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                      <FaChartLine className="text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm lg:text-base">
                      Shares Range
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Min:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-lg lg:text-xl text-right">
                          {formatLargeNumber(
                            campaign.equity_offering_details.min_shares,
                          )}
                        </span>
                        <InfoTooltip
                          id="min-shares-tooltip"
                          content={`Full amount: ${parseFloat(campaign.equity_offering_details.min_shares.toString()).toLocaleString()} shares`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Max:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-lg lg:text-xl text-right">
                          {formatLargeNumber(
                            campaign.equity_offering_details.max_shares,
                          )}
                        </span>
                        <InfoTooltip
                          id="max-shares-tooltip"
                          content={`Full amount: ${parseFloat(campaign.equity_offering_details.max_shares.toString()).toLocaleString()} shares`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Company Information */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mr-4">
            <FaBuilding className="text-2xl text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Company Information
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InfoField
              label="Company Name"
              value={campaign?.company_info?.name}
            />
            <InfoField
              label="Headquarters"
              value={campaign?.company_info?.headquarters}
            />
            {campaign?.company_info?.website && (
              <InfoField
                label="Website"
                value={campaign.company_info.website}
                isLink
              />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="font-semibold text-gray-900">
                  Contract Term
                </label>
                <InfoTooltip
                  id="contract-term-tooltip"
                  content={CONTRACT_TERM}
                />
              </div>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                {deslugify(
                  campaign?.company_info?.contract_term || 'Not specified',
                )}
              </p>
            </div>

            <div>
              <label className="font-semibold text-gray-900 block mb-3">
                Description
              </label>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
                {campaign?.company_info?.description ||
                  'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Documents */}
      {contractDocuments.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl mr-4">
              <FaFileContract className="text-2xl text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Contract Documents
            </h2>
          </div>

          <p className="text-gray-600 mb-6">
            Review the legal documents for this investment opportunity
          </p>

          <div className="grid gap-4">
            {contractDocuments.map((document) =>
              document.files.map((file) => (
                <DocumentCard
                  key={file.filename}
                  name={document.display_name}
                  size={file.human_size}
                  type={file.content_type}
                  url={file.url}
                />
              )),
            )}
          </div>
        </div>
      )}

      {/* Offering Documents */}
      {(campaign?.equity_offering_details?.sec_filing_url ||
        campaign?.equity_offering_details?.offering_circular_url ||
        campaign?.equity_offering_details?.offering_documents
          ?.offering_memorandum?.attached) && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl mr-4">
              <FaFileContract className="text-2xl text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              SEC Filing
            </h2>
          </div>

          <div className="grid gap-4">
            {/* SEC Filing URL */}
            {campaign.equity_offering_details.sec_filing_url && (
              <ExternalDocumentCard
                name="SEC Filing"
                url={campaign.equity_offering_details.sec_filing_url}
                type="SEC Regulatory Filing"
              />
            )}

            {/* Offering Circular URL */}
            {campaign.equity_offering_details.offering_circular_url && (
              <ExternalDocumentCard
                name="Offering Circular"
                url={campaign.equity_offering_details.offering_circular_url}
                type="Investment Circular"
              />
            )}

            {/* Offering Memorandum File */}
            {campaign.equity_offering_details.offering_documents
              ?.offering_memorandum?.attached && (
              <DocumentCard
                name="Offering Memorandum"
                size="Document"
                type="Investment Memorandum"
                url={
                  campaign.equity_offering_details.offering_documents
                    .offering_memorandum.url || ''
                }
              />
            )}

            {/* Offering Memorandum Text */}
            {campaign.equity_offering_details.offering_memorandum &&
              !campaign.equity_offering_details.offering_documents
                ?.offering_memorandum?.attached && (
                <div className="bg-gray-50 rounded-2xl p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Offering Memorandum
                  </h3>
                  <p className="text-gray-700">
                    {campaign.equity_offering_details.offering_memorandum}
                  </p>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mr-4">
            <FaUsers className="text-2xl text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Team Members</h2>
        </div>

        {campaign?.team_members?.length ? (
          <div className="grid gap-6">
            {campaign.team_members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                No team members available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------- Reusable Components ----------- */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  fullValue?: string; // For tooltip display
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  gradient,
  fullValue,
}) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg relative">
    <div className="flex items-center mb-4">
      <div
        className={`p-3 rounded-xl ${gradient} mr-3 group-hover:scale-110 transition-transform flex-shrink-0`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-700 text-sm lg:text-base">
        {label}
      </h3>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate min-w-0">
        {value}
      </p>
      {fullValue && fullValue !== value && (
        <InfoTooltip
          id={`${label}-tooltip`}
          content={`Full value: ${fullValue}`}
          className="flex-shrink-0 ml-2"
        />
      )}
    </div>
  </div>
);

interface InvestmentRangeCardProps {
  currency: string;
  min: string | number;
  max: string | number;
  formatCurrency: (value: string | number) => string;
}

const InvestmentRangeCard: React.FC<InvestmentRangeCardProps> = ({
  currency,
  min,
  max,
  formatCurrency,
}) => {
  const minNum = parseFloat(String(min || '0'));
  const maxNum = parseFloat(String(max || '0'));
  const showCompact = minNum >= 1000 || maxNum >= 1000;

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
          <FaHandHoldingUsd className="text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-700 text-sm lg:text-base">
          Investment Range
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">Min:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-lg lg:text-xl text-right">
              {showCompact
                ? formatCurrency(min)
                : `${currency}${minNum.toLocaleString()}`}
            </span>
            {showCompact && (
              <InfoTooltip
                id="min-investment-tooltip"
                content={`Full amount: ${currency}${minNum.toLocaleString()}`}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm lg:text-base">Max:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-lg lg:text-xl text-right">
              {showCompact
                ? formatCurrency(max)
                : `${currency}${maxNum.toLocaleString()}`}
            </span>
            {showCompact && (
              <InfoTooltip
                id="max-investment-tooltip"
                content={`Full amount: ${currency}${maxNum.toLocaleString()}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoFieldProps {
  label: string;
  value?: string;
  isLink?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, isLink }) => (
  <div>
    <label className="font-semibold text-gray-900 block mb-2">{label}</label>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors bg-gray-50 rounded-xl p-4 hover:bg-gray-100 break-all"
      >
        <FaLink className="text-sm flex-shrink-0" />
        <span className="truncate">{value}</span>
        <FaExternalLinkAlt className="text-xs ml-auto flex-shrink-0" />
      </a>
    ) : (
      <p className="text-gray-700 bg-gray-50 rounded-xl p-4 break-words">
        {value || 'Not specified'}
      </p>
    )}
  </div>
);

interface DocumentCardProps {
  name: string;
  size: string;
  type: string;
  url: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  name,
  size,
  type,
  url,
}) => (
  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 transition-all duration-300 group">
    <div className="flex items-center gap-4 min-w-0">
      <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
        <FaFileContract className="text-2xl text-orange-600" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-600">
          {size} • {type}
        </p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 group-hover:shadow-lg flex-shrink-0 ml-4"
    >
      View
      <FaExternalLinkAlt className="text-xs" />
    </a>
  </div>
);

// Add missing ExternalDocumentCard component
interface ExternalDocumentCardProps {
  name: string;
  url: string;
  type: string;
}

const ExternalDocumentCard: React.FC<ExternalDocumentCardProps> = ({
  name,
  url,
  type,
}) => (
  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 group">
    <div className="flex items-center gap-4 min-w-0">
      <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
        <FaExternalLinkAlt className="text-2xl text-gray-600" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-600">{type}</p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium flex items-center gap-2 group-hover:shadow-lg flex-shrink-0 ml-4"
    >
      View
      <FaExternalLinkAlt className="text-xs" />
    </a>
  </div>
);

interface TeamMemberCardProps {
  member: any;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => (
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 group">
    {/* Mobile: Stack layout (image on top) */}
    <div className="flex flex-col sm:flex-row items-start gap-6">
      {/* Avatar - positioned first for mobile stacking */}
      <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
        <Avatar name={member.name} size="xl" imageUrl={member.avatar_url} />
      </div>

      {/* Content - positioned below avatar on mobile, beside on larger screens */}
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
          {member.name}
        </h3>
        <p className="text-gray-700 font-semibold mb-3 truncate">
          {member.title}
        </p>
        <p className="text-gray-700 leading-relaxed break-words">
          {member.description}
        </p>
      </div>
    </div>
  </div>
);

export default EquityCampaignSections;
