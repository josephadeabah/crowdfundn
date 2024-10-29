import { useState } from 'react';
import { FiHome, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const ErrorPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl p-8 md:p-12 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] shadow-lg">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-green-500 to-green-300"></div>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <FiAlertCircle
              className="text-orange-400 w-24 h-24 md:w-32 md:h-32 animate-pulse"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-3">
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900"
              aria-label="Error Occurred"
            >
              Oops! An Error Occurred
            </h1>
            <p className="text-gray-500 max-w-md">
              We're sorry! Something went wrong. Please try again later or
              navigate back to the homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
            <button
              onClick={handleHomeClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 focus:ring-4 focus:ring-orange-200 focus:outline-none"
              aria-label="Return to homepage"
            >
              <FiHome className="w-5 h-5" />
              Back to Home
            </button>

            <button
              onClick={handleReload}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 focus:ring-4 focus:ring-gray-200 focus:outline-none"
              aria-label="Reload page"
            >
              <FiRefreshCw className="w-5 h-5" />
              Reload Page
            </button>
          </div>

          <div className="mt-8">
            <p className="text-gray-400">
              If the problem persists, please contact support at{' '}
              <a
                href="mailto:support@example.com"
                className="text-gray-600 hover:underline"
              >
                support@example.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="200" cy="200" r="200" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
