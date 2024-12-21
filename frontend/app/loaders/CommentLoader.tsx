import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommentLoader = () => (
  <div className="bg-white dark:bg-gray-800 rounded-sm shadow p-4 mb-4 flex items-start">
    {/* Avatar Loader */}
    <div className="flex-shrink-0">
      <Skeleton circle={true} height={40} width={40} />
    </div>
    <div className="ml-3 w-full">
      {/* Full Name and Date Loader */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton width="30%" height={16} />
        <Skeleton width="20%" height={12} />
      </div>
      {/* Comment Content Loader */}
      <Skeleton count={2} />
    </div>
  </div>
);

export default CommentLoader;
