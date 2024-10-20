import React from 'react';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DownloadApp = () => {
  return (
    <div className="relative w-full max-w-screen-xl px-3 md:px-0 mx-auto bg-white dark:bg-gray-700 dark:text-gray-50 text-gray-700 py-16 overflow-hidden">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 text-gray-700 dark:text-gray-50 mb-8 lg:mb-0"
        >
          <h1>Launching Soon</h1>
          <p className="text-xl mb-6">
            Get ready for an amazing experience! Our app will be available soon
            on Google Play Store and App Store.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-orange-400 font-semibold py-3 px-6 rounded-full shadow transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          >
            <Link href="/contactus">Notify Me on Launch</Link>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 relative"
        >
          <img
            src="https://images.unsplash.com/photo-1655947715189-e7edcae154cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Smiling man holding a phone"
            className="rounded-lg max-w-full h-auto"
          />
          <div className="absolute bottom-4 left-4 flex space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-black bg-opacity-70 p-2 rounded-lg"
            >
              <FaGooglePlay className="text-white text-3xl" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-black bg-opacity-70 p-2 rounded-lg"
            >
              <FaApple className="text-white text-3xl" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadApp;
