import React from 'react';

import InvestmentCalculatorColorfulTable from '@/app/components/equitycalculator/InvestmentCalculatorWithROITable';

export default function CrowdfundingPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Calculate your potential returns on investment.
      </h1>
      <InvestmentCalculatorColorfulTable
        futureValuations={[10, 20, 30, 50, 100]}
      />
    </main>
  );
}
