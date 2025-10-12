'use client';
import React from 'react';
import MarketingMediaCarousel from './MarketingMediaCarousel';

const InvestorPitchSection = () => {
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 py-4 lg:px-0 lg:py-0">
        <div className="text-center mb-2">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            See What You Could Be a Part Of
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover how communities in Ghana are transforming ideas into
            reality through the power of collective funding and shared dreams.
          </p>
        </div>

        <MarketingMediaCarousel />
      </div>
    </div>
  );
};

export default InvestorPitchSection;