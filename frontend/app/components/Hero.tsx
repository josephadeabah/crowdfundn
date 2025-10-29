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
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Two-layer background: White top, Orange bottom */}
      <div className="absolute inset-0 bg-white"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-orange-100"></div>
      
      {/* Decorative Graphics */}
      <img 
        src='/floating-elements.png' 
        alt="" 
        className="absolute top-20 right-10 w-64 h-64 opacity-10 animate-pulse pointer-events-none"
      />
      <img 
        src='/badge-graphic.png'
        alt="" 
        className="absolute bottom-20 left-10 w-48 h-48 opacity-20 animate-spin-slow pointer-events-none"
        style={{ animationDuration: '20s' }}
      />
      
      {/* Main Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-foreground">
                🚀 Powering Africa&apos;s Financial Future
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Invest in Africa&apos;s
                <span className="block text-primary">Bright Future</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connect visionary entrepreneurs with forward-thinking investors. 
                Drive sustainable economic growth across the continent.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4">
              <Button variant="success" size="lg" className="group flex-1 sm:flex-initial">
                Start Investing
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-initial">
                Raise Capital
              </Button>
            </div>

            {/* Investor Avatars */}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 border-2 border-background flex items-center justify-center text-xs font-semibold text-accent-foreground">
                  MK
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  SA
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 border-2 border-background flex items-center justify-center text-xs font-semibold text-accent-foreground">
                  LT
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  +50
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1,000+</span> active investors
              </div>
            </div>
          </div>

          {/* Right Content - Image with decorative elements */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-30"></div>
            <img 
              src='/hero-graphic.jpg'
              alt="Financial growth and investment visualization" 
              className="relative max-w-2xl h-auto rounded-2xl shadow-lg border border-border/50"
            />
            {/* Small decorative badge */}
            <img 
              src='/badge-graphic.png' 
              alt="" 
              className="absolute -bottom-8 -right-8 w-32 h-32 opacity-40 animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
