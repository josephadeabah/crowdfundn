import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryBadgeLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
          >
            <Skeleton
              width="100%"
              height={30}
              className="rounded-full transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBadgeLoader;
