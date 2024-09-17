import data from '../data.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './components/carousel/Carousel';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="flex justify-center items-center flex-col mx-auto w-full pt-1 px-8">
      <div className="w-full h-full">
        <Carousel
          opts={{ loop: true }} // Pass any options here
          orientation="horizontal" // or "vertical"
          className="mx-auto"
        >
          <CarouselContent className="w-full h-64">
            <CarouselItem className="bg-indigo-500 text-white  flex justify-center items-center">
              <Image
                alt={data.name}
                src="https://images.pexels.com/photos/4968393/pexels-photo-4968393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width={1056}
                height={96}
                className="w-full h-full object-contain"
              />
            </CarouselItem>
            <CarouselItem className="bg-blue-500 text-white flex justify-center items-center">
              Slide 2
            </CarouselItem>
            <CarouselItem className="bg-green-500 text-white flex justify-center items-center">
              Slide 3
            </CarouselItem>
            <CarouselItem className="bg-red-500 text-white flex justify-center items-center">
              Slide 4
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4 text-white" />
          <CarouselNext className="right-4 text-white" />
        </Carousel>
      </div>

      <h1 className="my-4 text-2xl font-semibold">@{data.name}</h1>
      <p className="mb-8 text-gray-500 font-medium text-center text-sm sm:text-base">
        {data.bio}
      </p>
    </div>
  );
};
export default HomePage;
