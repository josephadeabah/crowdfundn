import { useAuth } from '@/app/context/auth/AuthContext';
import React from 'react';
import { FiPlus, FiFolder, FiSearch } from 'react-icons/fi';

const EmptyPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <div className="rounded-2xl bg-white p-6 sm:p-8 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-12">
            <div className="rounded-full bg-orange-100 p-6">
              <FiFolder
                className="h-12 w-12 text-orange-400"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                No Fundraisers Yet
              </h1>
              <p className="text-lg text-gray-500">
                Get started by creating your first fundraising or exploring
                available fundraisers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors duration-200 ease-in-out w-full sm:w-auto"
                onClick={() =>
                  (window.location.href = `${user ? '/account/dashboard/create' : '/auth/register'}`)
                }
              >
                <FiPlus className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Create New
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out w-full sm:w-auto"
                onClick={() => console.log('Search items')}
              >
                <FiSearch className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Search
              </button>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 w-full max-w-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;
