'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/auth/AuthContext';
import { getMarkdownContent } from '@/app/utils/helpers/getMarkdownContent';

export default function HowToGetStarted() {
  const { user } = useAuth();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    async function fetchContent() {
      const markdownContent = await getMarkdownContent('how-to-get-started.md');
      setContent(markdownContent);
    }

    fetchContent();
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        How to Get Started with Bantuhive
      </h1>

      <section className="bg-white p-12 rounded-lg mb-16">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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
}
