import React from 'react';

interface VerifiedBadgeIconProps {
  color?: string; // Optional color prop for the main icon
  size?: number; // Optional size prop
}

const VerifiedBadgeIcon: React.FC<VerifiedBadgeIconProps> = ({
  color = '#000000', // Default color is the first gradient color
  size = 24, // Default size is 24px
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 385 512.24"
      width={size}
      height={size}
    >
      <defs>
        {/* Define gradients */}
        <linearGradient
          id="a"
          gradientUnits="userSpaceOnUse"
          x1="192.5"
          y1=".03"
          x2="192.52"
          y2="198.14"
        >
          <stop offset="0" stopColor={color} />{' '}
          {/* Use the `color` prop for the first gradient */}
          <stop offset=".541" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient
          id="b"
          gradientUnits="userSpaceOnUse"
          x1="192.5"
          y1=".03"
          x2="192.52"
          y2="357.09"
        >
          <stop offset="0" stopColor={color} />
          <stop offset=".541" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      {/* Paths using gradients */}
      <path
        fill="url(#a)"
        d="M192.5.03c9.05-.4 16.19 2.78 23.39 7.34 9.14 5.8 19.43 17.25 32.13 24.51 17.87 10.22 50.97-3.87 67.92 21.31 3.17 4.72 5.38 9.11 6.93 13.27l-50.33 37.2c-19.23-22.73-47.94-37.17-80.04-37.17-57.88 0-104.79 46.92-104.79 104.79 0 20.8 6.05 40.18 16.5 56.46L59.1 261.42c-2.44-13.23.91-23.97-4.8-37.18-3.56-8.23-18.94-15.46-26.24-28.45-10.71-19.08-6.38-37.38 14.41-64.87 12.55-16.61 14.71-27.9 15.5-40.16.74-11.38 1.21-22.89 11.09-37.57 16.95-25.18 50.05-11.09 67.91-21.31 12.71-7.26 23-18.71 32.14-24.51 7.2-4.56 14.34-7.74 23.39-7.34zM195.38 116l15.34 35.92 38.9 3.49c2.76.24 3.84 3.66 1.79 5.46l-29.43 25.7 8.71 38.09c.62 2.76-2.45 4.84-4.76 3.31l-33.43-19.98-33.54 20.05c-2.38 1.43-5.25-.75-4.65-3.38l8.71-38.09-29.44-25.7c-2.12-1.86-.87-5.31 1.89-5.47l38.8-3.48 15.35-35.94c1.09-2.56 4.72-2.49 5.76.02z"
      />
      <path
        fill="url(#b)"
        d="M322.87 66.48c3.04 8.01 3.6 15.84 4.16 24.28.79 12.26 2.95 23.55 15.49 40.16 20.79 27.49 25.13 45.79 14.42 64.87-7.3 12.99-22.69 20.22-26.24 28.45-7.57 17.53.8 30.73-9.57 51.16-7.19 14.16-18.3 23.49-33.08 28.26-12.48 4.02-24.99-1.8-34.98 2.41-17.54 7.37-30.48 24.5-44.45 28.84-5.38 1.67-10.76 2.49-16.12 2.46-5.36.03-10.74-.79-16.12-2.46-13.97-4.34-26.91-21.47-44.45-28.84-9.99-4.21-22.5 1.61-34.98-2.41-14.78-4.77-25.89-14.1-33.08-28.26-2.35-4.59-3.92-9.3-4.84-14.35l45.17-33.31c18.63 29.07 51.21 48.34 88.3 48.34 57.88 0 104.79-46.92 104.79-104.8 0-25.79-9.32-49.4-24.78-67.66l50.36-37.14z"
      />
      <path
        fill="#242424"
        d="m14.14 471.35 48.18-8.64 23.89 42.76c17.32 21.46 28.33-13.83 33.17-26.13l46.47-87.67c-10.73-3.69-23.62-14.43-36.91-26.45-26.47.55-51.13-4.04-69.28-27.16L6.24 441.25l-4.64 9.91c-3.64 12.87-1.72 21.38 12.54 20.19zm356.72 0-48.18-8.64-23.89 42.76c-17.32 21.46-28.33-13.83-33.17-26.13l-46.47-87.67c10.73-3.69 23.62-14.43 36.91-26.45 26.47.55 51.13-4.04 69.28-27.16l53.42 103.19 4.64 9.91c3.64 12.87 1.72 21.38-12.54 20.19z"
      />
    </svg>
  );
};

export default VerifiedBadgeIcon;
