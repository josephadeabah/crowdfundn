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

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [slidesPerPage, setSlidesPerPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerPage(2);
      } else {
        setSlidesPerPage(1);
      }
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

  return (
    <div
      className="w-full max-w-7xl mx-auto py-8 px-4"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden">
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
              <div className="flex gap-4">
                {slides
                  .slice(
                    groupIndex * slidesPerPage,
                    (groupIndex + 1) * slidesPerPage,
                  )
                  .map((slide, slideIndex) => {
                    const absoluteIndex =
                      groupIndex * slidesPerPage + slideIndex;
                    return (
                      <div
                        key={absoluteIndex}
                        className={`flex-1 min-w-0 bg-white rounded-xl shadow-md overflow-hidden ${
                          slidesPerPage === 2
                            ? 'flex flex-col md:flex-row'
                            : 'flex flex-col'
                        }`}
                      >
                        <div
                          className={`relative ${
                            slidesPerPage === 2 ? 'md:w-1/2' : 'w-full'
                          }`}
                        >
                          <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                            Sponsored
                          </div>
                          {slide.type === 'image' ? (
                            <img
                              src={slide.url}
                              alt={slide.alt}
                              className="w-full h-full object-cover aspect-video"
                              loading="lazy"
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                                Sponsored
                              </div>
                              <video
                                ref={(el) =>
                                  (videoRefs.current[absoluteIndex] = el)
                                }
                                src={slide.url}
                                poster={slide.thumbnail}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                              />
                              <button
                                onClick={() => handleVideoPlay(absoluteIndex)}
                                className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                                aria-label="Play video"
                              >
                                <FaPlay size={14} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div
                          className={`p-6 flex flex-col ${
                            slidesPerPage === 2 ? 'md:w-1/2' : 'w-full'
                          }`}
                        >
                          <div className="flex-grow">
                            <p className="text-gray-700 mb-4">
                              {slide.description}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <button className="whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors">
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
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Previous slide"
        >
          <FaArrowLeft className="text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Next slide"
        >
          <FaArrowRight className="text-gray-800" />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalGroups }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-orange-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Example usage
const MarketingMediaCarousel = () => {
  const slides: MediaSlide[] = [
    {
      type: 'image',
      url: '/busshot.jpg',
      alt: 'Man working in a carpentry workshop',
      description:
        "Empowering local craftsmanship — this carpenter's dream came to life through our community-backed funding, bringing sustainable furniture solutions to his neighborhood.",
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

  return <Carousel slides={slides} />;
};

export default MarketingMediaCarousel;
