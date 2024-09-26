'use client';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfileTabsLoader = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-screen">
      {/* Tabs Menu Skeleton */}
      <div className="w-full md:w-[13%] border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-red-200 dark:border-neutral-700">
        <nav className="flex md:flex-col w-full space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="py-2 px-1 flex items-center">
                <Skeleton width={20} height={20} className="mr-2" />
                <Skeleton width={80} height={20} />
              </div>
            ))}
        </nav>
      </div>

      {/* Tab Content Skeleton */}
      <div className="w-full bg-white dark:bg-gray-900 px-4 overflow-auto flex-1 h-full md:h-screen">
        <div className="h-full space-y-6 p-4">
          {/* Simulating grid sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton height={150} />
            <Skeleton height={150} />
            <Skeleton height={150} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton height={200} />
            <Skeleton height={200} />
            <Skeleton height={200} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
          </div>

          {/* Simulating different content sections */}
          <Skeleton height={40} />
          <Skeleton height={40} />
        </div>
      </div>
    </div>
  );
};

export default ProfileTabsLoader;
