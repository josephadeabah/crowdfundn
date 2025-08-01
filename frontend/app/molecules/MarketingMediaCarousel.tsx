'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPlay, FaPause } from 'react-icons/fa';

type MediaType = 'image' | 'video';

interface BaseMediaItem {
  type: MediaType;
  description: string;
}

interface ImageMediaItem extends BaseMediaItem {
  type: 'image';
  url: string;
  alt: string;
}

interface VideoMediaItem extends BaseMediaItem {
  type: 'video';
  url: string;
  thumbnail: string;
}

type MediaItem = ImageMediaItem | VideoMediaItem;

interface MediaItemComponentProps {
  item: MediaItem;
  index: number;
}

const MarketingMediaCarousel: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const mediaItems: MediaItem[] = [
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
      thumbnail: '',
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
      thumbnail: '',
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
      thumbnail: '',
      description:
        'The future is immersive — this crowdfunded tech startup is building virtual and augmented reality tools for education, gaming, and storytelling across Africa.',
    },
  ];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const MediaItem: React.FC<MediaItemComponentProps> = ({ item }) => {
    const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: false });
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
      if (videoRef.current) {
        if (inView && isPlaying) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }
    }, [inView, isPlaying]);

    const togglePlayback = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsPlaying((prev) => !prev);
    };

    return (
      <div className="flex flex-col">
        <motion.div
          ref={ref}
          className="relative w-full h-72 md:h-[26rem] overflow-hidden rounded-sm"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="relative w-full h-full group">
              <video
                ref={videoRef}
                src={item.url}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover"
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
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-gray-700 text-lg font-medium">
            {item.description}
          </p>
          <button
            className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 whitespace-nowrap"
            onClick={() => console.log(`Navigate to story`)}
          >
            Read customer story
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-8">
      <div
        ref={carouselRef}
        className={`flex overflow-x-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex gap-6 transition-transform duration-300">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="min-w-[calc(50%-12px)] md:min-w-[calc(40%-16px)]"
              role="group"
              aria-label={`Slide ${index + 1} of ${mediaItems.length}`}
            >
              <MediaItem item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingMediaCarousel;
