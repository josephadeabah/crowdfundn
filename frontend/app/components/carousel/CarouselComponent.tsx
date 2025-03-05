'use client';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useRef, useState } from 'react'; // Import useRef and useState

// Custom Arrow Components
const PrevArrow = (props: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean; // Add disabled prop
}) => {
  const { onClick, disabled } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled} // Disable the button if `disabled` is true
      className={`bg-white shadow-md p-3 rounded-full hover:bg-opacity-70 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white'
      }`}
    >
      <FaChevronLeft
        className={`w-5 h-5 ${disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700'}`}
      />
    </button>
  );
};

const NextArrow = (props: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean; // Add disabled prop
}) => {
  const { onClick, disabled } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled} // Disable the button if `disabled` is true
      className={`bg-white shadow-md p-3 rounded-full hover:bg-opacity-70 transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
      }`}
    >
      <FaChevronRight
        className={`w-5 h-5 ${disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700'}`}
      />
    </button>
  );
};

export interface CarouselProps {
  children: React.ReactNode; // Accept children of any type
  title?: string; // Optional title for the carousel
  slidesToShow?: number; // Optional number of slides to show
  autoplay?: boolean; // Optional autoplay setting
  autoplaySpeed?: number; // Optional autoplay speed
}

const CarouselComponent = ({
  children,
  title,
  slidesToShow,
  autoplay = false,
  autoplaySpeed = 5000,
}: CarouselProps) => {
  const sliderRef = useRef<Slider>(null); // Create a ref for the Slider
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide index
  const totalSlides = React.Children.count(children); // Total number of slides

  const carouselSettings = {
    dots: false, // Hide dots
    infinite: false, // Disable infinite scrolling
    speed: 100,
    slidesToShow, // Show 3 cards per row
    slidesToScroll: 3, // Scroll 3 cards at a time
    rows: 2,
    slidesPerRow: 1,
    centerMode: false,
    autoplay, // Enable or disable autoplay based on the prop
    autoplaySpeed, // Set the autoplay speed
    beforeChange: (current: number, next: number) => {
      setCurrentSlide(next); // Update the current slide index
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 cards per row on tablets
          slidesToScroll: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Show 1 card per row on mobile
          slidesToScroll: 1,
          rows: 4,
        },
      },
    ],
  };

  // Calculate whether the "Prev" and "Next" buttons should be disabled
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= totalSlides - Number(slidesToShow) * 2; // Adjust for rows

  return (
    <div className="py-8 overflow-hidden relative">
      <div className="w-full">
        <div className="flex justify-between items-center px-6 mb-4">
          {title && (
            <h2 className="text-sm md:text-3xl font-bold text-left">{title}</h2>
          )}
          <div className="flex items-center gap-2">
            <PrevArrow
              onClick={() => sliderRef.current?.slickPrev()} // Trigger previous slide
              disabled={isPrevDisabled} // Disable if at the start
            />
            <NextArrow
              onClick={() => sliderRef.current?.slickNext()} // Trigger next slide
              disabled={isNextDisabled} // Disable if at the end
            />
          </div>
        </div>
        <Slider ref={sliderRef} {...carouselSettings}>
          {children}
        </Slider>
      </div>
    </div>
  );
};

export default CarouselComponent;
