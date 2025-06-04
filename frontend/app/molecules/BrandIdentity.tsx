import React from 'react';
import { BrickWall, Sparkles, UserPlus, Zap, Handshake } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import Link from 'next/link';

const BrandIdentity = () => {
  const stats = [
    {
      label: 'Success Rate with AI recs',
      value: '93%',
      icon: '📈',
      description: 'Across all campaign types',
    },
    {
      label: 'Campaign Types',
      value: '3',
      icon: '🎯',
      description: 'Donation, Rewards & Equity',
    },
    {
      label: 'Global Reach',
      value: '195',
      icon: '🌍',
      description: 'Countries supported',
    },
    {
      label: 'Total Raised',
      value: '$2.5B+',
      icon: '💰',
      description: 'All funding combined',
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powering Every Type of Crowdfunding
          </h2>
          <p className="text-gray-600">
            Trusted platform for donations, rewards, and equity campaigns
            worldwide
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-900 font-medium">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandIdentity;
