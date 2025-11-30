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
          <section
            key={item.id}
            id={item.id}
            className={cn(
              'scroll-mt-16', // Adjusted for horizontal nav height
              'transition-opacity duration-300',
              // Hide sections that shouldn't be visible
              !showAll && item.id !== activeSection && 'hidden'
            )}
          >
            {renderSection(item.id)}
          </section>
        ))}

        {/* Empty state when not showing all sections */}
        {!showAll && activeSection !== 'hero' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <p className="text-lg">Use the navigation menu above to explore other sections</p>
              <p className="text-sm mt-2">or click "View All Sections" to see everything at once</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;