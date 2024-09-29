import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaPause,
  FaPlay,
} from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    quote: 'This product has revolutionized our workflow. Highly recommended!',
    name: 'John D.',
    rating: 5,
  },
  {
    id: 2,
    quote: "Outstanding service and support. I couldn't be happier!",
    name: 'Sarah M.',
    rating: 4,
  },
  {
    id: 3,
    quote: "The best solution I've found for my business needs.",
    name: 'Michael R.',
    rating: 5,
  },
  {
    id: 4,
    quote:
      "Intuitive and powerful. It's made a significant impact on our productivity.",
    name: 'Emily L.',
    rating: 4,
  },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    );
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(nextTestimonial, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextTestimonial]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
    } else if (e.key === 'Space') {
      togglePlayPause();
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl shadow-2xl"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Testimonial Carousel"
    >
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 p-6 bg-white rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
            >
              <blockquote className="text-lg italic mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{testimonial.name}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} mr-1`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevTestimonial}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>
        <div className="text-center">
          <span className="font-medium">
            {currentIndex + 1} / {testimonials.length}
          </span>
          <button
            onClick={togglePlayPause}
            className="ml-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
        <button
          onClick={nextTestimonial}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;

export const TestimonialsCarousel = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      role: 'CEO, TechCorp',
      quote: 'This product revolutionized our workflow. Highly recommended!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Marketing Director, BrandCo',
      quote:
        'The customer support is unparalleled. A game-changer for our team!',
      rating: 4,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Freelance Designer',
      quote:
        'As a creative professional, this tool has been a lifesaver. Love it!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoScrolling]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
    }

    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-4 py-8 overflow-hidden"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Testimonial Carousel"
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="w-full flex-shrink-0 px-4 sm:w-1/2 lg:w-1/3"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`${index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} text-xl`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous testimonial"
      >
        <FaChevronLeft className="text-gray-800 text-2xl" />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next testimonial"
      >
        <FaChevronRight className="text-gray-800 text-2xl" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
