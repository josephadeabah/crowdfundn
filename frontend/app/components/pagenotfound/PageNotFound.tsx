import React from 'react';
import { FiSearch, FiHome, FiHelpCircle } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 sm:p-8 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-12">
            <div className="rounded-full bg-red-100 dark:bg-red-600 p-6">
              <FiSearch
                className="h-12 w-12 text-red-400 dark:text-red-300"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Sorry, the page you're looking for doesn't exist, or it's
                temporarily unavailable.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Our team is working to bring it back online soon. In the
                meantime, you can return to the homepage or explore some of our
                other resources.
              </p>
            </div>

            <div className="w-full mx-auto max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-400 dark:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-300 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 ease-in-out w-full sm:w-auto"
                  onClick={() => (window.location.href = '/')}
                >
                  <FiHome className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                  Go to Home
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-green-400 dark:bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-300 dark:hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors duration-200 ease-in-out w-full sm:w-auto"
                  onClick={() => (window.location.href = '/about-us')}
                >
                  <FiHelpCircle
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Learn More About Us
                </button>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 w-full max-w-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
