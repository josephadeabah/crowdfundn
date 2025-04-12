'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight, ArrowDown, Play, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import Link from 'next/link';
import { useLeaderboardContext } from '../context/leaderboard/LeaderboardContext';
import { deslugify } from '../utils/helpers/categories';
import { Popover, PopoverContent, PopoverTrigger } from './popover/Popover';
import Avatar from './avatar/Avatar';
import { getVerifiedBadge } from '../utils/helpers/get.level.trophy';
import { VideoPlayer } from './videoplayer/videoplayar';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  const { user } = useAuth();
  const {
    topBackers,
    mostActiveBackers,
    topBackersWithRewards,
    topFundraisersStories,
    loading,
    error,
    fetchLeaderboardData,
  } = useLeaderboardContext();

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [isMounted]);

  // Only apply scroll effects after component is mounted
  const backgroundY = isMounted ? Math.min(scrollY * 0.5, 300) : 0;
  const contentY = isMounted ? Math.min(scrollY * 0.1, 50) : 0;
  const opacityValue = isMounted ? Math.max(1 - scrollY * 0.002, 0) : 1;
  const overlayOpacity = isMounted
    ? Math.min(0.7 + scrollY * 0.0005, 0.85)
    : 0.7;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDEyeiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-50 -z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url('/Heropage.png')`,
          transform: `translateY(${backgroundY}px) scale(${1 + (isMounted ? scrollY * 0.0002 : 0)})`,
          transformOrigin: 'bottom',
          top: `-${isMounted ? Math.min(scrollY * 0.2, 100) : 0}px`,
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      <div
        className="relative h-full max-w-7xl mx-auto flex items-center transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: opacityValue,
        }}
      >
        <div className="px-4 py-12 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 text-xs font-semibold bg-white text-gray-500 rounded-full mb-4 animate-fade-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                  </span>
                  We’re Powered By People, Driven By Purpose, Rewarded With Impact
                </div>

                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up animate-delay-100">
                  <span className="text-green-500">Impact</span>{' '}
                  <span className="text-orange-500">Accleration</span>{' '}
                  <span className="text-gray-700">Platform</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-8 animate-fade-up delay-200">
                Across cities, villages, streets, and screens, dreams are
                  burning bright. But dreams don’t fund themselves. They need
                  people. Purpose. Momentum.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
                  <button className="group px-6 py-3 bg-green-600 text-primary-foreground rounded-md hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                    <Link
                      href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
                    >
                      Fundraise Now for Free
                    </Link>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-6 py-3 bg-transparent border border-border text-foreground rounded-md hover:bg-muted transition-colors">
                    <Link href="/how-it-works">How It Works</Link>
                  </button>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up animate-delay-400">
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
                              <p className="text-sm font-semibold">
                                Total Donated
                              </p>
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
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {topBackers?.length || 0}+
                    </span>{' '}
                    backers joined this month
                  </p>
                </div>
              </div>
            </div>

            {/* Right content with video */}
            <div className="w-full lg:w-1/2 relative">
              {/* AI Suggestion Card - Top Left */}
              <div className="absolute top-8 -left-8 bg-white rounded-xl shadow-lg py-2 px-4 max-w-xs rotate-[-6deg] border-0 scale-90 origin-top-left z-10">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center mr-2">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">AI Suggestion</div>
                    <div className="text-sm font-semibold">
                      +15% funding with video
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Card - Bottom Right */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 max-w-xs border-0 scale-90 origin-bottom-right z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-orange-100 text-orange-600 text-xs font-medium rounded-full px-2 py-1">
                    <Trophy className="inline-block h-3 w-3 mr-1" /> Achievement
                  </div>
                  <div className="text-sm font-semibold">Level 3 Unlocked</div>
                </div>
                <h3 className="font-bold mb-1">Make Good Things Happen</h3>
                <div className="flex gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse delay-200"></div>
                </div>
                <div className="text-xs text-right">5 new backers just now</div>
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                {/* Thumbnail image */}
                <img
                  src="/vidnail.webp"
                  alt="Video thumbnail"
                  className="w-full aspect-video object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {/* Play button */}
                  <button
                    onClick={openVideo}
                    className="group/button video-play-button"
                    aria-label="Play video"
                  >
                    <Play fill="white" size={24} className="ml-1.5" />
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-gray-200/50 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 -top-6 -left-6 w-40 h-40 bg-video/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-lg md:text-xl font-medium drop-shadow-md">
                  Introducing Gift For Fundraisers
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <VideoPlayer
            videoSrc="/BHGifts.webm"
            isOpen={isVideoOpen}
            onClose={closeVideo}
          />
        </div>
      )}
    </div>
  );
};

export default Hero;
