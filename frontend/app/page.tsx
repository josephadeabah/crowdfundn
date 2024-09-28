'use client';
import data from '../data.json';
import * as React from 'react';
import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';
import { Badge } from './components/badge/Badge';
import Progress from './components/progressbar/ProgressBar';
import HomePageLoader from './loaders/HomeLoader';
import { BrandsLogoSlider } from './molecules/BrandsLogoSlider';
import CTA from './molecules/CTA';

const HomePage = () => {
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <HomePageLoader />;
  }

  return (
    <div className="w-full flex flex-col gap-16 min-h-screen mb-24">
      <div className="flex-grow flex flex-col justify-center items-center text-gray-800 rounded-b-3xl dark:text-gray-50 bg-white dark:bg-gray-800 mx-auto w-full pt-1">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <div className="p-4">
            <h1 className="text-4xl md:text-7xl">
              Donate to support any cause.
            </h1>
            <p>{data.bio}</p>
          </div>

          <div className="sm:w-1/2">
            <CarouselPlugin />
          </div>
        </div>
        <h1 className="m-4 text-4xl md:text-5xl py-6 font-semibold">
          {data.name}
        </h1>
      </div>

      <div className="w-full flex flex-col sm:flex-row">
        <CardBanner title="Categories" className="p-4">
          <div className="flex flex-wrap gap-2 mb-4 justify-start">
            {data.categories.map((category) => (
              <Badge
                key={category.value}
                className={`cursor-pointer ${
                  selectedCategory === category.value
                    ? 'bg-red-600 text-white'
                    : 'text-gray-500 dark:bg-slate-950 dark:text-gray-50'
                }`}
                onClick={() => setSelectedCategory(category.value)}
                variant="default"
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </CardBanner>

        <CardBanner title="Recommended Campaigns" className="p-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.recommendedFundraisers?.map((campaign) => (
              <div key={campaign.id} className="flex flex-col h-full">
                <img
                  src={campaign?.image}
                  alt={campaign?.name}
                  className="mb-2 object-cover h-32 w-full rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{campaign?.name}</h3>
                  <p className="text-sm">{campaign?.description}</p>
                </div>
                <div className="w-full text-xs">
                  <Progress
                    firstProgress={33}
                    firstTooltipContent={`Performance: ${33}%`}
                  />
                </div>
                <p className="flex justify-between items-center text-sm font-semibold mt-2">
                  {campaign?.amountRaised}{' '}
                  <span className="font-normal">raised</span>
                </p>
              </div>
            ))}
          </div>
        </CardBanner>
      </div>
      {/* CTA */}
      <CTA />

      {/* More random campaigns */}
      <div className="w-full flex flex-col sm:flex-row">
        <CardBanner
          title="More Campaigns"
          description="Discover fundraisers inspired by what you care about"
          className="p-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div key={campaign.id} className="flex flex-col h-full">
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2 object-cover h-32 w-full rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{campaign.name}</h3>
                  <p className="text-sm">{campaign.description}</p>
                </div>
                <div className="w-full text-xs">
                  <Progress
                    firstProgress={73}
                    firstTooltipContent={`Performance: ${73}%`}
                  />
                </div>
                <p className="flex justify-between items-center text-sm font-semibold mt-2">
                  {campaign.amountRaised}{' '}
                  <span className="font-normal">raised</span>
                </p>
              </div>
            ))}
          </div>
        </CardBanner>

        <CardBanner
          title="Ask and it shall be given"
          description="Join the million people who have already made a big impact"
          className="p-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div key={campaign.id} className="flex flex-col h-full">
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2 object-cover h-32 w-full rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{campaign.name}</h3>
                  <p className="text-sm">{campaign.description}</p>
                </div>
                <div className="w-full text-xs">
                  <Progress
                    firstProgress={13}
                    firstTooltipContent={`Performance: ${13}%`}
                  />
                </div>
                <p className="flex justify-between items-center text-sm font-semibold mt-2">
                  {campaign.amountRaised}{' '}
                  <span className="font-normal">raised</span>
                </p>
              </div>
            ))}
          </div>
        </CardBanner>
      </div>

      {/* Trusted by Brands Section */}
      <div className="w-full flex flex-col items-center gap-8">
        <h1 className="font-bold mb-4">Trusted by Brands</h1>
        <BrandsLogoSlider />
      </div>
    </div>
  );
};

export default HomePage;
