// app/info/upgrade/page.tsx
import React from 'react';
import PricingHeader from '@/app/info/upgrade/PricingHeader';
import PricingSection from '@/app/info/upgrade/PricingSection';
import ComparisonTable from '@/app/info/upgrade/ComparisonTable';
import FAQ from '@/app/info/upgrade/FAQ';
import Testimonials from '@/app/info/upgrade/Testimonials';
import CTASection from '@/app/info/upgrade/CTASection';
import SubscriptionStatus from '@/app/components/premium/SubscriptionStatus';

const UpgradePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow">
        <div className="py-16 md:py-24">
          <PricingHeader />
        </div>

        {/* Show subscription status if user is premium */}
        <div className="container mx-auto px-4 mb-8 max-w-6xl">
          <SubscriptionStatus />
        </div>

        <div className="py-12">
          <PricingSection />
        </div>

        <div>
          <Testimonials />
        </div>

        <div>
          <ComparisonTable />
        </div>

        <div>
          <FAQ />
        </div>

        <div>
          <CTASection />
        </div>
      </main>
    </div>
  );
};

export default UpgradePage;