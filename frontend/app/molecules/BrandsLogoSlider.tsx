import React, { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/carousel/Carousel';
import Autoplay from 'embla-carousel-autoplay';

// Define a Brand type
type Brand = {
  name: string;
  id: string;
};

// Function to chunk the brands array into groups of specified size
const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export function BrandsLogoSlider() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  // Trusted brands data in the desired format
  const trustedBrands: Brand[] = [
    { name: 'Flutterwave', id: 'flutterwave' },
    { name: 'Paystack', id: 'paystack' },
    { name: 'Visa', id: 'visa' },
    { name: 'Mastercard', id: 'mastercard' },
    { name: 'MPesa', id: 'mpesa' },
    { name: 'MTN', id: 'mtn' },
    { name: 'Red Cross', id: 'redcross' },
    { name: 'Save the Children', id: 'savechildren' },
    { name: 'Vodafone', id: 'vodafone' },
  ];

  // Chunk the brands into groups of 3
  const brandChunks = chunkArray(trustedBrands, 3);

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      className="max-w-7xl mx-auto py-16 bg-gradient-to-tr from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900  text-gray-700 dark:text-gray-50"
    >
      <div className="w-full flex p-8 justify-center items-center">
        <h1>Trusted by Brands</h1>
      </div>

      <CarouselContent>
        {brandChunks.map((chunk, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center gap-2 md:gap-12"
          >
            {chunk.map((brand) => (
              <div
                key={brand.id}
                className="flex flex-col items-center gap-y-2 p-4 md:p-6 dark:bg-gray-950"
              >
                <img
                  src={`https://img.logo.dev/${brand.id}.com?token=pk_EoYVBqzrSFeSm5-xN9WT9Q`}
                  alt={brand.name}
                  className="h-12 md:h-16"
                />
                <span className="text-sm md:text-lg text-gray-800 dark:text-gray-50">
                  {brand.name}
                </span>
              </div>
            ))}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 hidden" />
      <CarouselNext className="right-4 hidden" />
    </Carousel>
  );
}
