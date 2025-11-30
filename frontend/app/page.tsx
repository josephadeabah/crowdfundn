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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Navigation 
            showAll={showAll} 
            activeSection={activeSection}
            onToggleShowAll={() => setShowAll(!showAll)} 
            onSectionChange={setActiveSection}
          />

          <main className="flex-1 space-y-12 lg:space-y-16">
            {/* Always render all sections but control visibility */}
            {navItems.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className={cn(
                  'scroll-mt-20 transition-all duration-300',
                  // Prevent overflow for full-screen sections
                  item.id === 'hero' && 'min-h-[80vh] flex items-center',
                  // Hide sections that shouldn't be visible
                  !showAll && item.id !== activeSection && 'hidden'
                )}
                style={{
                  // Ensure sections don't cause horizontal overflow
                  maxWidth: '100vw',
                  boxSizing: 'border-box'
                }}
              >
                {renderSection(item.id)}
              </div>
            ))}

            {!showAll && activeSection !== 'hero' && (
              <div className="text-center py-12 text-gray-500">
                <p>Use the navigation menu to explore other sections or click "View All Sections"</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;