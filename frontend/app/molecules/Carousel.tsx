import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay } from 'react-icons/fa';

type MediaSlide = {
  description: string;
} & (
  | {
      type: 'image';
      url: string;
      alt: string;
    }
  | {
      type: 'video';
      url: string;
      thumbnail: string;
    }
);

type CarouselProps = {
  slides: MediaSlide[];
};

interface MediaLoadingState {
  [key: number]: boolean;
}

const MediaSkeleton = () => (
  <div className="carousel-media-container">
    <div className="skeleton w-full h-full rounded-lg" />
  </div>
);

const MediaContent: React.FC<{
  slide: MediaSlide;
  absoluteIndex: number;
  videoRefs: React.MutableRefObject<{ [key: number]: HTMLVideoElement | null }>;
  isLoaded: boolean;
  onLoad: () => void;
  onVideoPlay: (index: number) => void;
}> = ({ slide, absoluteIndex, videoRefs, isLoaded, onLoad, onVideoPlay }) => {
  return (
    <div className="carousel-media-container">
      {!isLoaded && <MediaSkeleton />}
      
      {/* <div className="absolute top-3 left-3 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 backdrop-blur-sm">
        Sponsored
      </div> */}

      {slide.type === 'image' ? (
        <img
          src={slide.url}
          alt={slide.alt}
          className={`carousel-media ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={onLoad}
          loading="lazy"
        />
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={(el) => (videoRefs.current[absoluteIndex] = el)}
            src={slide.url}
            poster={slide.thumbnail}
            className={`carousel-media ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={onLoad}
            loop
            muted
            playsInline
          />
          <button
            onClick={() => onVideoPlay(absoluteIndex)}
            className="absolute bottom-3 left-3 bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
            aria-label="Play video"
          >
            <FaPlay size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingStates, setLoadingStates] = useState<MediaLoadingState>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [slidesPerPage, setSlidesPerPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerPage(window.innerWidth >= 1024 ? 2 : 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = true;
        if (isPlaying && isVideoInView(video)) {
          video.play().catch((e) => console.log('Autoplay prevented:', e));
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex, isPlaying]);

  const isVideoInView = (video: HTMLVideoElement) => {
    if (!containerRef.current) return false;
    const containerRect = containerRef.current.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();

    return (
      videoRect.left >= containerRect.left &&
      videoRect.right <= containerRect.right
    );
  };

  const totalGroups = Math.ceil(slides.length / slidesPerPage);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, totalGroups]);

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  const handleVideoPlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play().catch((e) => console.log('Play prevented:', e));
    }
  };

  const handleMediaLoad = (index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto py-8 px-4"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-container">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(100 / totalGroups) * currentIndex}%)`,
            width: `${totalGroups * 100}%`,
          }}
        >
          {Array.from({ length: totalGroups }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="w-full flex-shrink-0 p-4"
              style={{ width: `${100 / totalGroups}%` }}
            >
              <div className="flex gap-6">
                {slides
                  .slice(
                    groupIndex * slidesPerPage,
                    (groupIndex + 1) * slidesPerPage,
                  )
                  .map((slide, slideIndex) => {
                    const absoluteIndex = groupIndex * slidesPerPage + slideIndex;
                    const isLoaded = loadingStates[absoluteIndex] || false;
                    
                    return (
                      <div
                        key={absoluteIndex}
                        className={`flex-1 min-w-0 carousel-slide ${
                          slidesPerPage === 2
                            ? 'flex flex-col lg:flex-row'
                            : 'flex flex-col'
                        }`}
                      >
                        <div
                          className={`${
                            slidesPerPage === 2 ? 'lg:w-1/2' : 'w-full'
                          }`}
                        >
                          <MediaContent
                            slide={slide}
                            absoluteIndex={absoluteIndex}
                            videoRefs={videoRefs}
                            isLoaded={isLoaded}
                            onLoad={() => handleMediaLoad(absoluteIndex)}
                            onVideoPlay={handleVideoPlay}
                          />
                        </div>

                        <div
                          className={`p-6 flex flex-col justify-between ${
                            slidesPerPage === 2 ? 'lg:w-1/2' : 'w-full'
                          }`}
                        >
                          <div className="flex-grow">
                            <p className="text-gray-700 mb-6 leading-relaxed text-sm lg:text-base">
                              {slide.description}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <button className="carousel-cta-button">
                              Learn More
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goToPrev}
          className="carousel-nav-button left-4"
          aria-label="Previous slide"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={goToNext}
          className="carousel-nav-button right-4"
          aria-label="Next slide"
        >
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center mt-6 gap-3">
        {Array.from({ length: totalGroups }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-indicator ${
              currentIndex === index ? 'active' : 'inactive'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;