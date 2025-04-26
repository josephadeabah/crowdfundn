'use client';
import { useState } from 'react';

interface InvestmentCalculatorProps {
  futureValuations: number[];
}

export default function InvestmentCalculatorColorfulTable({
  futureValuations, // Default valuation scenarios
}: InvestmentCalculatorProps) {
  // Input states
  const [investment, setInvestment] = useState<number>(1000); // $1,000 default
  const [preMoneyValuation, setPreMoneyValuation] = useState<number>(5_000_000); // $5M
  const [equityOffered, setEquityOffered] = useState<number>(3.58); // 3.58%
  const [totalSharesExisting, setTotalSharesExisting] =
    useState<number>(10_000_000); // 10M shares
  const [dilutionFactor, setDilutionFactor] = useState<number>(0.7); // 30% future dilution

  // Derived calculations
  const postMoneyValuation =
    preMoneyValuation + preMoneyValuation * (equityOffered / 100);
  const sharePrice =
    ((preMoneyValuation * (equityOffered / 100)) /
      (postMoneyValuation - preMoneyValuation)) *
    totalSharesExisting;
  const sharesPurchased = investment / sharePrice;
  const investorOwnership =
    sharesPurchased / (totalSharesExisting + sharesPurchased);

  // ROI calculation with dilution
  const calculateROI = (futureValuation: number) => {
    const futureValue =
      futureValuation * 1_000_000 * investorOwnership * dilutionFactor;
    return {
      futureValue,
      roiMultiple: investment > 0 ? futureValue / investment : 0,
      futureSharePrice:
        (futureValuation * 1_000_000) /
        (totalSharesExisting * (1 + (1 - dilutionFactor))),
    };
  };

  // Current investment summary
  const currentSummary = {
    sharePrice,
    sharesPurchased,
    ownershipPercentage: investorOwnership * 100,
    postMoneyValuation,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Startup Investment Calculator
      </h1>

      {/* Live ROI Preview */}
      {investment > 0 && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-center text-lg font-semibold shadow-sm">
          ✨ At ${preMoneyValuation / 1_000_000}M valuation, your ${investment}{' '}
          buys{' '}
          <strong>
            {sharesPurchased.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{' '}
            shares
          </strong>{' '}
          (<strong>{currentSummary.ownershipPercentage.toFixed(2)}%</strong>{' '}
          ownership)
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Investment Amount ($)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={investment}
              onChange={(e) =>
                setInvestment(Math.max(0, parseFloat(e.target.value) || 0))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Pre-Money Valuation ($M)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={preMoneyValuation / 1_000_000}
              onChange={(e) =>
                setPreMoneyValuation(
                  (parseFloat(e.target.value) || 0) * 1_000_000,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Equity Offered (%)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={equityOffered}
              onChange={(e) =>
                setEquityOffered(
                  Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Existing Shares</label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={totalSharesExisting}
              onChange={(e) =>
                setTotalSharesExisting(
                  Math.max(1, parseFloat(e.target.value) || 1),
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Future Dilution (%)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              value={(1 - dilutionFactor) * 100}
              onChange={(e) =>
                setDilutionFactor(
                  1 -
                    Math.min(
                      100,
                      Math.max(0, parseFloat(e.target.value) || 0),
                    ) /
                      100,
                )
              }
            />
          </div>
        </div>

        {/* Current Investment Summary */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold">📊 Current Investment Terms</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Share Price:</span>
              <span>${currentSummary.sharePrice.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shares Purchased:</span>
              <span>
                {currentSummary.sharesPurchased.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ownership %:</span>
              <span>{currentSummary.ownershipPercentage.toFixed(4)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Post-Money Valuation:</span>
              <span>
                ${(currentSummary.postMoneyValuation / 1_000_000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Projections Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          📈 Potential Return Scenarios
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Future Valuation</th>
                <th className="p-3 text-left">Share Price</th>
                <th className="p-3 text-left">Your Stake Value</th>
                <th className="p-3 text-left">ROI Multiple</th>
              </tr>
            </thead>
            <tbody>
              {futureValuations.map((valuation) => {
                const { futureValue, roiMultiple, futureSharePrice } =
                  calculateROI(valuation);
                const rowClass =
                  roiMultiple > 10
                    ? 'bg-green-50'
                    : roiMultiple > 3
                      ? 'bg-blue-50'
                      : '';

                return (
                  <tr key={valuation} className={`border-t ${rowClass}`}>
                    <td className="p-3">${valuation}M</td>
                    <td className="p-3">${futureSharePrice.toFixed(4)}</td>
                    <td className="p-3">
                      $
                      {futureValue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-3 font-medium">
                      {roiMultiple.toFixed(2)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg">
        <p>
          <strong>⚠️ Important Disclaimer:</strong> This calculator provides
          illustrative projections only. Actual returns will vary based on:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Future funding rounds and dilution</li>
          <li>Liquidation preferences (typically 1-2x for investors)</li>
          <li>Company performance and exit scenarios</li>
          <li>Tax implications and fees</li>
        </ul>
        <p className="mt-2">
          Startup investing carries high risk of total loss. Consult a financial
          advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
