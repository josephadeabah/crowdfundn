'use client';
import React, { useState, useEffect } from 'react';
import { FiUsers, FiBarChart, FiAward } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { CarouselPlugin } from './molecules/CarouselPlugin';
import DownloadApp from './molecules/DownloadApp';
import ChatbotComponent from './chatbot/ChatbotComponent';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { useAuth } from './context/auth/AuthContext';
import CampaignCard from './components/campaigns/CampaignCard';
import { useCampaignContext } from './context/account/campaign/CampaignsContext';
import SummaryCardComponent from './molecules/SummaryCard';
import BHScreenKnowHow from './molecules/BHScreenKnowHow';
import IllustrateImageComponent from './molecules/IllustrateImageComponent';

const HomePage = () => {
  const wordRef = React.useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const { user } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();

  // States for sorting and pagination
  const [sortCriteria, setSortCriteria] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  useEffect(() => {
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, sortCriteria, pageNumber, itemsPerPage]);

  React.useEffect(() => {
    const words = [
      "We're Africa's Premier Reward-based & Gamified Crowdfunding Platform",
      'Online Crowdfunding, Personal fundraising, Grant funding',
      'Fundraise for charity, medical bills, disaster relief, education, and more',
      'Fundraise for community projects, social causes and make a difference',
      'Donate to a Cause You Care About with Confidence, Purpose and Ease',
      "We're Happy to Invest in your story",
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
          <div className="absolute inset-0 bg-cover bg-center" />
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
                      className="anim-words flex justify-center items-center w-full p-0 md:p-0"
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
                  <div className="w-full flex flex-row justify-center items-center gap-4 lg:justify-start *:w-full *:px-5 *:py-3 *:text-base *:font-medium *:text-center *:transition *:duration-[250ms] *:ease-in-out lg:*:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-700 text-white sm:px-6 md:px-4 rounded-full text-xs md:text-base font-semibold hover:bg-green-500 hover:scale-105 transition-transform duration-300 whitespace-nowrap"
                    >
                      <a
                        href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
                      >
                        Fundraise Now for Free
                      </a>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-gray-700 dark:bg-gray-950 dark:text-gray-50 sm:px-6 md:px-4 rounded-full text-xs md:text-base font-semibold hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300"
                    >
                      <a href="/how-it-works">How It Works</a>
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
        <SummaryCardComponent />
        <IllustrateImageComponent images={["/Cheer up-bro.png", "/Team-spirit-bro.png", "/Group-bro.png"]} />

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
              className="text-4xl font-bold text-center mb-5"
            >
              Why Choose Us?
            </motion.h2>
            <div className="text-2xl text-gray-300 font-bold text-center mb-7">
              We're Africa's Premier And Most Trusted Reward-based And Gamified
              Crowdfunding Platform
            </div>
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
                    'Donate to a Cause You Care About with Confidence, Purpose, Ease and Fun.',
                  icon: <FaHandHoldingUsd size={80} />,
                },
                {
                  title: 'Rewards & Recognition',
                  description:
                    'Earn recognition, rewards and certifications for your contributions.',
                  icon: <FiAward size={80} />,
                },
                {
                  title: 'Track Your Impact',
                  description:
                    'Monitor campaign to see how your efforts are making a difference.',
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
                  <div className="flex justify-center items-center mb-4">
                    <div className="text-4xl text-orange-400">{item.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div id="projects" className="dark:bg-gray-950 dark:text-gray-50">
        <div className="w-full">
          <h2 className="text-4xl font-bold mb-8 mt-4 text-center">
            Fundraising Now
          </h2>
          <div className="w-full bg-white px-2 py-3">
            <CampaignCard
              campaigns={campaigns}
              loading={loading}
              error={error}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <div id="brands" className="mt-20">
        <BHScreenKnowHow />
      </div>

      <div className="mb-8 text-gray-700 dark:bg-gray-950 dark:text-gray-50">
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
  );
};

export default HomePage;
