
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface VideoPlayerProps {
  src: string;
  posterImage: string;
  title?: string;
  className?: string;
}

const VideoPlayer = ({ src, posterImage, title, className }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isPlaying) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => setVideoLoaded(true);
      video.addEventListener('loadeddata', handleLoadedData);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  // Handle click outside to exit fullscreen mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPlaying && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    if (isPlaying) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        'video-container relative',
        isPlaying ? 'fixed inset-0 w-full h-full z-50 bg-black' : '',
        className
      )}
    >
      <video 
        ref={videoRef}
        src={src}
        poster={posterImage}
        preload="metadata"
        playsInline
        className={cn(
          'w-full h-full object-cover',
          isPlaying ? 'object-contain z-50' : ''
        )}
        onEnded={handleVideoEnd}
      />
      
      <div 
        className={cn(
          'absolute inset-0 bg-video-overlay transition-opacity duration-300',
          isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      />
      
      <button 
        onClick={handlePlayClick}
        className={cn(
          'play-button',
          !isPlaying 
            ? 'right-8 bottom-8 md:right-12 md:bottom-12 opacity-100' 
            : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 z-50'
        )}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="play-button-icon" fill="currentColor" />
        ) : (
          <Play className="play-button-icon" fill="currentColor" />
        )}
      </button>
      
      {title && !isPlaying && (
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h3 className="text-white text-lg md:text-xl font-medium drop-shadow-md">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;