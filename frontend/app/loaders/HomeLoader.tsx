import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CardBanner from '../molecules/CardBanner';

const HomePageLoader = () => {
  return (
    <div className="bg-slate-50 dark:bg-gray-800">
      <div className="flex-grow flex flex-col justify-center items-center mx-auto w-full pt-1 sm:px-8">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <div className="w-full max-w-full sm:w-1/2">
            <Skeleton height={200} />
          </div>
          <CardBanner title="Donate to support any cause." className="p-4">
            <Skeleton count={3} height={20} />
          </CardBanner>
        </div>
        <Skeleton height={40} width={200} className="m-4 py-6" />
      </div>

      <div className="w-full flex flex-col mx-auto sm:flex-row gap-2">
        <CardBanner
          title="Categories"
          description="Explore categories"
          className="p-4"
        >
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {Array(60)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  width={80}
                  height={30}
                  className="rounded"
                />
              ))}
          </div>
        </CardBanner>
        <CardBanner
          title="Recommended Campaigns"
          description="Check these out"
          className="p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col h-full">
                  <Skeleton height={120} className="mb-2 rounded-md" />
                  <div className="flex-grow">
                    <Skeleton height={20} />
                    <Skeleton height={15} className="mt-2" />
                  </div>
                  <div className="w-full text-xs">
                    <Skeleton height={10} />
                  </div>
                  <Skeleton width={200} height={20} className="mt-2" />
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
              <div className="mx-auto w-full text-center">
                <Skeleton height={40} width={250} className="mb-3" />
              </div>
              <div className="max-w-[49.5rem] grid mx-auto gap-6 sm:grid-cols-2 w-full col-span-1 p-6 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-lg text-left">
                <div>
                  <Skeleton height={30} className="mb-2" />
                  <Skeleton height={20} />
                </div>
                <div>
                  <Skeleton height={30} className="mb-2" />
                  <Skeleton height={20} />
                </div>
              </div>
              <div className="max-w-[49.5rem] grid mx-auto gap-6 sm:grid-cols-2 w-full col-span-1 p-6 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-lg text-left">
                <div>
                  <Skeleton height={30} className="mb-2" />
                  <Skeleton height={20} />
                </div>
                <div>
                  <Skeleton height={30} className="mb-2" />
                  <Skeleton height={20} />
                </div>
              </div>
            </div>
          </section>
        </CardBanner>

        <CardBanner className="p-4">
          <section className="dark:bg-gray-950">
            <div className="flex flex-col items-center mx-auto">
              <Skeleton
                height={300}
                className="w-full object-cover rounded-t-3xl"
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
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col h-full">
                  <Skeleton height={120} className="mb-2 rounded-md" />
                  <div className="flex-grow">
                    <Skeleton height={20} />
                    <Skeleton height={15} className="mt-2" />
                  </div>
                  <div className="w-full text-xs">
                    <Skeleton height={10} />
                  </div>
                  <Skeleton width="50%" height={20} className="mt-2" />
                </div>
              ))}
          </div>
        </CardBanner>

        <CardBanner
          title="Ask and it shall be given"
          description="Join the million people who have already made big impact"
          className="p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex flex-col h-full">
                  <Skeleton height={120} className="mb-2 rounded-md" />
                  <div className="flex-grow">
                    <Skeleton height={20} />
                    <Skeleton height={15} className="mt-2" />
                  </div>
                  <div className="w-full text-xs">
                    <Skeleton height={10} />
                  </div>
                  <Skeleton width="50%" height={20} className="mt-2" />
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
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index}>
                  <Skeleton
                    height={200}
                    className="w-full h-48 object-cover rounded-sm"
                  />
                  <Skeleton height={20} className="mt-2" />
                  <Skeleton height={15} className="mt-1" />
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
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index}>
                  <Skeleton
                    height={200}
                    className="w-full h-48 object-cover rounded-sm"
                  />
                  <Skeleton height={20} className="mt-2" />
                  <Skeleton height={15} className="mt-1" />
                </div>
              ))}
          </div>
        </CardBanner>
      </div>
    </div>
  );
};

export default HomePageLoader;
