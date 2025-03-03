'use client';
import React, { useState, useEffect } from 'react';
import { FiUsers, FiBarChart, FiAward } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import UIkit from 'uikit';
import 'uikit/dist/css/uikit.min.css';
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
import BlogPosts from './components/blogs/BlogPosts';

const HomePage = () => {
  const wordRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const { campaigns, loading, error, fetchAllCampaigns } = useCampaignContext();
  const [sortCriteria, setSortCriteria] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    fetchAllCampaigns(sortCriteria, sortOrder, pageNumber, itemsPerPage);
  }, [fetchAllCampaigns, sortCriteria, pageNumber, itemsPerPage]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

    // Function to handle page change
    const handlePageChange = (page: number) => {
      setPageNumber(page);
    };

  return (
    <div className="text-gray-700 dark:text-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto">
        <div className="uk-position-relative uk-light" data-uk-parallax="bgy: -200">
          <div className="uk-cover-container uk-height-large">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-full relative text-center"
            >
              <div className="flex-grow flex flex-col justify-center items-center mx-auto w-full pt-1">
                <h1 ref={wordRef} className="text-4xl md:text-7xl font-bold"></h1>
                <div className="flex gap-4 mt-4">
                  <motion.button className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-500">
                    <a href={user ? '/account/dashboard/create' : '/auth/register'}>Fundraise Now</a>
                  </motion.button>
                  <motion.button className="bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-100">
                    <a href="/how-it-works">How It Works</a>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="uk-section uk-section-muted" data-uk-parallax="bgy: -100">
          <SummaryCardComponent />
          <IllustrateImageComponent images={[
            '/Cheer-up-bro.svg',
            '/heart-with-a-little-bow-svgrepo-com.png',
            '/Team-spirit-bro.svg',
          ]} />
        </div>

        <div ref={ref} className="py-20 bg-white dark:bg-gray-800">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-5"
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ title: 'Raise Money', icon: <FiUsers size={80} /> },
              { title: 'Support a Cause', icon: <FaHandHoldingUsd size={80} /> },
              { title: 'Get Rewards', icon: <FiAward size={80} /> },
              { title: 'Track Impact', icon: <FiBarChart size={80} /> }
            ].map((item, index) => (
              <motion.div key={index} className="p-6 bg-gray-50 dark:bg-gray-950 rounded-lg text-center">
                <div className="text-4xl text-orange-400">{item.icon}</div>
                <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="projects" className="max-w-7xl mx-auto dark:bg-gray-950 mt-10">
          
        <CampaignCard
          campaigns={campaigns}
          loading={loading}
          error={error}
          onPageChange={handlePageChange}
        />
        </div>
      </main>

      <div id="brands" className="mt-20">
        <BHScreenKnowHow />
      </div>
      <div className="w-full bg-white p-4">
        <BlogPosts />
      </div>

      <div className="mb-8">
        <ChatbotComponent />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          className="fixed bottom-8 right-8 bg-orange-400 text-white p-3 rounded-full"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
