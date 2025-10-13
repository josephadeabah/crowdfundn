'use client';
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight, Play, Zap, Trophy } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  const { user } = useAuth();
  const { topBackers, fetchLeaderboardData } = useLeaderboardContext();

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  useEffect(() => {
    setIsMounted(true);
    
    // Force video autoplay on mobile
    const forceVideoPlay = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.log('Autoplay prevented:', error);
          // Add fallback play on user interaction
          document.addEventListener('click', () => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('Fallback play failed:', e));
            }
          }, { once: true });
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(forceVideoPlay, 100);
    
    return () => {
      clearTimeout(timer);
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

  // Only apply scroll effects after component is mounted
  // const backgroundY = isMounted ? Math.min(scrollY * 0.5, 300) : 0;
  // const contentY = isMounted ? Math.min(scrollY * 0.1, 50) : 0;
  // const opacityValue = isMounted ? Math.max(1 - scrollY * 0.002, 0) : 1;
  // const overlayOpacity = isMounted
  //   ? Math.min(0.7 + scrollY * 0.0005, 0.85)
  //   : 0.7;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => {
          // Additional attempt to play when video is loaded
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Loaded data play failed:', e));
          }
        }}
      >
        <source
          src="/farm-plough.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto flex items-center px-4">
        <div className="w-full lg:w-2/3 space-y-8 animate-fade-up">
          {/* Badge with funding types */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="text-white/90 font-medium">💝 Donation</span>
              <span className="text-white/70">|</span>
              <span className="text-white/90 font-medium">🎁 Reward-Based</span>
              <span className="text-white/70">|</span>
              <span className="text-white/90 font-medium">
                📈 Equity Investment
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-white leading-tight">
            Powering Africa's{' '}
            <span className="text-green-600">Industrial Revolution</span>
            <br />
            Through{' '}
            <span className="bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
              Smart Funding
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
            Invest in Africa's tomorrow, today. We connects visionary entrepreneurs with forward-thinking investors to
            fuel the continent's most innovative businesses and drive
            sustainable economic growth.
          </p>

          {/* CTA Buttons - Fixed horizontal alignment */}
          <div className="flex flex-row items-center gap-4 w-full max-w-md">
            <Link 
              href={user ? '/account/dashboard/create' : '/auth'} 
              className="flex-1 min-w-0"
            >
              <button className="group w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-400 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Raise Capital Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </button>
            </Link>

            <Link
              href="https://www.pnpmmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 whitespace-nowrap"
              >
                Read Us
              </Button>
            </Link>
          </div>

          {/* Top Backers Section */}
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
                            <span>{getVerifiedBadge(backer.level, 20)}</span>
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
                        <p className="text-sm text-gray-800">{backer.bio}</p>
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
              {topBackers?.length > 5 && (
                <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-semibold text-gray-800">
                  +{topBackers?.length - 5}
                </div>
              )}
            </div>
            <p className="text-sm text-white/80">
              <span className="font-semibold text-white">
                {topBackers?.length || 0}+
              </span>{' '}
              backers joined this month
            </p>
          </div>
        </div>

        {/* Floating Cards - Positioned on the right side */}
        <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2 space-y-6">
          {/* AI Suggestion Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs animate-fade-in shadow-xl ml-auto">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-white/70 mb-1">
                  Fund A Dream Today!
                </div>
                <div className="text-sm font-semibold text-white">
                  Invest In Africa's Bright Minds w/ As Little As GHS100
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs animate-fade-in shadow-xl ml-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-600/20 text-green-600 text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Achievement
              </div>
            </div>
            <h3 className="font-bold text-white mb-2">
              Make Good Things Happen
            </h3>
            <div className="flex gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse-glow"></div>
              <div
                className="w-2 h-2 rounded-full bg-green-600 animate-pulse-glow"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-green-600 animate-pulse-glow"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
            <div className="text-xs text-white/80">
              The Easy Way To Fund Africa's Future.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;