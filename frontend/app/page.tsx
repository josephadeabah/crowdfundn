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

  const renderSection = (sectionId: string) => {
    if (!showAll && sectionId !== activeSection) return null;

    switch (sectionId) {
      case 'hero':
        return <Hero />;
      case 'campaigns':
        return <FeaturedCampaigns />;
      case 'contracts':
        return <InvestmentContracts />;
      case 'brand':
        return <BrandIdentity />;
      case 'partners':
        return <PartnersCarousel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation at the top */}
      <Navigation
        showAll={showAll}
        activeSection={activeSection}
        onToggleShowAll={() => setShowAll(!showAll)}
        onSectionChange={setActiveSection}
      />

      {/* Main content - full width without sidebar constraints */}
      <main className="w-full">
        {/* Always render all sections but control visibility */}
        {navItems.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className={cn(
              'scroll-mt-16', // Adjusted for horizontal nav height
              'transition-opacity duration-300',
              // Hide sections that shouldn't be visible
              !showAll && item.id !== activeSection && 'hidden',
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
