'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight, ArrowDown, Play } from 'lucide-react';
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
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
  }, []);

  const backgroundY = Math.min(scrollY * 0.5, 300);
  const contentY = Math.min(scrollY * 0.1, 50);
  const opacityValue = Math.max(1 - scrollY * 0.002, 0);
  const overlayOpacity = Math.min(0.7 + scrollY * 0.0005, 0.85);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDEyeiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-50 -z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Heropage.png')`,
          transform: `translateY(${backgroundY}px) scale(${1 + scrollY * 0.0002})`,
          transformOrigin: 'bottom',
          top: `-${Math.min(scrollY * 0.2, 100)}px`,
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      <div
        className="relative h-full max-w-7xl mx-auto flex items-center"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: opacityValue,
        }}
      >
        <div className="container mx-auto px-6 py-24 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="w-full lg:w-1/2 space-y-8 animate-fade-in">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 text-xs font-semibold bg-white text-gray-500 rounded-full mb-4 animate-fade-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                  </span>
                  Launch your dreams with crowdfunding
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up animate-delay-100">
                  <span className="text-green-500">Fund,</span>{' '}
                  <span className="text-orange-500">Play,</span>{' '}
                  <span className="text-gray-700">Earn Rewards</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-8 animate-fade-up animate-delay-200">
                  Join the gamified and AI-powered crowdfunding platform where
                  backers earn rewards and creators bring their visions to life.
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

                <div className="mt-12 flex items-center gap-4 animate-fade-up animate-delay-400">
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
            <div className="w-full lg:w-1/2 relative animate-fade-in">
              <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                {/* Thumbnail image */}
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
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
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <VideoPlayer
            videoSrc="https://static.videezy.com/system/resources/previews/000/039/511/original/Marketing.mp4"
            isOpen={isVideoOpen}
            onClose={closeVideo}
          />
        </div>
      )}
    </div>
  );
};

export default Hero;