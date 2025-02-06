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
import { useEffect } from 'react';
import { useLeaderboardContext } from '../context/leaderboard/LeaderboardContext';
import { deslugify } from '../utils/helpers/categories';
import LeaderboardSkeletonLoader from '../loaders/LeaderboardSkeletonLoader';
import { useUserContext } from '../context/users/UserContext';
import { getVerifiedBadge } from '../utils/helpers/get.level.trophy';

// SummaryCard Component
const SummaryCard: React.FC = () => {
  return (
    <div
      className="w-full bg-green-50 text-green-600 dark:bg-gray-800 dark:text-green-400 p-2 md:py-4 md:px-0 rounded-lg"
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
  const { userAccountData } = useUserContext();

  const {
    topBackers,
    mostActiveBackers,
    topBackersWithRewards,
    topFundraisersGraphics,
    topFundraisersStories,
    loading,
    error,
    fetchLeaderboardData,
  } = useLeaderboardContext(); // Access the context

  useEffect(() => {
    fetchLeaderboardData(); // Fetch leaderboard data on component mount
  }, [fetchLeaderboardData]);

  if (loading) {
    return <LeaderboardSkeletonLoader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <div className="w-full bg-white dark:bg-gray-800 p-4">
      {/* Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Top Backers, Most Active Backers, Top Backers with Most Rewards */}
        <div className="w-full md:w-1/2">
          {/* Top Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Loyal Backers</h3>
            <div className="flex -space-x-3">
              {topBackers?.map((backer, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topBackers.length - index }}
                    >
                      <Avatar
                        name={backer.name}
                        size="sm"
                        imageUrl={backer.profile_picture}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={backer.name}
                          size="xl"
                          imageUrl={backer.profile_picture}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {backer.name}
                            </h4>
                            <span>{getVerifiedBadge(backer.level, 20)}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {backer.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Category Interest
                        </p>
                        <p className="text-sm text-gray-700">
                          {deslugify(backer.category_interest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Bio</p>
                        <p className="text-sm text-gray-700">{backer.bio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Total Donated</p>
                        <p className="text-sm text-gray-700">
                          {backer?.currency}
                          {backer.amount}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topBackers?.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topBackers?.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Most Active Backers Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">Enthusiastic Backers</h3>
            <div className="flex -space-x-3">
              {mostActiveBackers?.map((backer, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: mostActiveBackers.length - index }}
                    >
                      <Avatar
                        name={backer.name}
                        size="sm"
                        imageUrl={backer.profile_picture}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={backer.name}
                          size="xl"
                          imageUrl={backer.profile_picture}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {backer.name}
                            </h4>
                            <span>{getVerifiedBadge(backer.level, 20)}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {backer.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Category Interest
                        </p>
                        <p className="text-sm text-gray-700">
                          {deslugify(backer.category_interest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Bio</p>
                        <p className="text-sm text-gray-700">{backer.bio}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Contributions</p>
                        <p className="text-sm text-gray-700">
                          {backer.contributions}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {mostActiveBackers?.length > 6 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{mostActiveBackers?.length - 6}
                </div>
              )}
            </div>
          </div>

          {/* Top Backers with Most Rewards Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Discerning Backers</h3>
            {topBackersWithRewards && topBackersWithRewards.length > 0 ? (
              topBackersWithRewards.some((backer) => backer.rewards > 0) ? (
                <div className="flex -space-x-3">
                  {topBackersWithRewards.map(
                    (backer, index) =>
                      backer.rewards > 0 && (
                        <Popover key={index}>
                          <PopoverTrigger asChild>
                            <div
                              className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                              style={{
                                zIndex: topBackersWithRewards.length - index,
                              }}
                            >
                              <Avatar
                                name={backer.name}
                                size="sm"
                                imageUrl={backer.profile_picture}
                              />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <div className="space-y-4 p-4">
                              <div className="flex items-center space-x-4">
                                <Avatar
                                  name={backer.name}
                                  size="xl"
                                  imageUrl={backer.profile_picture}
                                />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                      {backer.name}
                                    </h4>
                                    <span>
                                      {getVerifiedBadge(backer.level, 20)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {backer.country}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  Category Interest
                                </p>
                                <p className="text-sm text-gray-700">
                                  {deslugify(backer.category_interest)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Bio</p>
                                <p className="text-sm text-gray-700">
                                  {backer.bio}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Rewards</p>
                                <p className="text-sm text-gray-700">
                                  {backer.rewards}
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ),
                  )}
                  {topBackersWithRewards.filter((backer) => backer.rewards > 0)
                    .length > 5 && (
                    <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                      +
                      {topBackersWithRewards.filter(
                        (backer) => backer.rewards > 0,
                      ).length - 5}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No data available in this group</p>
              )
            ) : (
              <p className="text-gray-500">No data available in this group</p>
            )}
          </div>
        </div>

        {/* Right Column - Top Fundraisers with Best Campaign Graphics, Top Fundraisers with Best Stories, Certificates */}
        <div className="w-full md:w-1/2">
          {/* Top Fundraisers with Best Campaign Graphics Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              Strategic Fundraisers
            </h3>
            <div className="flex -space-x-3">
              {topFundraisersGraphics?.map((fundraiser, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topFundraisersGraphics.length - index }}
                    >
                      <Avatar
                        name={fundraiser.name}
                        size="sm"
                        imageUrl={fundraiser.profile_picture}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={fundraiser.name}
                          size="xl"
                          imageUrl={fundraiser.profile_picture}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {fundraiser.name}
                            </h4>
                            <span>
                              {getVerifiedBadge(fundraiser.level, 20)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {fundraiser.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Category Interest
                        </p>
                        <p className="text-sm text-gray-700">
                          {deslugify(fundraiser.category_interest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Bio</p>
                        <p className="text-sm text-gray-700">
                          {fundraiser.bio}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Campaign</p>
                        <p className="text-sm text-gray-700">
                          {fundraiser.campaign}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topFundraisersGraphics?.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topFundraisersGraphics?.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Top Fundraisers with Best Stories Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold mb-2">
              Relentless Fundraisers
            </h3>
            <div className="flex -space-x-3">
              {topFundraisersStories?.map((fundraiser, index) => (
                <Popover key={fundraiser.name}>
                  <PopoverTrigger asChild>
                    <div
                      className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                      style={{ zIndex: topFundraisersStories.length - index }}
                    >
                      <Avatar
                        name={fundraiser.name}
                        size="sm"
                        imageUrl={fundraiser.profile_picture}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          name={fundraiser.name}
                          size="xl"
                          imageUrl={fundraiser.profile_picture}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {fundraiser.name}
                            </h4>
                            <span>
                              {getVerifiedBadge(fundraiser.level, 20)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {fundraiser.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Category Interest
                        </p>
                        <p className="text-sm text-gray-700">
                          {deslugify(fundraiser.category_interest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Bio</p>
                        <p className="text-sm text-gray-700">
                          {fundraiser.bio}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Campaign</p>
                        <p className="text-sm text-gray-700">
                          {fundraiser.campaign}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              {topFundraisersStories?.length > 6 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300">
                  +{topFundraisersStories?.length - 6}
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
    <div className="w-full flex flex-col md:flex-row gap-6 py-12">
      {/* Left Column - SummaryCard */}
      <div className="w-full md:w-1/3">
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
