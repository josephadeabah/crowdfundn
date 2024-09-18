'use client';
import data from '../data.json';
import * as React from 'react';

import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';

const HomePage = () => {
  return (
    <div className="w-full flex flex-col gap-10 min-h-screen mb-12">
      <div className="flex-grow flex flex-col justify-center items-center mx-auto w-full pt-1 sm:px-8">
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

      <div className="w-full flex flex-col sm:flex-row gap-2">
        {/* categories */}
        <CardBanner
          title="Categories"
          description="Explore categories"
          footer="Read more"
        >
          <p>{data.name}</p>
        </CardBanner>
        {/* recommended campaigns */}
        <CardBanner
          title="Recommended Campaigns"
          description="Check these out"
          footer="Read more"
        >
          <p>{data.name}</p>
        </CardBanner>
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="Call to Action"
          description="Join us"
          footer="Get involved"
        >
          <p>{data.name}</p>
        </CardBanner>
        <CardBanner
          title="Call to Action"
          description="Join us"
          footer="Get involved"
        >
          <p>{data.name}</p>
        </CardBanner>
      </div>

      {/* More random campaigns */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="More Campaigns"
          description="Discover more"
          footer="Read more"
        >
          <p>{data.name}</p>
        </CardBanner>
        <CardBanner
          title="Call to Action"
          description="Join us"
          footer="Get involved"
        >
          <p>{data.name}</p>
        </CardBanner>
      </div>

      {/* Fundraising tips */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="Fundraising Tips"
          description="Learn how to fundraise"
          footer="Read more"
        >
          <p>{data.name}</p>
        </CardBanner>
        <CardBanner
          title="Call to Action"
          description="Join us"
          footer="Get involved"
        >
          <p>{data.name}</p>
        </CardBanner>
      </div>
    </div>
  );
};

export default HomePage;
