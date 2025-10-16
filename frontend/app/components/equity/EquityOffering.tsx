'use client';
import React from 'react';
import FileUpload from '../campaign/FileUpload';

interface EquityOfferingProps {
  // Equity offering fields
  minimumTarget?: string;
  setMinimumTarget?: (value: string) => void;
  sharesOffered?: string;
  setSharesOffered?: (value: string) => void;
  stockType?: string;
  setStockType?: (value: string) => void;
  fundingRound?: string;
  setFundingRound?: (value: string) => void;
  secFilingUrl?: string;
  setSecFilingUrl?: (value: string) => void;
  offeringCircularUrl?: string;
  setOfferingCircularUrl?: (value: string) => void;
  offeringMemorandum?: string;
  setOfferingMemorandum?: (value: string) => void;
  offeringMemorandumFile?: File | null;
  setOfferingMemorandumFile?: (value: File | null) => void;
  stockTypes?: Array<{ value: string; label: string }>;
  fundingRounds?: Array<{ value: string; label: string }>;
}

const EquityOffering = ({
  minimumTarget = '',
  setMinimumTarget = () => {},
  stockType = '',
  setStockType = () => {},
  fundingRound = '',
  setFundingRound = () => {},
  secFilingUrl = '',
  setSecFilingUrl = () => {},
  offeringCircularUrl = '',
  setOfferingCircularUrl = () => {},
  offeringMemorandum = '',
  setOfferingMemorandum = () => {},
  offeringMemorandumFile = null,
  setOfferingMemorandumFile = () => {},
  stockTypes = [],
  fundingRounds = [],
}: EquityOfferingProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Equity Offering Structure
      </h3>

      {/* Minimum Target */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Funding Target
        </label>
        <input
          type="number"
          value={minimumTarget}
          onChange={(e) => setMinimumTarget(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Minimum amount needed to proceed"
        />
      </div>

      {/* Stock Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock Type
        </label>
        <select
          value={stockType}
          onChange={(e) => setStockType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Stock Type</option>
          {stockTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Round */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Round
        </label>
        <select
          value={fundingRound}
          onChange={(e) => setFundingRound(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Funding Round</option>
          {fundingRounds.map((round) => (
            <option key={round.value} value={round.value}>
              {round.label}
            </option>
          ))}
        </select>
      </div>

      {/* SEC Filing URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SEC Filing URL
        </label>
        <input
          type="url"
          value={secFilingUrl}
          onChange={(e) => setSecFilingUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://sec.gov/..."
        />
      </div>

      {/* Offering Circular URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offering Circular URL
        </label>
        <input
          type="url"
          value={offeringCircularUrl}
          onChange={(e) => setOfferingCircularUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/offering-circular"
        />
      </div>

      {/* Offering Memorandum - File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offering Memorandum (File Upload)
        </label>
        <FileUpload
          file={offeringMemorandumFile}
          onFileChange={setOfferingMemorandumFile}
          accept=".pdf,.doc,.docx"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload the offering memorandum document (PDF, DOC, DOCX)
        </p>
      </div>

      {/* Offering Memorandum - Text Field (alternative) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offering Memorandum (Text Description)
        </label>
        <textarea
          value={offeringMemorandum}
          onChange={(e) => setOfferingMemorandum(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Or provide a text description of the offering memorandum..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Provide either a file upload OR a text description, not both
        </p>
      </div>
    </div>
  );
};

export default EquityOffering;
