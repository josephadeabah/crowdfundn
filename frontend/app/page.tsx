'use client';
import data from '../data.json';
import React, { useState, useEffect } from 'react';
import { FiUsers, FiActivity, FiBarChart, FiAward } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { CarouselPlugin } from './molecules/CarouselPlugin';
import { Badge } from './components/badge/Badge';
import Progress from './components/progressbar/ProgressBar';
import { BrandsLogoSlider } from './molecules/BrandsLogoSlider';
import FAQsPage from './molecules/faqs';
import DownloadApp from './molecules/DownloadApp';
import CTa from './molecules/CTA';
import ChatbotComponent from './chatbot/ChatbotComponent';
import Link from 'next/link';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { useAuth } from './context/auth/AuthContext';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const wordRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const { user, token, logout } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  React.useEffect(() => {
    const words = [
      'Fundraise Like a Boss',
      'Donate Like the World is Ending',
      'Crowdfunding Solutions for Africa Innovators',
      'Uniting Communities Through Social Change',
      'Transforming Ideas into Action Across Continents',
      'Championing Local Causes with Global Support',
    ];

    let part = '';
    let i = 0;
    let offset = 0;
    const len = words.length;
    let forwards = true;
    let skip_count = 0;
    const skip_delay = 15;
    const speed = 70;
    const updateWord = () => {
      if (forwards) {
        if (offset >= words[i].length) {
          skip_count++;
          if (skip_count === skip_delay) {
            forwards = false;
            skip_count = 0;
          }
        }
      } else {
        if (offset === 0) {
          forwards = true;
          i++;
          offset = 0;
          if (i >= len) {
            i = 0;
          }
        }
      }
    };
    const updatePart = () => {
      part = words[i].substring(0, offset);
      if (skip_count === 0) {
        offset += forwards ? 1 : -1;
      }
      if (wordRef.current) {
        wordRef.current.textContent = part;
      }
    };
    const wordflick = () => {
      setInterval(() => {
        updateWord();
        updatePart();
      }, speed);
    };

    wordflick();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="text-gray-700 dark:text-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            // style={{
            //   backgroundImage:
            //     "url('https://images.unsplash.com/photo-1534951009808-766178b47a4f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            //   filter: 'brightness(0.4)',
            // }}
          />
          <motion.div
            variants={fadeIn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full relative text-center"
          >
            <div className="flex-grow flex flex-col justify-center items-center text-gray-800  dark:text-gray-50 dark:bg-gray-800 mx-auto w-full pt-1">
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <div className="p-4 sm:w-1/2">
                  <h1 className="text-4xl md:text-7xl">
                    <div
                      className="anim-words flex justify-center items-center w-full p-4 md:p-8"
                      style={{ height: '250px' }}
                    >
                      <h1
                        className="word text-center text-2xl text-gray-700 dark:text-gray-50 md:text-4xl lg:text-5xl font-bold"
                        ref={wordRef}
                      >
                        .
                      </h1>
                    </div>
                  </h1>
                  <div className="w-full flex flex-row justify-center items-center gap-4  lg:justify-start *:w-full *:px-5 *:py-3 *:text-base *:font-medium *:text-center *:transition *:duration-[250ms] *:ease-in-out lg:*:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-500 hover:scale-105 transition-transform duration-300 "
                    >
                      <a
                        href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
                      >
                        Fundraise Now
                      </a>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-50 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300 "
                    >
                      <a href="/faqs">Learn More</a>
                    </motion.button>
                  </div>
                </div>

                <div className="sm:w-1/2">
                  <CarouselPlugin />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          ref={ref}
          className="py-20 bg-white dark:bg-gray-800 dark:text-gray-50"
        >
          <div className="px-4">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Why Choose Us?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Raise Money with No Stress',
                  description:
                    'We take care of everything so you can focus on your mission.',
                  icon: <FiUsers size={80} />,
                },
                {
                  title: 'Back a Cause and Make a Difference',
                  description:
                    'Donate to a Cause You Care About with Confidence, Purpose and Ease.',
                  icon: <FaHandHoldingUsd size={80} />,
                },
                {
                  title: 'Rewards & Recognition',
                  description:
                    'Earn recognition and rewards for your contributions.',
                  icon: <FiAward size={80} />,
                },
                {
                  title: 'Track Your Impact',
                  description:
                    'Monitor campaign analytics to see how your efforts are making a difference.',
                  icon: <FiBarChart size={80} />,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="hidden"
                  animate={controls}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-950 dark:text-gray-50 p-6 rounded-lg text-center hover:bg-white transition-colors duration-300"
                >
                  <div className="text-4xl text-orange-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50">
          <div className="mx-auto">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-12 text-gray-700 dark:text-gray-50"
            >
              Featured Projects
            </motion.h2>

            {/* Parent grid for Categories and Recommended Fundraisers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Categories Section */}
              <div className="w-full flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4 p-2 justify-start">
                  {data.categories.map((category) => (
                    <Badge
                      key={category.value}
                      className={`cursor-pointer transform hover:scale-105 transition-transform duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-orange-400 text-white'
                          : 'text-gray-800 dark:bg-slate-950 dark:text-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.value)}
                      variant="default"
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommended Fundraisers Section */}
              <div className="w-full flex flex-col gap-4 sm:flex-row">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
                  {data?.recommendedFundraisers?.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      variants={fadeInUp}
                      initial="hidden"
                      animate={controls}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                      <Link href={`/campaign/fundraiser/${campaign.id}`}>
                        <div
                          key={campaign.id}
                          className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          <img
                            src={campaign?.image}
                            alt={campaign?.name}
                            className="mb-2 object-cover h-32 w-full"
                          />
                          <div className="px-1">
                            <div className="flex-grow">
                              <h3 className="text-lg font-bold">
                                {campaign?.name}
                              </h3>
                              <p className="text-sm">{campaign?.description}</p>
                            </div>
                            <div className="w-full text-xs">
                              <Progress
                                firstProgress={33}
                                firstTooltipContent={`Performance: ${33}%`}
                              />
                            </div>
                            <p className="flex justify-between items-center text-sm font-semibold mt-2">
                              {campaign?.amountRaised}{' '}
                              <span className="font-normal">raised</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CTa />
      </main>

      <div className="bg-white text-gray-700 dark:bg-gray-950 dark:text-gray-50 min-h-screen">
        <main>
          <div
            id="projects"
            className="py-16 bg-white dark:bg-gray-950 dark:text-gray-50"
          >
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">
                Featured Projects
              </h2>
              <div className="w-full flex flex-col gap-4 sm:flex-row">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
                  {data.recommendedFundraisers.map((campaign, index) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                      <Link href={`/campaign/fundraiser/${campaign.id}`}>
                        <div
                          key={campaign.id}
                          className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          <img
                            src={campaign.image}
                            alt={campaign.name}
                            className="mb-2 object-cover h-32 w-full"
                          />
                          <div className="p-2">
                            <div className="flex-grow">
                              <h3 className="text-lg font-bold">
                                {campaign.name}
                              </h3>
                              <p className="text-sm">{campaign.description}</p>
                            </div>
                            <div className="w-full text-xs">
                              <Progress
                                firstProgress={13}
                                firstTooltipContent={`Performance: ${13}%`}
                              />
                            </div>
                            <p className="flex justify-between items-center text-sm font-semibold mt-2">
                              {campaign.amountRaised}{' '}
                              <span className="font-normal">raised</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
                  {data.recommendedFundraisers.map((campaign) => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 2 * 0.2 }}
                      className="bg-white flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                      <Link href={`/campaign/fundraiser/${campaign.id}`}>
                        <div
                          key={campaign.id}
                          className="flex flex-col h-full dark:bg-gray-800 dark:text-gray-50 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                          <img
                            src={campaign.image}
                            alt={campaign.name}
                            className="mb-2 object-cover h-32 w-full"
                          />
                          <div className="px-1">
                            <div className="flex-grow">
                              <h3 className="text-lg font-bold">
                                {campaign.name}
                              </h3>
                              <p className="text-sm">{campaign.description}</p>
                            </div>
                            <div className="w-full text-xs">
                              <Progress
                                firstProgress={13}
                                firstTooltipContent={`Performance: ${13}%`}
                              />
                            </div>
                            <p className="flex justify-between items-center text-sm font-semibold mt-2">
                              {campaign.amountRaised}{' '}
                              <span className="font-normal">raised</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <FAQsPage />
        <DownloadApp />
        <div id="brands">
          <BrandsLogoSlider />
        </div>

        <div>
          <ChatbotComponent />
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 bg-orange-400 text-white p-3 rounded-full shadow-lg hover:bg-orange-500 transition duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
