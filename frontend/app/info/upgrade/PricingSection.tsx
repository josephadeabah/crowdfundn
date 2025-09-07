// app/info/upgrade/PricingSection.tsx
import React from 'react';
import PricingCard from './PricingCard';
import { usePremiumContext } from '@/app/context/premium/PremiumContext';

const PricingSection = () => {
  const { plans, loading, error, subscription } = usePremiumContext();

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">
          Error loading plans: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription?.current_plan?.id === plan.id}
            popular={index === 1} // Make Growth plan popular
            gradient={index === 2} // Make Pro+ gradient
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;