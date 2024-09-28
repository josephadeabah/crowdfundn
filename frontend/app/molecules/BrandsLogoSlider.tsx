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
    { name: 'Airtel', id: 'airtel' },
    { name: 'Orange', id: 'orange' },
    { name: 'MTN', id: 'mtn' },
    { name: 'Red Cross', id: 'redcross' },
    { name: 'Save the Children', id: 'savechildren' },
    { name: 'Safaricom', id: 'safaricom' },
    { name: 'Verve', id: 'verve' },
    { name: 'Vodafone', id: 'vodafone' },
    { name: 'Africell', id: 'africell' },
    { name: 'Tigo', id: 'tigo' },
    { name: 'WFP', id: 'wfp' },
  ];

  // Chunk the brands into groups of 3
  const brandChunks = chunkArray(trustedBrands, 3);

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      className="w-full bg-white dark:bg-gray-950"
    >
      <CarouselContent>
        {brandChunks.map((chunk, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center gap-2 md:gap-12"
          >
            {chunk.map((brand) => (
              <div
                key={brand.id}
                className="flex flex-col items-center gap-y-2 bg-white p-4 md:p-6 dark:bg-gray-900"
              >
                <img
                  src={`https://img.logo.dev/${brand.id}.com?token=pk_EoYVBqzrSFeSm5-xN9WT9Q`}
                  alt={brand.name}
                  className="h-12 md:h-16"
                />
                <span className="text-sm md:text-lg">{brand.name}</span>
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
