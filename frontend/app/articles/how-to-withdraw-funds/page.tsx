"use client";

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/auth/AuthContext';

export default async function HowToWithdrawFunds() {
  const { user } = useAuth();
  // Path to the markdown file
  const markdownFilePath = path.join(
    process.cwd(),
    'public',
    'content',
    'how-to-withdraw-funds.md',
  );

  // Read the markdown file
  const fileContent = fs.readFileSync(markdownFilePath, 'utf-8');

  // Parse the markdown content to HTML using remark
  const processedContent = await remark().use(html).process(fileContent);

  // Convert buffer to string
  const content = processedContent.toString();

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        How to Withdraw Funds
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
