'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import Link from 'next/link';
import { useLeaderboardContext } from '../context/leaderboard/LeaderboardContext';
import { deslugify } from '../utils/helpers/categories';
import { Popover, PopoverContent, PopoverTrigger } from './popover/Popover';
import Avatar from './avatar/Avatar';
import { getVerifiedBadge } from '../utils/helpers/get.level.trophy';
import VideoPlayer from './videoplayer/VideoPlayer';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
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
    <div className="relative h-screen overflow-x-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4 sm:px-6 lg:px-12 py-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-white text-gray-500 rounded-full mb-4 animate-fade-up">
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
              Join the gamified and AI-powered crowdfunding platform where backers earn rewards
              and creators bring their visions to life.
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
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {topBackers?.length || 0}+
                </span>{' '}
                backers joined this month
              </p>
            </div>
          </div>
        </div>

        <div className="lg:-mr-5 xl:-mr-14  reveal reveal-delay-4">
          <VideoPlayer
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            posterImage="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2340&auto=format&fit=crop"
            title="Introducing Gift For Creators and Businesses"
            className="aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
          />
        </div>
      </div>

      <div
        className={cn(
          'absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-300',
          scrollY > 100 ? 'opacity-0' : 'opacity-100 animate-float',
        )}
      >
        <span className="text-sm text-muted-foreground mb-2">
          Scroll to explore
        </span>
        <ArrowDown className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  );
};

export default Hero;
