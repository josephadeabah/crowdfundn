import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Define allowed size values
}

const Avatar: React.FC<AvatarProps> = ({ name='User', imageUrl, size = 'md' }) => {
  const [initials, setInitials] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');

  useEffect(() => {
    if (name) {
      const nameInitials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
      setInitials(nameInitials.slice(0, 2));
      setBgColor(generateColor(nameInitials));
    }
  }, [name]);

  const generateColor = (str: string): string => {
    // Combine all colors: Rainbow, Primary, Secondary, Tertiary, Complementary, Vibrant, and Neutral
    const colors = [
      // Rainbow colors
      '#FF0000', // Red
      '#FF7F00', // Orange
      '#FFFF00', // Yellow
      '#00FF00', // Green
      '#0000FF', // Blue
      '#4B0082', // Indigo
      '#8B00FF', // Violet

      // Additional vibrant colors
      '#FF1493', // Deep Pink
      '#00CED1', // Dark Turquoise
      '#FFD700', // Gold
      '#ADFF2F', // Green Yellow

      // Primary colors
      '#FF0000', // Red
      '#00FF00', // Green
      '#0000FF', // Blue

      // Secondary colors
      '#FFFF00', // Yellow
      '#FF7F00', // Orange
      '#8B00FF', // Violet

      // Tertiary colors
      '#FF1493', // Deep Pink
      '#FFD700', // Gold
      '#ADFF2F', // Green Yellow
      '#00CED1', // Dark Turquoise
      '#4B0082', // Indigo
      '#8A2BE2', // Blue Violet

      // Complementary colors
      '#FF4500', // Orange Red
      '#32CD32', // Lime Green
      '#1E90FF', // Dodger Blue
      '#FF6347', // Tomato
      '#7FFF00', // Chartreuse
      '#6A5ACD', // Slate Blue

      // Neutral tones
      '#708090', // Slate Gray
      '#2F4F4F', // Dark Slate Gray
      '#D2691E', // Chocolate
      '#A52A2A', // Brown
      '#5F9EA0', // Cadet Blue
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length; // Ensures consistent indexing
    return colors[colorIndex];
  };

  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400`}
      tabIndex={0}
      role="img"
      aria-label={`Avatar for ${name || 'User'}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl === "" ? '/avatar-default1.png' : imageUrl}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : initials ? (
        <div
          className="w-full h-full flex items-center justify-center font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${bgColor}, ${adjustColor(
              bgColor,
              -20,
            )})`,
          }}
        >
          {initials}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <FaUser
            className="text-gray-400"
            size={parseInt(sizeClasses[size].split(' ')[0].slice(2))}
          />
        </div>
      )}
    </div>
  );
};

const adjustColor = (color: string, amount: number): string => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).slice(-2),
      )
  );
};

export default Avatar;
