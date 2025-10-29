'use client';
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import { useLeaderboardContext } from '../context/leaderboard/LeaderboardContext';
import { deslugify } from '../utils/helpers/categories';
import { Popover, PopoverContent, PopoverTrigger } from './popover/Popover';
import Avatar from './avatar/Avatar';
import { getVerifiedBadge } from '../utils/helpers/get.level.trophy';
import { Button } from './ui/button';

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { user } = useAuth();
  const { topBackers, fetchLeaderboardData } = useLeaderboardContext();

  useEffect(() => {
    fetchLeaderboardData();
    setIsMounted(true);
  }, [fetchLeaderboardData]);

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
    return () => animatedElements.forEach((el) => observer.unobserve(el));
  }, [isMounted]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-orange-500"></div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700">
                🚀 Powering Africa&apos;s Financial Future
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-700 leading-tight">
                Invest in Africa&apos;s
                <span className="block text-orange-500">Bright Future</span>
              </h1>
              <p className="text-xl text-gray-800 leading-relaxed max-w-xl">
                Connect visionary entrepreneurs with forward-thinking investors. 
                Drive sustainable economic growth across the continent.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4">
              <Button variant="success" size="lg" className="group bg-green-700 flex-1 sm:flex-initial">
                Start Investing
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-initial">
                Raise Capital
              </Button>
            </div>

            {/* Top Backers */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-fade-up animate-delay-400">
              <div className="flex -space-x-3">
                {topBackers?.map((backer, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <div
                        className="relative hover:z-10 transform hover:scale-110 transition-transform duration-200 ease-in-out"
                        style={{ zIndex: topBackers.length - index }}
                      >
                        <Avatar name={backer.name} size="sm" imageUrl={backer.profile_picture} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-96">
                      <div className="space-y-4 p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar name={backer.name} size="xl" imageUrl={backer.profile_picture} />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-semibold text-lg text-gray-800">{backer.name}</h4>
                              <span>{getVerifiedBadge(backer.level, 20)}</span>
                            </div>
                            <p className="text-sm text-gray-800">{backer.country}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Category Interest</p>
                          <p className="text-sm text-gray-800">{deslugify(backer.category_interest)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Bio</p>
                          <p className="text-sm text-gray-800">{backer.bio}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Total Donated</p>
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
                <span className="font-semibold text-gray-700">{topBackers?.length || 0}+</span>{' '}
                backers joined this month
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div
            className="relative animate-fade-in lg:col-start-2 lg:justify-self-end lg:pr-0"
            style={{ animationDelay: '0.2s' }}
          >
            {/* Let the image visually extend beyond container on the right */}
            <div className="absolute -inset-4 bg-white rounded-l-3xl"></div>
            <div className="relative overflow-visible lg:-mr-[calc((100vw-100%)/2)]">
              <img
                src="/hero-graphic.jpg"
                alt="Financial growth and investment visualization"
                className="relative w-full max-w-2xl h-auto rounded-2xl shadow-sm border border-border/50 object-cover mobile-responsive-image"
              />
              <img
                src="/badge-graphic.png"
                alt=""
                className="absolute -bottom-8 -right-8 w-32 h-32 opacity-40 animate-bounce hidden lg:block"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-responsive-image {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .mobile-responsive-image {
            max-width: 100%;
            max-height: 400px;
            object-position: center;
          }
        }

        @media (max-width: 480px) {
          .mobile-responsive-image {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
