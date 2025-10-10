'use client';

import FeaturedCampaigns from './components/campaigns/FeaturedCampaigns';
import Hero from './components/Hero';
import React, { useEffect } from 'react';
import PartnersCarousel from './molecules/PartnersCarousel';
import BrandIdentity from './molecules/BrandIdentity';
import InvestmentContracts from './investment-contracts/page';
import { usePiwikPro } from '@piwikpro/next-piwik-pro';

const HomePage = () => {
  const { PageViews } = usePiwikPro(); // ✅ Initialize PageViews
  useEffect(() => {
    // Track page view
    PageViews.trackPageView('Homepage');
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            // Once the animation is triggered, we don't need to observe this element anymore
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Select all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    // Cleanup the observer
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="w-full">
        <div className="w-full">
          <Hero />
        </div>
        <div className="w-full bg-white">
          <FeaturedCampaigns />
        </div>
        <div className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <InvestmentContracts />
          </div>
        </div>
        <div className="">
          <BrandIdentity />
        </div>
        <div className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PartnersCarousel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
