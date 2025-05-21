import React from 'react';
import PricingHeader from '@/app/upgrade/PricingHeader';
import PricingSection from '@/app/upgrade/PricingSection';
import ComparisonTable from '@/app/upgrade/ComparisonTable';
import FAQ from '@/app/upgrade/FAQ';
import Testimonials from '@/app/upgrade/Testimonials';
import CTASection from '@/app/upgrade/CTASection';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-grow">
        <div className="py-16 md:py-24">
          <PricingHeader />
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

export default Index;
