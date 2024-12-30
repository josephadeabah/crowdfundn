import { FiHome, FiHelpCircle } from 'react-icons/fi';

const Community = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Oops! Community Page Unavailable
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          The community page you're looking for is temporarily unavailable.
          Please check back later.
        </p>
        <div className="mt-6 space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-blue-400 dark:bg-blue-500 hover:bg-blue-300 dark:hover:bg-blue-400 rounded-lg"
            onClick={() => (window.location.href = '/')}
          >
            <FiHome className="mr-2" />
            Go to Home
          </button>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-green-400 dark:bg-green-500 hover:bg-green-300 dark:hover:bg-green-400 rounded-lg"
            onClick={() => (window.location.href = '/about-us')}
          >
            <FiHelpCircle className="mr-2" />
            Learn More About Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
