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

  const CONTRACT_TERM = `The contract term for this investment opportunity will depend on the structure agreed between the company and investors.\n\nPlease note: BantuHive does not provide default legal documents. Companies should work with their legal advisors to ensure all agreements meet regulatory standards.\n\n<a href="/investment-contracts" target="_blank" class="text-blue-500 hover:underline">Learn more about investment contracts in Ghana</a>`;

  return (
    <div className="space-y-8">
      {/* Investment Details */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl mr-4">
            <FaChartLine className="text-2xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Investment Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={<FaMoneyBillWave className="text-green-600" />}
            label="Valuation"
            value={`${fundraiserCurrency}${parseFloat(
              String(campaign?.valuation || '0'),
            ).toLocaleString()}`}
            gradient="from-green-50 to-green-100"
          />

          <MetricCard
            icon={<FaPercentage className="text-blue-600" />}
            label="Equity Offered"
            value={`${campaign?.equity_offered}%`}
            gradient="from-blue-50 to-blue-100"
          />

          <InvestmentRangeCard
            currency={fundraiserCurrency || ''}
            min={campaign?.minimum_investment || '0'}
            max={campaign?.maximum_investment || '0'}
          />

          <MetricCard
            icon={<FaShareAlt className="text-orange-600" />}
            label="Shares Issued"
            value={parseFloat(
              campaign?.shares_issued?.toString() || '0',
            ).toLocaleString()}
            gradient="from-orange-50 to-orange-100"
          />

          <MetricCard
            icon={<FaUsers className="text-purple-600" />}
            label="Selling Shares"
            value={parseFloat(
              campaign?.shares_available?.toString() || '0',
            ).toLocaleString()}
            gradient="from-purple-50 to-purple-100"
          />

          <MetricCard
            icon={<FaShareAlt className="text-indigo-600" />}
            label="Total Shares"
            value={parseFloat(
              campaign?.total_equity_shares?.toString() || '0',
            ).toLocaleString()}
            gradient="from-indigo-50 to-indigo-100"
          />
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mr-4">
            <FaBuilding className="text-2xl text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Company Information</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InfoField label="Company Name" value={campaign?.company_info?.name} />
            <InfoField label="Headquarters" value={campaign?.company_info?.headquarters} />
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
                <label className="font-semibold text-gray-900">Contract Term</label>
                <InfoTooltip id="contract-term-tooltip" content={CONTRACT_TERM} />
              </div>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                {deslugify(campaign?.company_info?.contract_term || 'Not specified')}
              </p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-900 block mb-3">Description</label>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
                {campaign?.company_info?.description || 'No description provided.'}
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
            <h2 className="text-3xl font-bold text-gray-900">Contract Documents</h2>
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

      {/* Team Members */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl mr-4">
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
              <p className="text-gray-600 font-medium">No team members available</p>
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
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, gradient }) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <div className={`p-3 rounded-xl ${gradient} mr-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-700">{label}</h3>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

interface InvestmentRangeCardProps {
  currency: string;
  min: string | number;
  max: string | number;
}

const InvestmentRangeCard: React.FC<InvestmentRangeCardProps> = ({ currency, min, max }) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl mr-3 group-hover:scale-110 transition-transform">
        <FaHandHoldingUsd className="text-amber-600" />
      </div>
      <h3 className="font-semibold text-gray-700">Investment Range</h3>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Min:</span>
        <span className="font-semibold text-gray-900">
          {currency}{parseFloat(String(min)).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Max:</span>
        <span className="font-semibold text-gray-900">
          {currency}{parseFloat(String(max)).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

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
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 rounded-xl p-4 hover:bg-blue-100"
      >
        <FaLink className="text-sm" />
        <span className="truncate">{value}</span>
        <FaExternalLinkAlt className="text-xs ml-auto" />
      </a>
    ) : (
      <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{value || 'Not specified'}</p>
    )}
  </div>
);

interface DocumentCardProps {
  name: string;
  size: string;
  type: string;
  url: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ name, size, type, url }) => (
  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 transition-transform">
        <FaFileContract className="text-2xl text-orange-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{size} • {type}</p>
      </div>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 group-hover:shadow-lg"
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
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 group">
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <Avatar
          name={member.name}
          size="xl"
          imageUrl={member.avatar_url}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-purple-600 font-semibold mb-3">{member.title}</p>
        <p className="text-gray-700 leading-relaxed">{member.description}</p>
      </div>
    </div>
  </div>
);

export default EquityCampaignSections;