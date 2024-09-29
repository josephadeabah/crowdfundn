'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoaderBubble = ({ delay }: { delay: number }) => (
  <motion.div
    className="w-4 h-4 bg-gradient-to-r from-gray-300 to-gray-600 rounded-full shadow-sm"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

export const LoaderInner = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white z-50"
      aria-label="Loading"
    >
      <div className="p-8 bg-white backdrop-filter backdrop-blur-sm">
        <div className="flex space-x-4">
          <LoaderBubble delay={0} />
          <LoaderBubble delay={0.2} />
          <LoaderBubble delay={0.4} />
        </div>
      </div>
    </div>
  );
};

export const LoaderOuter = () => {
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">
            An error occurred while loading. Please try again.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
              className="w-4 h-4 bg-gradient-to-r from-red-400 to-indigo-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.15}s`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-gray-700 text-center">Loading...</p>
      </div>
    </div>
  );
};
