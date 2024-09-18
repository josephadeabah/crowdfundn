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
          <CardBanner title="About" description="About me">
            <p>{data.name}</p>
          </CardBanner>

          <div className="w-full max-w-full sm:w-1/2">
            <CarouselPlugin />
          </div>
        </div>

        <h1 className="my-4 text-3xl font-semibold">@{data.name}</h1>
        <p className="mb-8 text-gray-700 font-medium text-center text-md sm:text-base">
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
          <div className="grid grid-cols-2 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div key={campaign.id}>
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2"
                />
                <h3 className="text-lg font-bold">{campaign.name}</h3>
                <p className="text-sm">{campaign.description}</p>
              </div>
            ))}
          </div>
        </CardBanner>
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner>
          <section className="bg-white dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto">
              <div className="mx-auto w-full text-center *:text-gray-950 dark:*:text-gray-50">
                <h2 className="text-3xl font-bold mb-3 lg:text-4xl">
                  Uisual Studio Features
                </h2>
                <p className="text-base mb-5">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas vitae mattis tellus. Pellentesque commodo lacus at
                  sodales.
                </p>
              </div>
              <div className="max-w-[49.5rem] grid mx-auto gap-6 sm:grid-cols-2 *:w-full *:col-span-1 *:p-6 *:bg-white dark:*:bg-gray-950 *:ring-1 *:ring-inset *:ring-gray-200 dark:*:ring-gray-800 *:rounded-lg *:text-left">
                <div>
                  <div className="w-fit p-3 rounded-lg bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 256 256"
                      className="fill-gray-950 dark:fill-white"
                    >
                      <path d="M100 36H56a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20Zm-4 60H60V60h36Zm104-60h-44a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20Zm-4 60h-36V60h36Zm-96 40H56a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20v-44a20 20 0 0 0-20-20Zm-4 60H60v-36h36Zm104-60h-44a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20v-44a20 20 0 0 0-20-20Zm-4 60h-36v-36h36Z" />
                    </svg>
                  </div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Lorem Ipsum
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas vitae mattis tellus. Pellentesque commodo lacus at
                    sodales.
                  </p>
                </div>
                <div>
                  <div className="w-fit p-3 rounded-lg bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 256 256"
                      className="fill-gray-950 dark:fill-white"
                    >
                      <path d="M100 36H56a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20Zm-4 60H60V60h36Zm104-60h-44a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20Zm-4 60h-36V60h36Zm-96 40H56a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20v-44a20 20 0 0 0-20-20Zm-4 60H60v-36h36Zm104-60h-44a20 20 0 0 0-20 20v44a20 20 0 0 0 20 20h44a20 20 0 0 0 20-20v-44a20 20 0 0 0-20-20Zm-4 60h-36v-36h36Z" />
                    </svg>
                  </div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Lorem Ipsum
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas vitae mattis tellus. Pellentesque commodo lacus at
                    sodales.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </CardBanner>
        <CardBanner>
          <section className="dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto max-w-[52.5rem]">
              <img
                src="https://gmsrgfdbn9g2iagv.public.blob.vercel-storage.com/img/placeholder/graphic/screenshot.svg"
                alt="#"
                className="w-full h-auto object-cover rounded-t-3xl max-h-[30rem] lg:max-h-[40rem]"
              />
            </div>
          </section>
        </CardBanner>
      </div>

      {/* More random campaigns */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="More Campaigns"
          description="Discover more"
          footer="Read more"
        >
          <div className="grid grid-cols-2 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div key={campaign.id}>
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2"
                />
                <h3 className="text-lg font-bold">{campaign.name}</h3>
                <p className="text-sm">{campaign.description}</p>
              </div>
            ))}
          </div>
        </CardBanner>
        <CardBanner
          title="Call to Action"
          description="Join us"
          footer="Get involved"
        >
          <div className="grid grid-cols-2 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div key={campaign.id}>
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2"
                />
                <h3 className="text-lg font-bold">{campaign.name}</h3>
                <p className="text-sm">{campaign.description}</p>
              </div>
            ))}
          </div>
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
