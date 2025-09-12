// app/blog/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiExternalLink, FiLoader, FiArrowLeft } from 'react-icons/fi';

export default function BlogPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to PNPM Media blog after a brief delay to show the loading state
    const timer = setTimeout(() => {
      window.location.href = 'https://www.pnpmmedia.com/';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FiExternalLink className="text-white text-2xl" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Taking you to our Blog
          </h1>
          
          <p className="text-gray-600 mb-6">
            You're being redirected to our official blog at PNPM Media, where we share the latest news, updates, and insights from BantuHive.
          </p>
          
          <div className="flex flex-col space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex justify-center"
            >
              <FiLoader className="text-blue-600 text-2xl" />
            </motion.div>
            
            <div className="text-sm text-blue-600 mb-4">
              Redirecting to pnpmmedia.com...
            </div>
            
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft />
              <span>Go back</span>
            </button>
            
            <div className="mt-4">
              <a
                href="https://www.pnpmmedia.com/"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = 'https://www.pnpmmedia.com/';
                }}
              >
                Click here if you are not redirected automatically
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              BantuHive's official blog is hosted on PNPM Media. Here you'll find:
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• Industry insights and analysis</li>
              <li>• Company updates and announcements</li>
              <li>• Success stories from our community</li>
              <li>• Tips for fundraisers and investors</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}