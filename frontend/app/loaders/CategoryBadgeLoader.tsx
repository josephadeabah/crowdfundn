import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryBadgeLoader: React.FC = () => {
  return (
    <>
      {Array.from({ length: 60 }).map((_, index) => (
        <Skeleton
          key={index}
          width={100}
          height={30}
          className="cursor-pointer transform hover:scale-105 transition-transform duration-300 w-fit"
        />
      ))}
    </>
  );
};

export default CategoryBadgeLoader;
