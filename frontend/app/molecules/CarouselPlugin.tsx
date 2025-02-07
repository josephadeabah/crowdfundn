import React from 'react';
import Slider from 'react-slick'; // Import react-slick
import { Card, CardContent } from '../components/card/Card';
import Image from 'next/image';
import data from '../../data.json';
import { handleContextMenu } from '../utils/helpers/base64.image';

const CarouselPlugin = () => {
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite scrolling
    speed: 500, // Speed of slide transition
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Enable autoplay
    autoplaySpeed: 4000, // Autoplay delay in ms
    pauseOnHover: true, // Pause autoplay when hovering
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <Slider {...settings}>
        {data.recommendedFundraisers.map((fundraiser) => (
          <div key={fundraiser.id}>
            <Card className="w-full rounded-none shadow-none border-0">
              <CardContent className="w-full p-0 flex aspect-square items-center justify-center h-full">
                <Image
                  src={fundraiser.image}
                  alt={fundraiser.name}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  width={500}
                  height={300}
                  onContextMenu={handleContextMenu}
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselPlugin;
