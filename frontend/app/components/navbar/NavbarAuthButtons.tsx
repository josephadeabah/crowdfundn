'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import SearchBar from '../searchbar/SearchBar';

export const NavbarAuthButtons: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  
    const handleSearchClose = () => {
      setSearchOpen(false);
    };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  return (
    <>
      <div className="mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearchOpen}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="py-1 px-4 bg-white dark:bg-gray-900 dark:text-gray-50 rounded-full focus-visible:outline-none focus:ring-0 hover:outline-none hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300"
      >
        <Link
          href="/auth/register"
          className="text-gray-700 text-sm dark:text-gray-50 focus-visible:outline-none focus:ring-0 hover:outline-none"
        >
          Start A Project
        </Link>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="py-1 px-4 bg-orange-400 rounded-full dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none hover:bg-orange-600 hover:text-gray-700 hover:scale-105 transition-transform duration-300"
      >
        <Link
          href="/auth/login"
          className="text-gray-50 text-sm dark:text-gray-50 focus-visible:outline-none focus:ring-0 hover:outline-none"
        >
          Login
        </Link>
      </motion.button>
      <SearchBar isOpen={searchOpen} onClose={handleSearchClose} />
    </>
  );
};
