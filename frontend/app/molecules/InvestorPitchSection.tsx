'use client';

import React from 'react';

const InvestorPitchSection: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-24 text-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Invest in Africa’s Future, One Visionary Startup at a Time
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-700">
          At <span className="font-semibold text-black">BantuHive</span>, we
          connect forward-thinking investors with Africa’s most promising
          startups and community-driven ventures. Whether you're an individual
          looking to co-own innovative businesses or an institutional investor
          seeking high-impact, early-stage opportunities, BantuHive makes it
          easy to discover, support, and grow the next generation of African
          success stories.
        </p>
        <ul className="text-left inline-block text-gray-700 space-y-2 mb-10">
          <li>
            🔹 <span className="font-medium">Diversify your portfolio</span>{' '}
            with vetted startups
          </li>
          <li>
            🔹 <span className="font-medium">Support high-growth sectors</span>{' '}
            across tech, green energy, health, and more
          </li>
          <li>
            🔹 <span className="font-medium">Gain equity</span> in impactful
            businesses from the ground up
          </li>
          <li>
            🔹{' '}
            <span className="font-medium">
              Be part of Africa’s transformation story
            </span>
          </li>
        </ul>
        <p className="text-xl font-semibold mb-6">
          Join BantuHive today — invest in what’s next.
        </p>
        <a
          href="/invest"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-900 transition"
        >
          Start Investing. Shape the Future.
        </a>
      </div>
    </section>
  );
};

export default InvestorPitchSection;
