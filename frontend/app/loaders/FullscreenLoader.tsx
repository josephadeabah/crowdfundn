'use client';
import { useState, useEffect } from 'react';

const FullscreenLoader = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">
            An error occurred while loading. Please try again.
          </p>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setError(false)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white z-50"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-white p-8">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.15}s`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullscreenLoader;
