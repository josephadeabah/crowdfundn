'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaPlay, FaPause } from "react-icons/fa";

type MediaType = "image" | "video";

interface BaseMediaItem {
  type: MediaType;
  description: string;
}

interface ImageMediaItem extends BaseMediaItem {
  type: "image";
  url: string;
  alt: string;
}

interface VideoMediaItem extends BaseMediaItem {
  type: "video";
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
      type: "image",
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      alt: "Tech Marketing Campaign",
      description: "How we transformed digital presence for Tech Corp"
    },
    {
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnail: "",
      description: "Innovation in motion: A startup success story"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      alt: "Digital Marketing Strategy",
      description: "Breaking records with our marketing strategy"
    },
    {
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "",
      description: "Revolutionizing customer engagement through video"
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      alt: "Team Collaboration",
      description: "Building stronger teams through innovation"
    },
    {
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "",
      description: "The future of digital marketing"
    }
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
          className="relative w-full h-96 md:h-96 overflow-hidden rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {item.type === "image" ? (
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
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
            </div>
          )}
        </motion.div>
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-gray-700 text-lg font-medium">{item.description}</p>
          <button
            className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-300 whitespace-nowrap"
            onClick={() => console.log(`Navigate to story`)}
          >
            Read customer story
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-1 py-8">
      <div
        ref={carouselRef}
        className={`flex overflow-x-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex gap-6 transition-transform duration-300">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="min-w-[calc(33.333%-16px)] md:min-w-[calc(33.333%-24px)]"
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
