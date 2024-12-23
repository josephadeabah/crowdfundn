"use client";

import CategoryList from '@/app/components/categories/CategoryList';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const CategoryListPage: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50">
        <div className="mx-auto">
          <motion.h4
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-8 text-gray-700 dark:text-gray-50"
          >
            Explore Campaigns in Categories
          </motion.h4>
          <div className="">
            <CategoryList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;
