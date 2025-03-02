'use client';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from 'react'; // Import useRef

// Custom Arrow Components
const PrevArrow = (props: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
    >
      <FaChevronLeft className="w-6 h-6  text-white hover:text-gray-100" />
    </button>
  );
};

const NextArrow = (props: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
    >
      <FaChevronRight className="w-6 h-6 text-white hover:text-gray-100" />
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
  slidesToShow = 5,
  autoplay = false,
  autoplaySpeed = 5000,
}: CarouselProps) => {
  const sliderRef = useRef<Slider>(null); // Create a ref for the Slider

  const carouselSettings = {
    dots: false, // Hide dots
    infinite: true,
    speed: 100,
    slidesToShow: 3, // Show 3 cards per row
    slidesToScroll: 3, // Scroll 3 cards at a time
    rows: 2,
    slidesPerRow: 1,
    centerMode: false,
    autoplay, // Enable or disable autoplay based on the prop
    autoplaySpeed, // Set the autoplay speed
    responsive: [
      {
        breakpoint: 1024,
        settings: {
            slidesToShow: 2, // Show 2 cards per row on tablets
            slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
            slidesToShow: 1, // Show 1 card per row on mobile
            slidesToScroll: 1,
        },
      },
    ],
  };

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
            />
            <NextArrow
              onClick={() => sliderRef.current?.slickNext()} // Trigger next slide
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
