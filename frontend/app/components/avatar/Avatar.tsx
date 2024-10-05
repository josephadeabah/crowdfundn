import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

// Define types for Avatar props
interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Define allowed size values
}

const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 'md' }) => {
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
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      tabIndex={0}
      aria-label={`Avatar for ${name || 'User'}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover"
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

const AvatarDemo: React.FC = () => {
  const users = [
    {
      name: 'John Doe',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    { name: 'Jane Smith', imageUrl: '' },
    {
      name: 'Bob Johnson',
      imageUrl:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    { name: 'Alice Brown', imageUrl: '' },
    { name: '', imageUrl: '' },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Avatar Component Demo
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {users.map((user, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar name={user.name} imageUrl={user.imageUrl} size="lg" />
            <p className="mt-2 text-sm text-gray-600">
              {user.name || 'Anonymous User'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarDemo;
