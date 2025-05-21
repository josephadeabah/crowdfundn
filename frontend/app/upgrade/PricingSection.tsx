import React from 'react';
import PricingCard from './PricingCard';

const PricingSection = () => {
  const starterFeatures = [
    'Email support with 1-day response time',
    'General guidance from our staff',
    'Marketing & Analytics Toolkit access',
    'Campaign setup assistance',
  ];

  const growthFeatures = [
    'Email & Google Hangout support',
    '5-hour response time',
    'Technical & Marketing Support experts',
    'Marketing & Analytics Toolkit access',
    'Campaign optimization strategies',
  ];

  const proFeatures = [
    'Email, Google Hangout & preferred channels',
    '30-minute response time',
    'Dedicated technical professionals',
    'Influencer marketing guidance',
    'Marketing & Analytics Toolkit access',
    'Custom campaign strategies',
    'Priority support',
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <PricingCard
          name="Starter"
          price="$15"
          description="Perfect for beginners looking to launch their first campaign."
          features={starterFeatures}
        />

        <PricingCard
          name="Growth"
          price="$30"
          description="Ideal for creators serious about campaign success."
          features={growthFeatures}
          popular={true}
        />

        <PricingCard
          name="Pro+"
          price="$75"
          description="For professional campaigns that demand the very best support."
          features={proFeatures}
          gradient={true}
        />
      </div>
    </div>
  );
};

export default PricingSection;
