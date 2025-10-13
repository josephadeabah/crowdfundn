'use client';
import React, { useEffect, useState } from 'react';
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.pixabay.com/video/2019/05/01/23232-333604632_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto flex items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-2/3 space-y-8 animate-fade-up">
          {/* Badge with funding types */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="text-white/90 font-medium">💝 Donation</span>
              <span className="text-white/70">|</span>
              <span className="text-white/90 font-medium">🎁 Reward-Based</span>
              <span className="text-white/70">|</span>
              <span className="text-white/90 font-medium">📈 Equity Investment</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Powering Africa's{' '}
            <span className="text-primary">Industrial Revolution</span>
            <br />
            Through{' '}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Smart Funding
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
            Invest in Africa's tomorrow, today. Our crowdfunding platform connects visionary entrepreneurs 
            with forward-thinking investors to fuel the continent's most innovative businesses and 
            drive sustainable economic growth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/50"
            >
              Raise Capital Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
            >
              Explore Opportunities
            </Button>
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
                    {topBackers?.length > 5 && (
                      <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-semibold text-gray-800">
                        +{topBackers?.length - 5}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold text-gray-800">
                      {topBackers?.length || 0}+
                    </span>{' '}
                    backers joined this month
                  </p>
                </div>
               {/* Floating Cards */}
          <div className="hidden lg:block">
            {/* AI Suggestion Card */}
            <div className="absolute top-20 right-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs animate-fade-in shadow-xl">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-white/70 mb-1">Fund A Dream Today!</div>
                  <div className="text-sm font-semibold text-white">
                    Invest In Africa's Bright Minds w/ As Little As GHS50
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="absolute bottom-32 right-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs animate-fade-in shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-secondary/20 text-secondary text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Achievement
                </div>
              </div>
              <h3 className="font-bold text-white mb-2">Make Good Things Happen</h3>
              <div className="flex gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <div className="text-xs text-white/80">
                The Easy Way To Fund Africa's Future.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-white/50"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
