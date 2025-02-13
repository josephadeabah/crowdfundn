import React from 'react';

interface VerifiedBadgeIconProps {
  color?: string; // Optional color prop
  size?: number; // Optional size prop
}

const VerifiedBadgeIcon: React.FC<VerifiedBadgeIconProps> = ({
  color = '#000000', // Default color is black
  size = 24, // Default size is 24px
}) => {
  return (
    <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Medal Circle */}
    <circle cx="32" cy="32" r="28" fill={color} stroke="#B8860B" strokeWidth="2" />
    <circle cx="32" cy="32" r="24" fill="white" />

    {/* Ribbon */}
    <path
      d="M16 48L32 64L48 48"
      stroke="#B8860B"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M32 64V48"
      stroke="#B8860B"
      strokeWidth="2"
      fill="none"
    />

    {/* Star at the center of the medal */}
    <polygon
      points="32,15 34,23 42,23 35,28 37,36 32,31 27,36 29,28 22,23 30,23"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="1"
    />

    {/* Medal Shine Effect */}
    <circle cx="32" cy="16" r="6" fill="white" opacity="0.3" />
  </svg>
  );
};

export default VerifiedBadgeIcon;
