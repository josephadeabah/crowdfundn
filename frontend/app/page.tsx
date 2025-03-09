'use client';

import React, { useEffect } from 'react';
import RewardsSection from './components/RewardsSection';
import FeaturedCampaigns from './components/FeaturedCampaigns';
import Hero from './components/Hero'


const HomePage = () => {
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
      { threshold: 0.1 }
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
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Platform Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Gamified Crowdfunding Experience
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Earn rewards while supporting innovative campaigns and making
              real-world impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Earn Rewards',
                description:
                  'Get exclusive rewards and tokens for backing successful campaigns',
                icon: '🏆',
              },
              {
                title: 'Level Up',
                description:
                  'Gain experience points and unlock new supporter tiers',
                icon: '⭐',
              },
              {
                title: 'Community Voting',
                description:
                  'Help decide which projects deserve spotlight features',
                icon: '🔍',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-all animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedCampaigns />
      <RewardsSection />

      {/* Stats section */}
      <section className="py-20 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '$2.7M+', label: 'Funds Raised' },
              { number: '10k+', label: 'Active Backers' },
              { number: '125+', label: 'Successful Campaigns' },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {stat.number}
                </span>
                <span className="text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
