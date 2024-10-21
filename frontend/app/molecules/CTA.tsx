import React, { useEffect, useState } from 'react';
import {
  FaHandHoldingHeart,
  FaPeopleCarry,
  FaShieldAlt,
  FaTrophy,
  FaRecycle,
  FaHandHoldingUsd,
} from 'react-icons/fa';
import data from '../../data.json';

interface ParallaxCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: React.ReactNode;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-50 rounded-lg p-4 mt-5 mb-8 transform hover:scale-105 transition-transform duration-300">
    <Icon className="text-4xl text-orange-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-800 dark:text-gray-200">{description}</p>
  </div>
);

const Cta = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxCards = [
    {
      icon: FaHandHoldingHeart,
      title: 'Diaspora-Focused Donations',
      description:
        'Empowering Africans abroad to invest back into their home communities and support local businesses.',
    },
    {
      icon: FaPeopleCarry,
      title: 'Community-Centric Approach',
      description:
        'Creating a hive where communities can support each other and see tangible results.',
    },
    {
      icon: FaShieldAlt,
      title: 'Transparency & Trust',
      description:
        'We use state-of-the-art technology to ensure transparency in donations and fraud prevention.',
    },
    {
      icon: FaTrophy,
      title: 'Gamified Donor Engagement',
      description:
        'Keep donors engaged with leaderboards, badges, rewards, and recognition for recurring support.',
    },
    {
      icon: FaRecycle,
      title: 'Recurring Revenue & Subscription Features',
      description:
        'Unique subscription-based features that allow for recurring donations to support ongoing causes or businesses.',
    },
    {
      icon: FaHandHoldingUsd,
      title: 'Dedicated Support Team',
      description:
        'Keep donors engaged with leaderboards, badges, rewards, and recognition for recurring support.',
    },
  ];

  return (
    <div className="w-full rounded-3xl my-3 bg-white text-gray-50 dark:bg-gray-900 dark:text-gray-50">
      <div className="mx-auto">
        <div className="text-center mb-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-green-700 mb-4">
            Discover BantuHive
          </h1>
          <p className="text-lg sm:text-xl italics text-gray-700 max-w-3xl mx-auto">
            Empowering African communities through innovative donation and
            fundraising
          </p>
          <h1 className="m-4 text-4xl md:text-5xl text-gray-800 dark:text-gray-50 py-6 font-semibold">
            {data.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parallaxCards.map((card, index) => (
            <div key={index}>
              <ParallaxCard {...card} />
            </div>
          ))}
        </div>

        <div
          className="mt-16 text-center"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        >
          <a
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-700 hover:to-green-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Join BantuHive Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cta;
