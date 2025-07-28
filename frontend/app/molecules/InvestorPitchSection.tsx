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
    <div className="py-20 text-white" style={{backgroundColor: '#FFB400'}}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-5 pl-5">
              <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-green-100 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorPitchSection;
