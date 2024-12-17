'use client';

import React, { useEffect, useState } from 'react';

const ThankYouPage: React.FC = () => {
  const [bubbles, setBubbles] = useState<number[]>([]);

  // Define rainbow colors
  const rainbowColors = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#9400D3', // Violet
  ];

  // Generate bubbles when the component mounts
  useEffect(() => {
    const bubbleCount = 30; // Total number of bubbles
    const bubblesArray = Array.from({ length: bubbleCount }, (_, i) => i);
    setBubbles(bubblesArray);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-900 text-center">
      {/* Celebration Bubbles */}
      {bubbles.map((_, index) => {
        const randomColor =
          rainbowColors[Math.floor(Math.random() * rainbowColors.length)];

        return (
          <div
            key={index}
            className="absolute rounded-full opacity-75"
            style={{
              backgroundColor: randomColor,
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}vw`,
              animation: `bubbleAnimation ${Math.random() * 4 + 3}s ease-in infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        );
      })}

      {/* Thank You Message */}
      <div className="z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
          Thank You for Your Generous Donation!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
          Your contribution means the world to us and will help make a
          difference.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYouPage;
