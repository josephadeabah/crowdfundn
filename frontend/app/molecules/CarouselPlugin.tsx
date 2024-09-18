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
import data from '../../data.json';
export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full bg-white dark:bg-gray-950"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {data.recommendedFundraisers.map((fundraiser) => (
          <CarouselItem key={fundraiser.id}>
            <div className="p-1">
              <Card className="rounded-none bg-gray-100 shadow-none border-0">
                <CardContent className="w-full flex aspect-square items-center justify-center h-96">
                  <img
                    src={fundraiser.image}
                    alt={fundraiser.name}
                    className="object-cover h-full w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
