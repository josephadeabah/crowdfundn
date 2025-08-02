'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type MediaItemType =
  | {
      type: 'image';
      url: string;
      alt: string;
      description: string;
    }
  | {
      type: 'video';
      url: string;
      thumbnail: string;
      description: string;
    };

interface MediaItemProps {
  item: MediaItemType;
  index: number;
}

const MarketingMediaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const mediaItems: MediaItemType[] = [
    {
      type: 'image',
      url: '/busshot.jpg',
      alt: 'Man working in a carpentry workshop',
      description:
        'Empowering local craftsmanship — this carpenter’s dream came to life through our community-backed funding, bringing sustainable furniture solutions to his neighborhood.',
    },
    {
      type: 'video',
      url: '/innovation1.mp4',
      thumbnail: '/video-thumbnail1.jpg',
      description:
        'Capturing innovation from above — drone technology is revolutionizing delivery, farming, and logistics in rural Africa, one crowdfunded idea at a time.',
    },
    {
      type: 'image',
      url: '/farminggirl.jpg',
      alt: 'Young woman innovating on her farm',
      description:
        'Meet the young agripreneur transforming agriculture with smart, eco-friendly techniques — supported entirely by the people who believe in her mission.',
    },
    {
      type: 'video',
      url: '/innovation4.mp4',
      thumbnail: '/video-thumbnail2.jpg',
      description:
        'Inside the lab: this funded research project is producing groundbreaking bioplastics to reduce pollution and inspire the next generation of green startups.',
    },
    {
      type: 'image',
      url: '/busshot3.avif',
      alt: 'Baker preparing bread in his workshop',
      description:
        'From passion to profit — see how crowdfunding helped this local baker expand his kitchen and deliver fresh, affordable bread to his community daily.',
    },
    {
      type: 'video',
      url: '/innovation3.mp4',
      thumbnail: '/video-thumbnail3.jpg',
      description:
        'The future is immersive — this crowdfunded tech startup is building virtual and augmented reality tools for education, gaming, and storytelling across Africa.',
    },
  ];

const MediaItem: React.FC<MediaItemProps> = ({ item, index }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1, // Lower threshold for mobile
    triggerOnce: false,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused

  useEffect(() => {
    setHasMounted(true);
    
    if (videoRef.current) {
      // Mobile browsers often require explicit user interaction
      videoRef.current.muted = true;
      
      if (inView && isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Video play failed:', error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView, isPlaying]);

  const togglePlayback = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  // Fallback for mobile when intersection observer doesn't trigger
  const shouldShow = hasMounted ? (inView || typeof window !== 'undefined' && window.innerWidth < 768) : false;

  return (
    <div className="flex flex-col">
      <motion.div
        ref={ref}
        className="relative w-full h-48 sm:h-64 md:h-96 overflow-hidden rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShow ? 1 : 0 }}
        transition={{ 
          duration: 0.3,
          delay: hasMounted ? 0 : 0.1 // Small delay on initial mount
        }}
      >
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.alt}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 max-w-full"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="relative w-full h-full group">
            <video
              ref={videoRef}
              src={item.url}
              muted
              loop
              playsInline
              webkit-playsinline="true"
              className="w-full h-full object-cover"
              poster={item.thumbnail}
              x-webkit-airplay="allow"
             preload="metadata"
            />
            <button
              onClick={togglePlayback}
              className="absolute bottom-4 left-4 bg-orange-500 bg-opacity-80 p-3 rounded-full text-white hover:bg-opacity-100 transition-all duration-300"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>
          </div>
        )}
      </motion.div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-2 gap-2 sm:gap-4">
          <p className="text-gray-700 text-base sm:text-lg font-medium">
            {item.description}
          </p>
          <button
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300 whitespace-nowrap text-sm sm:text-base"
            onClick={() => console.log(`Navigate to story ${index + 1}`)}
          >
            Read fundraiser story
          </button>
        </div>
      </div>
    );
  };

  const handlePrevSlide = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.max(currentIndex - 1, 0);
      setCurrentIndex(newIndex);
      carouselRef.current.scrollTo({
        left: newIndex * slideWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNextSlide = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const maxIndex = mediaItems.length - 1;
      const newIndex = Math.min(currentIndex + 1, maxIndex);
      setCurrentIndex(newIndex);
      carouselRef.current.scrollTo({
        left: newIndex * slideWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].clientX : e.pageX;
    if (carouselRef.current) {
      setStartX(pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleDragMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX =
      'touches' in e
        ? (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX
        : (e as React.MouseEvent<HTMLDivElement>).pageX;
    if (carouselRef.current) {
      const x = pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth);
      setCurrentIndex(newIndex);
      carouselRef.current.scrollTo({
        left: newIndex * slideWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-hidden cursor-grab active:cursor-grabbing touch-pan-x relative"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 transition-transform duration-300">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="min-w-[calc(100%-16px)] sm:min-w-[calc(50%-16px)] md:min-w-[calc(33.333%-24px)] snap-center"
              role="group"
              aria-label={`Slide ${index + 1} of ${mediaItems.length}`}
            >
              <MediaItem item={item} index={index} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={currentIndex === 0}
        aria-label="Previous slide"
      >
        <FaChevronLeft
          className={`text-2xl ${currentIndex === 0 ? 'text-gray-400' : 'text-orange-500'}`}
        />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={currentIndex === mediaItems.length - 1}
        aria-label="Next slide"
      >
        <FaChevronRight
          className={`text-2xl ${currentIndex === mediaItems.length - 1 ? 'text-gray-400' : 'text-orange-500'}`}
        />
      </button>
    </div>
  );
};

export default MarketingMediaCarousel;
