import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryBadgeLoader: React.FC = () => {
  return (
    <div className="w-full px-2 py-4 bg-gradient-to-br from-gray-50 to-neutral-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {Array.from({ length: 24 }).map((_, index) => (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              <Skeleton
                key={index}
                width={100}
                height={30}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-300 w-fit"
              />
            </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBadgeLoader;
