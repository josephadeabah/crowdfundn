"use client";
import React from "react";
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
} from "react-icons/fa";
import Avatar from "@/app/components/avatar/Avatar";
import { SingleCampaignResponseDataType } from "../types/campaigns.types";
import InfoTooltip from "../components/tooltip/tooltip";
import { deslugify } from "../utils/helpers/categories";

interface EquityCampaignSectionsProps {
  campaign: SingleCampaignResponseDataType | null;
}

const EquityCampaignSections: React.FC<EquityCampaignSectionsProps> = ({
  campaign,
}) => {
  const fundraiserCurrency =
    campaign?.fundraiser?.currency_symbol ||
    campaign?.fundraiser?.currency?.toUpperCase();

  const contractDocuments =
    campaign?.investor_documents?.filter(
      (doc) => doc.document_type === "contract"
    ) || [];

  const CONTRACT_TERM = `The contract term for this investment opportunity will depend on the structure agreed between the company and investors.\n\n
Please note: BantuHive does not provide default legal documents. Companies should work with their legal advisors to ensure all agreements meet regulatory standards.\n\n
<a href="/investment-contracts" target="_blank" class="text-blue-500 hover:underline">Learn more about investment contracts in Ghana</a>`;

  return (
    <div className="mb-16 space-y-12">
      {/* Investment Details */}
      <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <FaChartLine className="mr-3 text-green-600" />
          Investment Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Valuation */}
          <Card
            icon={<FaMoneyBillWave className="text-green-500" />}
            label="Valuation"
            value={`${fundraiserCurrency}${parseFloat(
              String(campaign?.valuation || "0")
            ).toLocaleString()}`}
          />

          {/* Equity Offered */}
          <Card
            icon={<FaPercentage className="text-blue-500" />}
            label="Equity Offered"
            value={`${campaign?.equity_offered}%`}
          />

          {/* Investment Range */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center mb-3">
              <span className="p-2 bg-purple-100 rounded-full mr-3">
                <FaHandHoldingUsd className="text-purple-500" />
              </span>
              <h3 className="font-medium text-gray-700">Investment Range</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Min: {fundraiserCurrency}
              {parseFloat(
                String(campaign?.minimum_investment || "0")
              ).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Max: {fundraiserCurrency}
              {parseFloat(
                String(campaign?.maximum_investment || "0")
              ).toLocaleString()}
            </p>
          </div>

          {/* Shares Issued */}
          <Card
            icon={<FaShareAlt className="text-orange-500" />}
            label="Shares Issued"
            value={parseFloat(
              campaign?.shares_issued?.toString() || "0"
            ).toLocaleString()}
          />

          {/* Selling Shares */}
          <Card
            icon={<FaUsers className="text-yellow-500" />}
            label="Selling Shares"
            value={parseFloat(
              campaign?.shares_available?.toString() || "0"
            ).toLocaleString()}
          />

          {/* Total Shares */}
          <Card
            icon={<FaShareAlt className="text-indigo-500" />}
            label="Total Shares"
            value={parseFloat(
              campaign?.total_equity_shares?.toString() || "0"
            ).toLocaleString()}
          />
        </div>
      </section>

      {/* Company Information */}
      <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <FaBuilding className="mr-3 text-blue-600" />
          Company Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <InfoItem label="Name" value={campaign?.company_info?.name || "N/A"} />
          <InfoItem
            label="Headquarters"
            value={campaign?.company_info?.headquarters || "N/A"}
          />
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              Contract Term
              <InfoTooltip id="contract-term-tooltip" content={CONTRACT_TERM} />
            </h3>
            <p className="text-gray-700 mt-1">
              {deslugify(campaign?.company_info?.contract_term || "N/A")}
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-800">Description</h3>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {campaign?.company_info?.description ||
                "No description provided."}
            </p>
          </div>
          {campaign?.company_info?.website && (
            <InfoLink
              label="Website"
              href={campaign.company_info.website}
              icon={<FaLink className="mr-1" />}
            />
          )}
        </div>
      </section>

      {/* Investment Documents */}
      {contractDocuments.length > 0 && (
        <section className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <FaFileContract className="mr-3 text-orange-500" />
            Contract Documents
          </h2>
          <p className="text-gray-600 mb-6">
            Review the legal documents for this investment opportunity:
          </p>
          <div className="space-y-4">
            {contractDocuments.map((document) =>
              document.files.map((file) => (
                <div
                  key={file.filename}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <FaFileContract className="text-orange-500" />
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
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                  >
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Team Members */}
      <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <FaUsers className="mr-3 text-purple-600" />
          Team Members
        </h2>
        {campaign?.team_members?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaign.team_members.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-4 bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <Avatar
                  name={member.name}
                  size="xl"
                  imageUrl={member.avatar_url}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {member.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No team members available.</p>
        )}
      </section>
    </div>
  );
};

/* ----------- Small Reusable Components ----------- */
const Card = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center mb-3">
      <span className="p-2 bg-white rounded-full shadow-sm mr-3">{icon}</span>
      <h3 className="font-medium text-gray-700">{label}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h3 className="font-semibold text-gray-800">{label}</h3>
    <p className="text-gray-700 mt-1">{value}</p>
  </div>
);

const InfoLink = ({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <h3 className="font-semibold text-gray-800">{label}</h3>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
    >
      {icon}
      {href}
    </a>
  </div>
);

export default EquityCampaignSections;
