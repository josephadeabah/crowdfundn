'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ThankyouLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          <Skeleton width={200} height={40} />
        </h1>
        <p className="text-lg text-gray-700">
          <Skeleton width={250} />
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-600">
            <Skeleton width={150} />
          </h2>

          <div className="mt-4 text-left">
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> <Skeleton width={100} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Amount:</strong> <Skeleton width={100} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Transaction Reference:</strong> <Skeleton width={150} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Created At:</strong> <Skeleton width={120} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Updated At:</strong> <Skeleton width={120} />
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-600">
              <Skeleton width={200} />
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Title:</strong> <Skeleton width={180} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Goal Amount:</strong> <Skeleton width={100} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Current Amount:</strong> <Skeleton width={100} />
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-600">
              <Skeleton width={200} />
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Fundraiser Name:</strong> <Skeleton width={150} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Funding Goal:</strong> <Skeleton width={100} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Amount Raised:</strong> <Skeleton width={100} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> <Skeleton width={80} />
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fundraiser Created At:</strong> <Skeleton width={120} />
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
            <Skeleton width={180} height={40} />
          </button>
          <a
            href="/"
            className="w-full inline-block text-center bg-gray-600 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition"
          >
            <Skeleton width={180} height={40} />
          </a>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <Skeleton width={150} />
        </div>
      </div>
    </div>
  );
};

export default ThankyouLoader;
