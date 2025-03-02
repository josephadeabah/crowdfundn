'use client';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom Arrow Components
const PrevArrow = (props: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-0 right-16 z-10 bg-gray-200 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
    >
      <FaChevronLeft className="w-6 h-6 text-white" />
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
      className="absolute top-0 right-4 z-10 bg-gray-200 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
    >
      <FaChevronRight className="w-6 h-6 text-white" />
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
  autoplay = true,
  autoplaySpeed = 5000,
}: CarouselProps) => {
  const carouselSettings = {
    dots: false, // Hide dots
    infinite: true,
    speed: 500,
    slidesToShow, // Use the passed value or default to 5
    slidesToScroll: 1,
    centerMode: false,
    autoplay, // Enable or disable autoplay based on the prop
    autoplaySpeed, // Set the autoplay speed
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Show 3 slides on tablets
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2, // Show 2 slides on mobile
        },
      },
    ],
  };

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="w-full">
        <div className="flex justify-between items-center px-6">
        {title && (
          <h2 className="text-3xl font-bold text-left px-6 mb-4">{title}</h2>
        )}
        <div className="flex items-center gap-2">
        <PrevArrow onClick={() => {}} />
        <NextArrow onClick={() => {}} />
        </div>
        </div>
        <Slider {...carouselSettings}>{children}</Slider>
      </div>
    </section>
  );
};

export default CarouselComponent;