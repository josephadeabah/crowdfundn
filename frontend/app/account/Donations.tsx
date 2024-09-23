import React from 'react';

export default function Donations() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Donations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sample Donation Cards */}
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            John Doe
          </h3>
          <p className="text-gray-600 dark:text-neutral-300">Amount: $500</p>
          <p className="text-gray-500 dark:text-neutral-400">
            Date: Aug 20, 2024
          </p>
          <p className="text-green-500 dark:text-green-400">
            Status: Completed
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            Thank You
          </button>
        </div>

        {/* Additional Donation Cards */}
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Jane Smith
          </h3>
          <p className="text-gray-600 dark:text-neutral-300">Amount: $300</p>
          <p className="text-gray-500 dark:text-neutral-400">
            Date: Aug 18, 2024
          </p>
          <p className="text-green-500 dark:text-green-400">
            Status: Completed
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            Thank You
          </button>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:bg-gray-100 transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Jane Smith
          </h3>
          <p className="text-gray-600 dark:text-neutral-300">Amount: $300</p>
          <p className="text-gray-500 dark:text-neutral-400">
            Date: Aug 18, 2024
          </p>
          <p className="text-green-500 dark:text-green-400">
            Status: Completed
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center hover:bg-red-500 dark:hover:bg-red-700 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            Thank You
          </button>
        </div>

        {/* Add more donation cards as needed */}
      </div>
    </div>
  );
}
