'use client';
import FeaturedCampaigns from './components/campaigns/FeaturedCampaigns';
import Hero from './components/Hero';
import React, { useState } from 'react';
import PartnersCarousel from './molecules/PartnersCarousel';
import BrandIdentity from './molecules/BrandIdentity';
import InvestmentContracts from './investment-contracts/page';
import Navigation, { navItems } from './components/home-navigation/Navigation';
import { cn } from './lib/utils';

const HomePage = () => {
  const [showAll, setShowAll] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const renderSection = (id: string) =>
    !showAll && id !== activeSection ? null :
    ({
      hero: <Hero />,
      campaigns: <FeaturedCampaigns />,
      contracts: <InvestmentContracts />,
      brand: <BrandIdentity />,
      partners: <PartnersCarousel />,
    } as any)[id];

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        showAll={showAll}
        activeSection={activeSection}
        onToggleShowAll={() => setShowAll(!showAll)}
        onSectionChange={setActiveSection}
      />

      <main className="w-full">
        {navItems.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className={cn(
              'scroll-mt-16 transition-opacity duration-300',
              !showAll && item.id !== activeSection && 'hidden'
            )}
          >
            {renderSection(item.id)}
          </div>
        ))}
      </main>
    </div>
  );
};

export default HomePage;
