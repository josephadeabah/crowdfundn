import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/carousel/Carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '../components/card/Card';
import Image from 'next/image';
import data from '../../data.json';
import { handleContextMenu } from '../utils/helpers/base64.image';

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-screen-xl dark:bg-gray-950"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {data.recommendedFundraisers.map((fundraiser) => (
          <CarouselItem key={fundraiser.id}>
            <Card className="w-full rounded-none shadow-none border-0">
              <CardContent className="w-full p-0 flex aspect-square items-center justify-center h-96">
                <Image
                  src={fundraiser.image}
                  alt={fundraiser.name}
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  width={500}
                  height={300}
                  onContextMenu={handleContextMenu}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 text-white" />
      <CarouselNext className="right-4 text-white" />
    </Carousel>
  );
}
