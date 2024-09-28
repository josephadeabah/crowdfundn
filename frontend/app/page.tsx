'use client';
import data from '../data.json';
import * as React from 'react';
import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';
import { Badge } from './components/badge/Badge';
import Progress from './components/progressbar/ProgressBar';
import HomePageLoader from './loaders/HomeLoader';
import { BrandsLogoSlider } from './molecules/BrandsLogoSlider';
import {
  GlobeIcon,
  LockClosedIcon,
  PersonIcon,
  StarIcon,
  StackIcon,
} from '@radix-ui/react-icons';
import { Button } from './components/button/Button';

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
      <div className="w-full flex flex-col sm:flex-row">
        <div className="bg-white dark:bg-gray-950 flex-grow p-4 rounded-l-3xl">
          <div className="flex flex-col items-center mx-auto gap-y-8">
            <div className="text-center text-gray-950 dark:text-gray-50">
              <h2 className="text-3xl font-bold lg:text-4xl">
                Discover BantuHive
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {[
                {
                  icon: <GlobeIcon className="text-green-500" />,
                  title: 'Diaspora-Focused Donations',
                  description:
                    'Empowering Africans abroad to invest back into their home communities and support local businesses.',
                  borderColor: 'border-green-500',
                },
                {
                  icon: <PersonIcon className="text-yellow-500" />,
                  title: 'Community-Centric Approach',
                  description:
                    'Creating a hive where communities can support each other and see tangible results.',
                  borderColor: 'border-yellow-500',
                },
                {
                  icon: <LockClosedIcon className="text-blue-400" />,
                  title: 'Transparency & Trust',
                  description:
                    'We use state-of-the-art technology to ensure transparency in donations and fraud prevention.',
                  borderColor: 'border-blue-600',
                },
                {
                  icon: <StarIcon className="text-amber-700" />,
                  title: 'Gamified Donor Engagement',
                  description:
                    'Keep donors engaged with leaderboards, badges, rewards, and recognition for recurring support.',
                  borderColor: 'border-amber-700',
                },
                {
                  icon: <StackIcon className="text-zinc-500" />,
                  title: 'Recurring Revenue & Subscription Features',
                  description:
                    'Unique subscription-based features that allow for recurring donations to support ongoing causes or businesses.',
                  borderColor: 'border-zinc-500',
                  colSpan: 'col-span-2 sm:col-span-1 lg:col-span-1 mb-5',
                },
              ].map(
                ({ icon, title, description, borderColor, colSpan = '' }) => (
                  <div
                    className={`flex items-start gap-4 ${colSpan}`}
                    key={title}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className={`flex justify-center items-center mx-auto rounded-full border ${borderColor}`}
                    >
                      {icon}
                    </Button>
                    <div>
                      <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                        {title}
                      </h4>
                      <p className="text-base text-gray-950 dark:text-gray-50">
                        {description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-950">
          <div className="flex flex-col items-center mx-auto">
            <img
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="#"
              className="w-full h-auto object-cover rounded-t-3xl rounded-l-none rounded-r-none max-h-[30rem] lg:max-h-[40rem]"
            />
          </div>
        </div>
      </div>

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
