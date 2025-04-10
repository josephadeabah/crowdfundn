import React from 'react';
import { Building, Gift, Heart, Rocket } from 'lucide-react';

const FundingTypes = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Flexible Funding Options</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the funding model that works best for your project and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
            <Gift className="h-7 w-7 text-fundify-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3">Reward-Based</h3>
          <p className="text-gray-600 mb-4">
            Offer tangible rewards or experiences to backers based on their
            contribution level.
          </p>
          <div className="text-sm text-fundify-primary font-medium">
            Ideal for: Products, Creative Projects, Innovations
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-7 w-7 text-fundify-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3">Donation-Based</h3>
          <p className="text-gray-600 mb-4">
            Collect donations for charitable causes, community projects, or
            personal needs.
          </p>
          <div className="text-sm text-fundify-primary font-medium">
            Ideal for: Nonprofits, Community Projects, Personal Causes
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="bg-fundify-muted w-14 h-14 rounded-full flex items-center justify-center mb-4">
            <Building className="h-7 w-7 text-fundify-primary" />
          </div>
          <h3 className="text-xl font-bold mb-3 relative">
            Equity-Based
            <span className="ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium align-middle">
              coming soon
            </span>
          </h3>
          <p className="text-gray-600 mb-4">
            Offer equity shares in your business to investors who believe in
            your vision.
          </p>
          <div className="text-sm text-fundify-primary font-medium">
            Ideal for: Startups, Business Expansion, Real Estate
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingTypes;
