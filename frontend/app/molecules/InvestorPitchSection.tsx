'use client';
import React from 'react';
import MarketingMediaCarousel from './MarketingMediaCarousel';

const InvestorPitchSection = () => {
  return (
    <div className="sm:px-2">
      <div className="text-center mb-3 px-2">
        <h2 className="text-3xl font-bold mb-4">
          From tomorrow’s unicorns to local coffee shops
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Invest to bring founders’ dreams to life, strengthen local
          communities, build a portfolio of long-term angel investments, or all
          of the above.
        </p>
      </div>
      <MarketingMediaCarousel />
    </div>
  );
};

export default InvestorPitchSection;
