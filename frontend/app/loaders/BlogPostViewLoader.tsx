'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogPostViewLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Title & Featured Image (max-w-7xl) */}
      <div className="max-w-7xl w-full px-2 py-8">
        <h1 className="text-6xl font-bold text-center mb-6">
          <Skeleton width="60%" height={50} />
        </h1>

        <div className="relative w-full h-64 md:h-96">
          <Skeleton width="100%" height="100%" />
        </div>
      </div>

      {/* Rest of the Content (max-w-4xl) */}
      <div className="max-w-4xl w-full px-4 py-8">
        <p className="text-gray-500 text-sm mt-4 text-center">
          <Skeleton width={200} height={20} />
        </p>

        <div className="prose dark:prose-dark max-w-none mt-6 text-lg text-gray-800">
          <Skeleton count={5} />
        </div>
      </div>
    </div>
  );
};

export default BlogPostViewLoader;
