import React from 'react';

const PricingHeader = () => {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block">Technical & Marketing</span>
        <span className="block mt-2 bg-clip-text text-transparent bg-pricing-gradient">
          Support Plans
        </span>
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
        Choose the perfect support plan for your crowdfunding campaign. Get
        expert guidance, technical assistance, and marketing support to make
        your campaign a success.
      </p>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <span className="inline-flex rounded-full px-4 py-1 text-sm font-semibold bg-bantu-light-green text-bantu-dark-green">
          Billed monthly • Cancel anytime
        </span>
      </div>
    </div>
  );
};

export default PricingHeader;
