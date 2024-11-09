import React from 'react';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '../components/card/Card';
import Image from 'next/image';
import { handleContextMenu } from '../utils/helpers/base64.image';

const DownloadApp = () => {
  return (
    <div className="relative w-full max-w-screen-xl px-3 md:px-2 mx-auto bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-900 dark:to-orange-900 dark:bg-gray-900 dark:text-gray-50 text-gray-700 py-16 overflow-hidden">
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
          <Card className="w-full rounded-none shadow-none border-0">
            <CardContent className="w-full p-0 flex aspect-square items-center justify-center h-full">
              <Image
                src="/marketing4.png"
                alt="Bantu Hive App"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                width={500}
                height={300}
                onContextMenu={handleContextMenu}
              />
            </CardContent>
          </Card>

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
