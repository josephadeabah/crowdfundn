'use client';

import * as React from 'react';
import Avatar from '../components/avatar/Avatar';
import {
  FaHandHoldingHeart,
  FaBullhorn,
  FaUsers,
  FaMicrophone,
  FaLightbulb,
  FaHandsHelping,
  FaStar,
} from 'react-icons/fa';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/popover/Popover';
import { Button } from '../components/button/Button';

// SummaryCard Component
const SummaryCard: React.FC = () => {
  return (
    <div
      className="w-full bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400 p-6 rounded-lg"
      style={{ pointerEvents: 'auto', position: 'relative' }}
    >
      <div className="flex flex-col items-center md:items-start space-y-4">
        <h2
          className="text-green-600 dark:text-green-400 font-bold leading-tight text-center md:text-left"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Support, Empower, Thrive with Bantu Hive
        </h2>
        <div className="text-base text-gray-700 dark:text-gray-200 text-center md:text-left">
          Raise money when you need, fund, or support causes you care about.
          Reach donors, and make a difference.
        </div>
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard: React.FC = () => {
  // Mock data for Top Backers
  const topBackers = [
    { name: 'John Doe', amount: '$1,000' },
    { name: 'Jane Smith', amount: '$800' },
    { name: 'Alice Johnson', amount: '$600' },
    { name: 'Bob Brown', amount: '$500' },
    { name: 'Charlie Davis', amount: '$400' },
    { name: 'Eve White', amount: '$300' },
    { name: 'Frank Green', amount: '$200' },
    { name: 'Grace Black', amount: '$100' },
  ];

  // Mock data for Most Active Backers
  const mostActiveBackers = [
    { name: 'John Doe', contributions: 12 },
    { name: 'Jane Smith', contributions: 10 },
    { name: 'Alice Johnson', contributions: 8 },
    { name: 'Bob Brown', contributions: 7 },
    { name: 'Charlie Davis', contributions: 6 },
  ];

  // Mock data for Top Backers with Most Rewards
  const topBackersWithRewards = [
    { name: 'John Doe', rewards: 5 },
    { name: 'Jane Smith', rewards: 4 },
    { name: 'Alice Johnson', rewards: 3 },
    { name: 'Bob Brown', rewards: 2 },
    { name: 'Charlie Davis', rewards: 1 },
  ];

  // Mock data for Top Fundraisers with Best Campaign Graphics
  const topFundraisersGraphics = [
    { name: 'John Doe', campaign: 'Education for All' },
    { name: 'Jane Smith', campaign: 'Clean Water Initiative' },
    { name: 'Alice Johnson', campaign: 'Save the Forests' },
    { name: 'Bob Brown', campaign: 'Animal Rescue' },
    { name: 'Charlie Davis', campaign: 'Tech for Good' },
  ];

  // Mock data for Top Fundraisers with Best Stories
  const topFundraisersStories = [
    { name: 'John Doe', campaign: 'Education for All' },
    { name: 'Jane Smith', campaign: 'Clean Water Initiative' },
    { name: 'Alice Johnson', campaign: 'Save the Forests' },
    { name: 'Bob Brown', campaign: 'Animal Rescue' },
    { name: 'Charlie Davis', campaign: 'Tech for Good' },
  ];

  // Certificate Data
  const certificates = [
    {
      title: 'Certificate of Generosity',
      description:
        'Highlights your commitment to spreading kindness and supporting meaningful causes.',
      icon: <FaHandHoldingHeart className="w-5 h-5" />,
      color: 'text-purple-500',
    },
    {
      title: 'Ambassador of Impact Award',
      description:
        'Celebrates individuals who actively amplify campaigns and drive meaningful change.',
      icon: <FaBullhorn className="w-5 h-5" />,
      color: 'text-blue-500',
    },
    {
      title: 'Community Champion Certificate',
      description:
        'Honors those who lead by example in creating a supportive and engaged community.',
      icon: <FaUsers className="w-5 h-5" />,
      color: 'text-green-500',
    },
    {
      title: 'Honor of Advocacy',
      description:
        'Recognizes passionate individuals advocating for diverse causes through sharing.',
      icon: <FaMicrophone className="w-5 h-5" />,
      color: 'text-yellow-500',
    },
    {
      title: 'Beacon of Hope Award',
      description:
        'Symbolizes your role in bringing hope and visibility to important causes.',
      icon: <FaLightbulb className="w-5 h-5" />,
      color: 'text-orange-500',
    },
    {
      title: 'Certificate of Social Impact',
      description:
        'Emphasizes the tangible difference you have made by supporting and sharing campaigns.',
      icon: <FaHandsHelping className="w-5 h-5" />,
      color: 'text-red-500',
    },
    {
      title: 'Certificate of Empowerment',
      description:
        'Highlights how you empower others by amplifying their stories and campaigns.',
      icon: <FaStar className="w-5 h-5" />,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 md:py-4 md:pl-4 rounded-l-lg rounded-r-none">
      {/* Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Top Backers, Most Active Backers, Top Backers with Most Rewards */}
        <div className="w-full md:w-1/2">
          {/* Top Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Top Backers</h3>
            <div className="flex -space-x-3">
              {topBackers.slice(0, 5).map((backer, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topBackers.length - index }}
                    >
                      <Avatar name={backer.name} size="sm" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{backer.name}</h4>
                      <p className="text-sm">Amount: {backer.amount}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topBackers.length > 5 && (
                <div className="relative flex items-center justify-center w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topBackers.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Most Active Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Most Active Backers</h3>
            <div className="flex -space-x-3">
              {mostActiveBackers.slice(0, 5).map((backer, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: mostActiveBackers.length - index }}
                    >
                      <Avatar name={backer.name} size="sm" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{backer.name}</h4>
                      <p className="text-sm">
                        Contributions: {backer.contributions}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {mostActiveBackers.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{mostActiveBackers.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Top Backers with Most Rewards Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Top Backers with Most Rewards
            </h3>
            <div className="flex -space-x-3">
              {topBackersWithRewards.slice(0, 5).map((backer, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topBackersWithRewards.length - index }}
                    >
                      <Avatar name={backer.name} size="sm" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{backer.name}</h4>
                      <p className="text-sm">Rewards: {backer.rewards}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topBackersWithRewards.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topBackersWithRewards.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Top Fundraisers with Best Campaign Graphics, Top Fundraisers with Best Stories, Certificates */}
        <div className="w-full md:w-1/2">
          {/* Top Fundraisers with Best Campaign Graphics Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              Top Fundraisers with Best Campaign Graphics
            </h3>
            <div className="flex -space-x-3">
              {topFundraisersGraphics.slice(0, 5).map((fundraiser, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topFundraisersGraphics.length - index }}
                    >
                      <Avatar name={fundraiser.name} size="sm" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{fundraiser.name}</h4>
                      <p className="text-sm">Campaign: {fundraiser.campaign}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topFundraisersGraphics.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topFundraisersGraphics.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Top Fundraisers with Best Stories Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              Top Fundraisers with Best Stories
            </h3>
            <div className="flex -space-x-3">
              {topFundraisersStories.slice(0, 5).map((fundraiser, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topFundraisersStories.length - index }}
                    >
                      <Avatar name={fundraiser.name} size="sm" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{fundraiser.name}</h4>
                      <p className="text-sm">Campaign: {fundraiser.campaign}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topFundraisersStories.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topFundraisersStories.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Get Featured and Win Certificates Section */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-cyan-500">
              Get Featured, Win Rewards and Unlock Special Certificates
            </h3>
            <div className="flex flex-wrap gap-3">
              {certificates.map((certificate, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <button
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: certificates.length - index }}
                    >
                      <Button
                        className={`${certificate.color} p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:scale-105 transition-transform duration-200 ease-in-out`}
                      >
                        {certificate.icon}
                      </Button>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-2 p-2">
                      <h4 className="font-semibold">{certificate.title}</h4>
                      <p className="text-sm">{certificate.description}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Two-Column Layout
const SummaryCardComponent: React.FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Left Column - SummaryCard */}
      <div className="w-full md:w-1/3 p-4">
        <SummaryCard />
      </div>

      {/* Right Column - Leaderboard */}
      <div className="w-full md:w-2/3">
        <Leaderboard />
      </div>
    </div>
  );
};

export default SummaryCardComponent;
