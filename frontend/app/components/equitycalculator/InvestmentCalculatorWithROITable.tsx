import { useState } from 'react';

interface InvestmentCalculatorProps {
  sharePrice: number;
  preMoneyValuation: number;
  equityOffered: number;
  futureValuations: number[];
}

export default function InvestmentCalculatorColorfulTable({
  sharePrice,
  preMoneyValuation,
  equityOffered,
  futureValuations,
}: InvestmentCalculatorProps) {
  const [investment, setInvestment] = useState<number>(0);

  const sharesBought = investment / sharePrice;
  const totalSharesBeforeFunding = preMoneyValuation / sharePrice;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold text-center">🚀 Dream ROI Table</h2>

      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Investment Amount ($)
        </label>
        <input
          type="number"
          className="w-full p-3 border rounded-xl"
          placeholder="Enter amount"
          value={investment}
          onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
        />
      </div>

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
                  <td className="p-2">£{futureSharePrice.toFixed(4)}</td>
                  <td className="p-2">£{potentialFutureValue.toFixed(2)}</td>
                  <td className="p-2">{roiMultiple.toFixed(2)}x</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
