'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup the event listener
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
      { threshold: 0.1 }
    );

    // Select all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    // Cleanup the observer
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Enhanced parallax effect calculations
  const backgroundY = Math.min(scrollY * 0.5, 300); // Cap the parallax movement
  const contentY = Math.min(scrollY * 0.1, 50);
  const opacityValue = Math.max(1 - scrollY * 0.002, 0);
  const overlayOpacity = Math.min(0.7 + scrollY * 0.0005, 0.85);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax background with enhanced overflow effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2274&q=80')`,
          transform: `translateY(${backgroundY}px) scale(${1 + scrollY * 0.0002})`,
          transformOrigin: 'bottom',
          top: `-${Math.min(scrollY * 0.2, 100)}px`, // Creates overflow effect
        }}
      >
        {/* Gradient overlay with dynamic opacity */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      {/* Content */}
      <div
        className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: opacityValue,
        }}
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Launch your dreams with crowdfunding
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up animate-delay-100">
            Fund, Play, <span className="text-primary">Earn Rewards</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up animate-delay-200">
            Join our gamified crowdfunding platform where backers earn rewards
            and creators bring their visions to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-delay-300">
            <button className="group px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Start a Campaign
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 py-3 bg-transparent border border-border text-foreground rounded-md hover:bg-muted transition-colors">
              Explore Projects
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4 animate-fade-up animate-delay-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">1,200+</span>{' '}
              backers joined this month
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          'absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-300',
          scrollY > 100 ? 'opacity-0' : 'opacity-100 animate-float'
        )}
      >
        <span className="text-sm text-muted-foreground mb-2">
          Scroll to explore
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M12 19L6 13M12 19L18 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
