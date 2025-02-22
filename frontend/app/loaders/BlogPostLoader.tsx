'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BlogPostLoader: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        <Skeleton width={250} height={30} />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="block bg-white rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-48">
              <Skeleton width="100%" height="100%" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                <Skeleton width="80%" height={24} />
              </h3>
              <p className="text-gray-700">
                <Skeleton count={2} />
              </p>
              <p className="text-gray-500 text-sm mt-4">
                <Skeleton width={150} height={16} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostLoader;
