import React from 'react';

import InvestmentCalculatorColorfulTable from '@/app/components/equitycalculator/InvestmentCalculatorWithROITable';

export default function CrowdfundingPage() {
  return (
    <main className="p-8">
      <InvestmentCalculatorColorfulTable
        futureValuations={[10, 20, 30, 50, 100, 200, 500]}
      />
    </main>
  );
}
