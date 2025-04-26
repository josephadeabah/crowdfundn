import React from 'react';

import InvestmentCalculatorColorfulTable from '@/app/components/equitycalculator/InvestmentCalculatorWithROITable';

export default function InvestmentCalculatorPage() {
  const sharePrice = 0.0465; // Example share price
  const preMoneyValuation = 5_000_000; // Example pre-money valuation
  const equityOffered = 3.58; // Example equity offered in percentage
  const futureValuations = [15, 30, 50, 100]; // Example future valuations in million pounds

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Investment Calculator</h1>
      <InvestmentCalculatorColorfulTable
        sharePrice={sharePrice}
        preMoneyValuation={preMoneyValuation}
        equityOffered={equityOffered}
        futureValuations={futureValuations}
      />
    </div>
  );
}
