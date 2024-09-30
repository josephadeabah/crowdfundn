'use client';
import data from '../data.json';
import * as React from 'react';
import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';
import { Badge } from './components/badge/Badge';
import Progress from './components/progressbar/ProgressBar';
import HomePageLoader from './loaders/HomeLoader';
import { BrandsLogoSlider } from './molecules/BrandsLogoSlider';
import Cta from './molecules/CTA';
import FAQsPage from './molecules/faqs';
import OnBoard from './components/onboard/OnBoard';

const HomePage = () => {
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const wordRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    const words = [
      'Fundraise Like a Boss',
      'Donate Like the World is Ending',
      'Crowdfunding Solutions for Africa Innovators',
      'Uniting Communities Through Social Change',
      'Transforming Ideas into Action Across Continents',
      'Championing Local Causes with Global Support',
    ];

    let part = '';
    let i = 0;
    let offset = 0;
    const len = words.length;
    let forwards = true;
    let skip_count = 0;
    const skip_delay = 15;
    const speed = 70;
    const updateWord = () => {
      if (forwards) {
        if (offset >= words[i].length) {
          skip_count++;
          if (skip_count === skip_delay) {
            forwards = false;
            skip_count = 0;
          }
        }
      } else {
        if (offset === 0) {
          forwards = true;
          i++;
          offset = 0;
          if (i >= len) {
            i = 0;
          }
        }
      }
    };
    const updatePart = () => {
      part = words[i].substring(0, offset);
      if (skip_count === 0) {
        offset += forwards ? 1 : -1;
      }
      if (wordRef.current) {
        wordRef.current.textContent = part;
      }
    };
    const wordflick = () => {
      setInterval(() => {
        updateWord();
        updatePart();
      }, speed);
    };

    wordflick();
  }, []);

  if (loading) {
    return <HomePageLoader />;
  }

  return (
    <div className="w-full flex flex-col gap-16 min-h-screen mb-24">
      <div className="flex-grow flex flex-col justify-center items-center text-gray-800 rounded-b-3xl dark:text-gray-50 bg-white dark:bg-gray-800 mx-auto w-full pt-1">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <div className="p-4 sm:w-1/2">
            <h1 className="text-4xl md:text-7xl">
              <div
                className="anim-words flex justify-center items-center w-full p-4 md:p-8"
                style={{ height: '250px' }}
              >
                <h1
                  className="word text-center text-2xl md:text-4xl lg:text-5xl font-bold"
                  ref={wordRef}
                >
                  .
                </h1>
              </div>
            </h1>
            <div className="w-full flex flex-col items-center gap-4 lg:flex-row lg:justify-start *:w-full *:px-5 *:py-3 *:text-base *:font-medium *:text-center *:transition *:duration-[250ms] *:ease-in-out lg:*:w-auto">
              <a
                href="/auth/register"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Get Started
              </a>
              <a
                href="/faqs"
                className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 text-gray-950 dark:text-gray-50"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="sm:w-1/2">
            <CarouselPlugin />
          </div>
        </div>
      </div>
      <div className="p-4">
        <OnBoard />
      </div>
      <div className="w-full flex flex-col sm:flex-row">
        <CardBanner title="Categories" className="p-4">
          <div className="flex flex-wrap gap-2 mb-4 justify-start">
            {data.categories.map((category) => (
              <Badge
                key={category.value}
                className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 ${
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
              <div
                key={campaign.id}
                className="flex flex-col h-full hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={campaign?.image}
                  alt={campaign?.name}
                  className="mb-2 object-cover h-32 w-full"
                />
                <div className="px-1">
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
              </div>
            ))}
          </div>
        </CardBanner>
      </div>
      {/* CTA */}
      <Cta />
      {/* More random campaigns */}
      <div className="w-full flex flex-col sm:flex-row">
        <CardBanner
          title="More Campaigns"
          description="Discover fundraisers inspired by what you care about"
          className="p-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recommendedFundraisers.map((campaign) => (
              <div
                key={campaign.id}
                className="flex flex-col h-full hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2 object-cover h-32 w-full"
                />
                <div className="px-1">
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
              <div
                key={campaign.id}
                className="flex flex-col h-full hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={campaign.image}
                  alt={campaign.name}
                  className="mb-2 object-cover h-32 w-full"
                />
                <div className="px-1">
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
              </div>
            ))}
          </div>
        </CardBanner>
      </div>

      <FAQsPage />

      {/* Trusted by Brands Section */}
      <div className="w-full flex flex-col items-center gap-8">
        <h1 className="font-bold mb-4">Trusted by Brands</h1>
        <BrandsLogoSlider />
      </div>
    </div>
  );
};

export default HomePage;
