'use client';

import FeaturedCampaigns from './components/campaigns/FeaturedCampaigns';
import Hero from './components/Hero';
import React, { useEffect, useState } from 'react';
import PartnersCarousel from './molecules/PartnersCarousel';
import BrandIdentity from './molecules/BrandIdentity';
import InvestmentContracts from './investment-contracts/page';
import { usePiwikPro } from '@piwikpro/next-piwik-pro';
import Navigation from './components/home-navigation/Navigation';

const HomePage = () => {
 const [showAll, setShowAll] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Navigation showAll={showAll} onToggleShowAll={() => setShowAll(!showAll)} />

          <main className="flex-1 space-y-12 lg:space-y-16">
            <div id="hero" className={showAll ? '' : 'min-h-[600px]'}>
              <Hero />
            </div>

            {showAll && (
              <>
                <div id="campaigns" className="scroll-mt-20">
                  <FeaturedCampaigns />
                </div>

                <div id="contracts" className="scroll-mt-20">
                  <InvestmentContracts />
                </div>

                <div id="brand" className="scroll-mt-20">
                  <BrandIdentity />
                </div>

                <div id="partners" className="scroll-mt-20">
                  <PartnersCarousel />
                </div>
              </>
            )}

            {!showAll && (
              <div className="text-center py-12 text-gray-500">
                <p>Use the navigation menu to explore other divs or click "View All divs"</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
