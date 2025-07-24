'use client';

import React from 'react';
import { TrendingUp, Globe, Building2, Users } from 'lucide-react';

const features = [
  {
    title: 'Diversify Your Portfolio',
    description:
      'Invest in thoroughly vetted, high-potential startups across Africa.',
    icon: TrendingUp,
  },
  {
    title: 'Support High-Growth Sectors',
    description:
      'Back ventures in tech, clean energy, health, agri-finance, and more.',
    icon: Globe,
  },
  {
    title: 'Gain Equity from the Ground Up',
    description: 'Secure ownership in impactful businesses at early stages.',
    icon: Building2,
  },
  {
    title: 'Be Part of Africa’s Future',
    description: 'Fuel innovation and shape communities across the continent.',
    icon: Users,
  },
];

const InvestorPitchSection: React.FC = () => {
  return (
    <div className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Invest in Africa’s Future, One Visionary Startup at a Time
          </h2>
          <p className="text-lg text-gray-600">
            BantuHive connects forward-thinking investors with Africa’s most
            promising startups and community-driven ventures. Whether you're an
            individual or an institution, discover opportunities that let you
            invest with purpose and earn with impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-5">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl font-semibold text-gray-800 mb-6">
            Join BantuHive today — invest in what’s next.
          </p>
          <a
            href="/invest"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-900 transition"
          >
            Start Investing. Shape the Future.
          </a>
        </div>
      </div>
    </div>
  );
};

export default InvestorPitchSection;
