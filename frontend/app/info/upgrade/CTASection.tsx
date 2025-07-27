import React from 'react';
import { Button } from '@/app/components/ui/button';

const CTASection = () => {
  return (
    <div className="bg-pricing-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Launch Your Crowdfunding Campaign?
          </h2>
          <p className="mb-8 text-white/80">
            Join thousands of successful creators who have funded their dreams
            with Bantu Hive's expert technical and marketing support.
          </p>
          <Button className="bg-white text-bantu-orange hover:bg-gray-100 px-8 py-6 text-lg">
            Start Your Campaign Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
