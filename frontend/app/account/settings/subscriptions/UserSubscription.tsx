// app/info/upgrade/page.tsx
import React from 'react';
import PricingSection from '@/app/info/upgrade/PricingSection';
import ComparisonTable from '@/app/info/upgrade/ComparisonTable';
import SubscriptionStatus from '@/app/components/premium/SubscriptionStatus';

const UserSubscriptions = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow">
        {/* Show subscription status if user is premium */}
        <div className="container mx-auto px-4 mb-8 max-w-6xl">
          <SubscriptionStatus />
        </div>

        <div className="py-12">
          <PricingSection />
        </div>

        <div>
          <ComparisonTable />
        </div>
      </main>
    </div>
  );
};

export default UserSubscriptions;
