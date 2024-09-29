import React, { useEffect, useState } from 'react';
import {
  FaHandHoldingHeart,
  FaPeopleCarry,
  FaShieldAlt,
  FaTrophy,
  FaRecycle,
  FaHandHoldingUsd,
} from 'react-icons/fa';

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
  <div className="bg-gray-50 dark:bg-gray-700 dark:text-gray-50 rounded-lg p-2 mb-8 transform hover:scale-105 transition-transform duration-300">
    <Icon className="text-4xl text-orange-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
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
      description: (
        <div>
          Keep donors engaged with leaderboards, badges, rewards, and
          recognition for recurring support.
          <img
            src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="#"
            className="w-full h-fit object-cover rounded-t-3xl rounded-l-none rounded-r-none"
          />
        </div>
      ),
    },
    {
      icon: FaRecycle,
      title: 'Recurring Revenue & Subscription Features',
      description: (
        <div>
          Unique subscription-based features that allow for recurring donations
          to support ongoing causes or businesses.
          <img
            src="https://images.unsplash.com/photo-1621290558526-c65419de6279?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="#"
            className="w-full h-fit object-cover rounded-t-3xl rounded-l-none rounded-r-none"
          />
        </div>
      ),
    },
    {
      icon: FaHandHoldingUsd,
      title: 'Dedicated Support Team',
      description: (
        <div>
          Keep donors engaged with leaderboards, badges, rewards, and
          recognition for recurring support.
          <img
            src="https://images.unsplash.com/photo-1630673618876-be46d2722d85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="#"
            className="w-full h-fit object-cover rounded-t-3xl rounded-l-none rounded-r-none"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div
          className="text-center mb-3 px-4 sm:px-6 lg:px-8"
          style={{
            transform: `translateY(${scrollY * (window.innerWidth < 640 ? 0 : -0.06)}px)`,
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
            Discover BantuHive
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Empowering African communities through innovative donation and
            fundraising
          </p>
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
            className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-orange-700 hover:to-orange-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Join BantuHive Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cta;
