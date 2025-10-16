'use client';
import React from 'react';

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
    </div>
  );
};

export default EquityOffering;
