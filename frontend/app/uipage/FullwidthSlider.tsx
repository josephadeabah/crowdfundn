'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TrustedBrandSlider = ({ autoplaySpeed = 3000, logosPerSlide = 4 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<number | null>(null);

  const brands = [
    {
      name: 'Brand 1',
      logo: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80',
    },
    {
      name: 'Brand 2',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      name: 'Brand 3',
      logo: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      name: 'Brand 4',
      logo: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
    },
    {
      name: 'Brand 5',
      logo: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    },
    {
      name: 'Brand 6',
      logo: 'https://images.unsplash.com/photo-1605020420620-20c943cc4669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [currentIndex, autoplaySpeed]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === brands.length - logosPerSlide ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? brands.length - logosPerSlide : prevIndex - 1,
    );
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchDown = e.touches[0].clientX;
    sliderRef.current = touchDown;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) {
      return;
    }

    const touchDown = sliderRef.current;
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      nextSlide();
    }

    if (diff < -5) {
      prevSlide();
    }

    sliderRef.current = null;
  };

  return (
    <div className="relative overflow-hidden bg-gray-100 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Trusted by Top Brands
      </h2>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / logosPerSlide)}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {brands.map((brand, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-1/${logosPerSlide} px-4 transition-all duration-300 ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
          >
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-full h-32 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    'https://images.unsplash.com/photo-1634450637226-aecac13b3312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-2xl text-gray-600" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-2xl text-gray-600" />
      </button>
    </div>
  );
};

export default TrustedBrandSlider;
