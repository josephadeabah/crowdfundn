'use client';
import { useState } from 'react';

interface InvestmentCalculatorProps {
  futureValuations: number[];
}

export default function InvestmentCalculatorColorfulTable({
  futureValuations,
}: InvestmentCalculatorProps) {
  const [investment, setInvestment] = useState<number>(0);
  const [preMoneyValuation, setPreMoneyValuation] = useState<number>(5_000_000); // $5M
  const [equityOffered, setEquityOffered] = useState<number>(3.58); // 3.58%
  const [manualSharePrice, setManualSharePrice] = useState<boolean>(false);
  const [customSharePrice, setCustomSharePrice] = useState<number>(0.0465); // default

  // Calculate share price
  const calculatedSharePrice =
    (preMoneyValuation * (equityOffered / 100)) /
    (preMoneyValuation / customSharePrice);
  const sharePrice = manualSharePrice ? customSharePrice : calculatedSharePrice;

  const sharesBought = investment / sharePrice;
  const totalSharesBeforeFunding = preMoneyValuation / sharePrice;

  // Pick a "default dream" future valuation for Live ROI Preview (e.g., $1M)
  const dreamValuation = 1; // 1 million dollars
  const futureSharePrice =
    (dreamValuation * 1_000_000) / totalSharesBeforeFunding;
  const potentialFutureValue = sharesBought * futureSharePrice;
  const roiMultiple = investment > 0 ? potentialFutureValue / investment : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      {/* 🎯 Live ROI Preview */}
      {investment > 0 && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-xl text-center text-lg font-semibold shadow-sm">
          ✨ If the company reaches <strong>${dreamValuation}M</strong>{' '}
          valuation, your ${investment} investment could be worth{' '}
          <strong>${potentialFutureValue.toFixed(2)}</strong>(
          <strong>{roiMultiple.toFixed(2)}x</strong> return)!
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">🚀 Dream ROI Table</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="space-y-5">
          {/* Investment Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Investment Amount ($)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              placeholder="Enter investment amount"
              value={investment}
              onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Pre-Money Valuation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Pre-Money Valuation ($M)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              placeholder="Enter pre-money valuation"
              value={preMoneyValuation / 1_000_000}
              onChange={(e) =>
                setPreMoneyValuation(
                  (parseFloat(e.target.value) || 0) * 1_000_000,
                )
              }
            />
          </div>

          {/* Equity Offered */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Equity Offered (%)
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-xl"
              placeholder="Enter equity offered"
              value={equityOffered}
              onChange={(e) =>
                setEquityOffered(parseFloat(e.target.value) || 0)
              }
            />
          </div>

          {/* Manual Share Price Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={manualSharePrice}
              onChange={(e) => setManualSharePrice(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="text-sm font-medium">
              Use Manual Share Price
            </label>
          </div>

          {/* Custom Share Price Input */}
          {manualSharePrice && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Manual Share Price ($)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-xl"
                placeholder="Enter share price"
                value={customSharePrice}
                onChange={(e) =>
                  setCustomSharePrice(parseFloat(e.target.value) || 0)
                }
              />
            </div>
          )}
        </div>

        {/* Right Side: Live Summary */}
        <div className="p-4 bg-gray-100 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold">📈 Investment Snapshot</h3>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Share Price:</span>
              <span>${sharePrice.toFixed(4)}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Shares Before Funding:</span>
              <span>
                {Math.round(totalSharesBeforeFunding).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Your Shares Owned:</span>
              <span>{Math.round(sharesBought).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-2 font-semibold">Future Valuation ($M)</th>
              <th className="p-2 font-semibold">Future Share Price ($)</th>
              <th className="p-2 font-semibold">Your Investment Value ($)</th>
              <th className="p-2 font-semibold">ROI Multiple</th>
            </tr>
          </thead>
          <tbody>
            {futureValuations.map((fv) => {
              const futureSharePrice =
                (fv * 1_000_000) / totalSharesBeforeFunding;
              const potentialFutureValue = sharesBought * futureSharePrice;
              const roiMultiple =
                investment > 0 ? potentialFutureValue / investment : 0;

              let rowClass = '';
              if (roiMultiple > 5) {
                rowClass = 'bg-yellow-100';
              } else if (roiMultiple > 3) {
                rowClass = 'bg-green-100';
              }

              return (
                <tr key={fv} className={`border-t ${rowClass}`}>
                  <td className="p-2">{fv}M</td>
                  <td className="p-2">${futureSharePrice.toFixed(4)}</td>
                  <td className="p-2">${potentialFutureValue.toFixed(2)}</td>
                  <td className="p-2">{roiMultiple.toFixed(2)}x</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 p-4 bg-red-100 text-red-800 text-sm rounded-xl shadow-sm">
          ⚠️ <strong>Disclaimer:</strong> This is a simplified ROI calculator
          for educational and illustration purposes only. Actual results may
          vary depending on future fundraising, dilution, company performance,
          taxes, and other factors. Investing in startups involves significant
          risks, including the potential loss of your investment.
        </div>
      </div>
    </div>
  );
}
