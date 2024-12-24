'use client';
import { Button } from '@/app/components/button/Button';
import { useAuth } from '@/app/context/auth/AuthContext';
import { motion } from 'framer-motion';
import React from 'react';

const WhoCanFundraise = () => {
  const { user } = useAuth();
  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        Who Can Fundraise on BantuHive?
      </h1>

      <section className="bg-white p-12 rounded-lg shadow-sm mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          1. Entrepreneurs & Startups
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Are you an entrepreneur with a groundbreaking idea? Do you have a
          startup or business in its early stages that needs funding to grow?
          BantuHive is the perfect platform for African entrepreneurs to raise
          capital, gain visibility, and connect with investors and supporters
          who believe in their vision.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          2. Nonprofits & Community Initiatives
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Whether you're working on social impact projects, building community
          initiatives, or running a nonprofit, BantuHive gives you the
          opportunity to fundraise for causes that matter most. You can bring
          your mission to life, connect with donors, and create a lasting impact
          on African communities.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          3. Students & Educational Campaigns
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Are you a student looking for funds to further your education? Or do
          you represent an educational cause in need of financial support?
          BantuHive allows students and educational organizations to raise funds
          for tuition, scholarships, research, and other academic-related
          expenses.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          4. Artists, Creators, and Innovators
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Whether you're an artist looking to fund your next project, a musician
          needing resources for an album, or an innovator developing new
          solutions, BantuHive supports creative and innovative individuals
          seeking funding for their ventures. Let the African community help
          bring your artistic and innovative ideas to life.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          5. Individuals in Need of Personal Support
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Life can sometimes present unexpected financial burdens. If you or
          someone you know is facing challenges due to medical bills,
          emergencies, or personal crises, BantuHive provides a platform where
          people can come together to help fund personal causes and bring relief
          to those in need.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          6. Social Movements and Activists
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Social movements seeking to create change and activists striving for
          justice and equality can use BantuHive to gather support for their
          causes. Whether it's a campaign for political reform, community
          rights, or environmental advocacy, our platform allows you to raise
          funds and rally people behind your cause.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          7. Diaspora and Global Network of Fundraisers
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          If you're part of the African diaspora, you can fundraise for projects
          back home or for individuals in your community. BantuHive connects
          people from all over the world to fund projects that have a positive
          impact on Africa. Diasporans can play an important role in supporting
          African initiatives from abroad.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          8. Corporations and Business Sponsors
        </h2>
        <p className="text-lg leading-8 text-gray-700 mb-6">
          Corporations and businesses seeking to sponsor or support causes,
          initiatives, or social projects can also fundraise through BantuHive.
          You can contribute to Africa's future while gaining visibility and
          making a meaningful difference in communities across the continent.
        </p>
      </section>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-gray-700 dark:bg-gray-950 dark:text-gray-50 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300 "
        >
          <a href={`${user ? '/account/dashboard/create' : '/auth/register'}`}>
            Start Fundraising Now
          </a>
        </motion.button>
      </div>
    </div>
  );
};

export default WhoCanFundraise;
