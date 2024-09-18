'use client';
import data from '../data.json';
import * as React from 'react';

import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';

const HomePage = () => {
  return (
    <div className="flex justify-center items-center flex-col mx-auto w-full pt-1 sm:px-8">
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner title="About" description="About me" footer="Read more">
          <p>{data.name}</p>
        </CardBanner>

        <div className="w-full max-w-full sm:w-1/2">
          <CarouselPlugin />
        </div>
      </div>

      <h1 className="my-4 text-2xl font-semibold">@{data.name}</h1>
      <p className="mb-8 text-gray-500 font-medium text-center text-sm sm:text-base">
        {data.bio}
      </p>
    </div>
  );
};

export default HomePage;
