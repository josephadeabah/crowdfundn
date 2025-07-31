import React from 'react';
import { Building, Gift, Heart, Rocket } from 'lucide-react';
import MarketingMediaCarousel from './MarketingMediaCarousel';

const FundingTypes = () => {
  return (
    <div className="px-2 sm:px-3">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          From tomorrow’s unicorns to local coffee shops
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Put your community on your cap table, no matter what your industry,
          stage, or goals.
        </p>
      </div>
      <MarketingMediaCarousel />
    </div>
  );
};

export default FundingTypes;
