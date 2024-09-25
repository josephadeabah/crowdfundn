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
  GlobeAltIcon,
  UsersIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import {
  FaceIcon,
  ImageIcon,
  SunIcon,
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
      <div className="flex-grow flex flex-col justify-center items-center mx-auto w-full pt-1 sm:px-8">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <CardBanner className="p-4">
            <h1>Donate to support any cause.</h1>
            <p>{data.bio}</p>
          </CardBanner>

          <div className="w-full max-w-full sm:w-1/2">
            <CarouselPlugin />
          </div>
        </div>
        <h1 className="m-4 text-3xl py-6 font-semibold">{data.name}</h1>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-2">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <div className="bg-white dark:bg-gray-950 flex-grow">
          <div className="flex flex-col items-center mx-auto gap-y-8">
            <div className="mx-auto w-full text-center text-gray-950 dark:text-gray-50">
              <h2 className="text-3xl font-bold mb-3 lg:text-4xl">
                Discover BantuHive
              </h2>
            </div>

            <div className="max-w-[49.5rem] grid mx-auto gap-3 sm:grid-cols-2 lg:grid-cols-2 w-full px-3 bg-white dark:bg-gray-950 dark:ring-gray-800 text-left">
              <div className="flex items-start">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex justify-center items-center mx-auto rounded-full border border-gray-800"
                >
                  <GlobeIcon className="w-5 h-5 text-gray-950" />
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Diaspora-Focused Donations
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Empowering Africans abroad to invest back into their home
                    communities.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex justify-center items-center mx-auto rounded-full border border-gray-800"
                >
                  <PersonIcon className="w-5 h-5 text-gray-950" />
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Community-Centric Approach
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    We believe that every donation counts. Our platform is built
                    to be inclusive and accessible to all.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex justify-center items-center mx-auto rounded-full border border-gray-800"
                >
                  <LockClosedIcon className="w-5 h-5 text-gray-950" />
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Transparency & Trust
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    We use state-of-the-art technology to ensure transparency in
                    donations and fraud prevention.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex justify-center items-center mx-auto rounded-full border border-gray-800"
                >
                  <StarIcon className="w-5 h-5 text-gray-950" />
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Gamified Donor Engagement
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Keep donors engaged with leaderboards, badges, rewards, and
                    recognition for recurring support.
                  </p>
                </div>
              </div>
              <div className="flex items-start col-span-2 sm:col-span-1 lg:col-span-1 mb-5">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex justify-center items-center mx-auto rounded-full border border-gray-800"
                >
                  <StackIcon className="w-5 h-5 text-gray-950" />
                </Button>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-500 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Recurring Revenue & Subscription Features
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Unique subscription-based features that allow for recurring
                    donations to support ongoing causes or businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <section className="dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto">
              <img
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="#"
                className="w-full h-auto object-cover rounded-t-3xl rounded-r-none max-h-[30rem] lg:max-h-[40rem]"
              />
            </div>
          </section>
        </div>
      </div>

      {/* More random campaigns */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="More Campaigns"
          description="Discover fundraisers inspired by what you care about"
          className="p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
