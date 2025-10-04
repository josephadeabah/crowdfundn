'use client';

import FeaturedCampaigns from './components/campaigns/FeaturedCampaigns';
import Hero from './components/Hero';
import React, { useEffect } from 'react';
import PartnersCarousel from './molecules/PartnersCarousel';
import BlogPosts from './components/blogs/BlogPosts';
import BrandIdentity from './molecules/BrandIdentity';
import InvestmentContracts from './investment-contracts/page';
import { useCookieConsent } from '@/app/context/cookie/CookieConsentContext';
import { CookieBanner } from '@/app/components/cookiemanager/CookieBanner';
import { CookieSettings } from '@/app/components/cookiemanager/CookieSettings';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';

const HomePage = () => {
  const { openSettings } = useCookieConsent();

  useEffect(() => {
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

      {/* Cookie Components */}
      <CookieBanner />
      <CookieSettings />

      {/* Floating Cookie Settings Button */}
      <Button
        onClick={openSettings}
        className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
        size="icon"
        aria-label="Cookie Settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default HomePage;
