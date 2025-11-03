'use client';
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight, Play, Zap, Trophy, Brain, Target, Sparkles, Rocket } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import Link from 'next/link';
import { useLeaderboardContext } from '../context/leaderboard/LeaderboardContext';
import { deslugify } from '../utils/helpers/categories';
import { Popover, PopoverContent, PopoverTrigger } from './popover/Popover';
import Avatar from './avatar/Avatar';
import { getVerifiedBadge } from '../utils/helpers/get.level.trophy';
import { VideoPlayer } from './videoplayer/videoplayar';
import { Button } from './ui/button';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentAISting, setCurrentAISting] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  const { user } = useAuth();
  const { topBackers, fetchLeaderboardData } = useLeaderboardContext();

  // AI Marketing Stings
  const aiStings = [
    {
      icon: Brain,
      text: "AI-Powered Deal Analysis",
      description: "Get instant insights with our Hive Mind AI"
    },
    {
      icon: Target,
      text: "Smart Investment Matching",
      description: "Find perfect opportunities with AI-driven recommendations"
    },
    {
      icon: Trophy,
      text: "Gamified Experience",
      description: "Earn points, level up, and compete on leaderboards"
    },
    {
      icon: Sparkles,
      text: "Predictive Analytics",
      description: "AI forecasts campaign success and investment potential"
    }
  ];

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  useEffect(() => {
    setIsMounted(true);

    // Rotate AI stings every 3 seconds
    const stingInterval = setInterval(() => {
      setCurrentAISting((prev) => (prev + 1) % aiStings.length);
    }, 3000);

    // Force video autoplay on mobile
    const forceVideoPlay = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.log('Autoplay prevented:', error);
          // Add fallback play on user interaction
          document.addEventListener(
            'click',
            () => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .catch((e) => console.log('Fallback play failed:', e));
              }
            },
            { once: true },
          );
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(forceVideoPlay, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(stingInterval);
      setIsMounted(false);
    };
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

  const CurrentStingIcon = aiStings[currentAISting].icon;

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Heropage.png)' }}
      ></div>
      {/* Two-layer background: Make white container transparent */}
      <div className="absolute inset-0 bg-green-100/50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-green-700/50"></div>
      
      {/* Main Hero Section */}
      <div className="w-full mx-auto px-4 py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 animate-fade-in">
              {/* AI Feature Carousel - FIXED RESPONSIVENESS */}
              <div className="w-full">
                <div className="relative">
                  <div className="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm min-h-[72px]">
                    {/* Animated Bubble */}
                    <div className="flex-shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-1.5 bg-green-50 rounded-xl border border-green-100">
                        <CurrentStingIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                      </div>
                    </div>

                    {/* Text Content - Fixed for mobile */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">
                        {aiStings[currentAISting].text}
                      </p>
                      <p className="text-xs text-gray-600 leading-tight line-clamp-1">
                        {aiStings[currentAISting].description}
                      </p>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex-shrink-0 flex space-x-1 ml-2">
                      {aiStings.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            index === currentAISting
                              ? 'bg-orange-600'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 leading-tight">
                  Invest in Africa&apos;s
                  <span className="block text-orange-500">Tomorrow Today</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-800 leading-relaxed max-w-xl">
                  Connecting visionary entrepreneurs with forward-thinking
                  investors to drive sustainable economic growth across the
                  continent.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="group flex-1 sm:flex-initial"
                  onClick={() =>
                    (window.location.href = user
                      ? '/account#Favorites'
                      : '/auth/register')
                  }
                >
                  Start Investing
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-initial"
                  onClick={() =>
                    (window.location.href = user
                      ? '/account#Campaigns'
                      : '/auth/register')
                  }
                >
                  Raise Capital
                </Button>
              </div>

              {/* Top Backers Section */}
              <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up animate-delay-400">
                <div className="flex -space-x-3">
                  {topBackers?.slice(0, 5).map((backer, index) => (
                    <Popover key={index}>
                      <PopoverTrigger asChild>
                        <div
                          className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                          style={{ zIndex: 5 - index }}
                        >
                          <Avatar
                            name={backer.name}
                            size="sm"
                            imageUrl={backer.profile_picture}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 sm:w-96">
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
                              <p className="text-sm text-gray-800">
                                {backer.country}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Category Interest
                            </p>
                            <p className="text-sm text-gray-800">
                              {deslugify(backer.category_interest)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Bio
                            </p>
                            <p className="text-sm text-gray-800">
                              {backer.bio}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Total Donated
                            </p>
                            <p className="text-sm text-gray-800">
                              {backer?.currency}
                              {backer.amount}
                            </p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                  {topBackers && topBackers.length > 5 && (
                    <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-xs font-semibold text-gray-800 border-2 border-white">
                      +{topBackers.length - 5}
                    </div>
                  )}
                </div>
                <p className="text-sm text-white text-center sm:text-left">
                  <span className="font-semibold">
                    {topBackers?.length || 0}+
                  </span>{' '}
                  backers joined this month
                </p>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:right-0">
                <div className="relative max-w-7xl mx-auto px-4">
                  <div
                    className="relative animate-fade-in rounded-2xl shadow-lg overflow-hidden bg-white"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <img
                      src="/raise.png"
                      alt="Financial growth and investment visualization"
                      className="relative w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Decorative badge */}
                <img
                  src="/badge-graphic.png"
                  alt=""
                  className="absolute -bottom-4 -right-4 w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32 opacity-40 animate-bounce hidden lg:block"
                  style={{ animationDuration: '3s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;