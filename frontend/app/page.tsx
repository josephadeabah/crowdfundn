'use client';
import data from '../data.json';
import * as React from 'react';

import { CarouselPlugin } from './molecules/CarouselPlugin';
import CardBanner from './molecules/CardBanner';
import { Badge } from './components/badge/Badge';
import Progress from './components/progressbar/ProgressBar';
import HomePageLoader from './loaders/HomeLoader';

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
        {/* categories */}
        <CardBanner
          title="Categories"
          description="Explore categories"
          className="p-4"
        >
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
        {/* recommended campaigns */}
        <CardBanner
          title="Recommended Campaigns"
          description="Check these out"
          className="p-4"
        >
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
        <CardBanner className="p-4">
          <section className="bg-white dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto gap-y-8">
              <div className="mx-auto w-full text-center text-gray-950 dark:text-gray-50">
                <h2 className="text-3xl font-bold mb-3 lg:text-4xl">
                  Discover CrowdFundAfrica
                </h2>
              </div>
              <div className="max-w-[49.5rem] grid mx-auto gap-6 sm:grid-cols-2 w-full col-span-1 p-6 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-lg text-left">
                <div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Empowering Change
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    We empower African projects by providing secure, accessible,
                    and affordable funding solutions.
                  </p>
                </div>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Flexible Payment Options
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Support projects using a variety of payment methods: mobile
                    money (like M-Pesa, Airtel Money, MTN Mobile Money and
                    Orange Money), bank transfers, and PayPal. We ensure a
                    seamless experience for all donors.
                  </p>
                </div>
              </div>
              <div className="max-w-[49.5rem] grid mx-auto gap-6 sm:grid-cols-2 w-full col-span-1 p-6 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-lg text-left">
                <div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Join the Movement
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Be part of a community that is making a difference across
                    Africa. Together, we can create impactful change.
                  </p>
                </div>
                <div>
                  <h4 className="mt-4 mb-2 text-gray-950 dark:text-gray-50 text-lg font-bold lg:text-xl">
                    Rewards & Gamification
                  </h4>
                  <p className="text-base text-gray-950 dark:text-gray-50">
                    Enjoy rewards for your donations and participate in engaging
                    gamification features that enhance your crowdfunding
                    experience. Together, we can make every contribution count!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </CardBanner>

        <CardBanner>
          <section className="dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto">
              <img
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          description="Join the million people who have already made big impact"
          className="p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3  gap-4">
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

      {/* Fundraising tips */}
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <CardBanner
          title="Latest Blog Posts"
          description="Check out our latest articles"
          footer="Read more"
          className="p-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {data.blogPosts.map((post) => (
              <div key={post.id}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-sm"
                />
                <div className="">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBanner>
        <CardBanner
          title="Get the Best tips from our community"
          description="Join us"
          footer="Get involved"
          className="p-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {data.blogPosts.map((post) => (
              <div key={post.id}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-sm"
                />
                <div className="">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBanner>
      </div>
    </div>
  );
};

export default HomePage;
