import React from 'react';
import Carousel from './Carousel';

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