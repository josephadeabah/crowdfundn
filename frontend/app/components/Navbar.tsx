'use client';

import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../components/popover/Popover';
import DarkModeBtn from './DarkModeBtn';
import { Button } from './button/Button';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HamburgerMenuIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Avatar from '@/app/components/avatar/Avatar';
import { useAuth } from '@/app/context/auth/AuthContext';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const { user, token, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY || window.scrollY <= 100);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const dropdownLinks = {
    fundraise: [
      // New combined category
      { label: 'Start Your Campaign', href: '/individuals/start-campaign' },
      {
        label: 'Personal Fundraising',
        href: '/individuals/personal-fundraising',
      },
      { label: 'Support Local Businesses', href: '/individuals/support-local' },
      {
        label: 'Non-Profit Initiatives',
        href: '/charities/non-profit-initiatives',
      },
      {
        label: 'Community Development Projects',
        href: '/charities/community-development',
      },
      {
        label: 'Education & Health Funding',
        href: '/charities/education-health',
      },
    ],
    donate: [
      { label: 'One-Time Donation', href: '/donate/one-time' },
      { label: 'Monthly Support', href: '/donate/monthly' },
      {
        label: 'Sponsor an Entrepreneur',
        href: '/donate/sponsor-entrepreneur',
      },
      { label: 'Crisis Relief Fund', href: '/donate/crisis-relief' },
      { label: 'Impact Investing', href: '/donate/impact-investing' },
      {
        label: 'Support Community Projects',
        href: '/donate/community-projects',
      },
      {
        label: 'Fundraising Tips for NGOs',
        href: '/how-to/fundraising-tips-ngos',
      },
      { label: 'Corporate Giving Programs', href: '/how-to/corporate-giving' },
      {
        label: 'Fundraising Ideas for Africa',
        href: '/how-to/fundraising-ideas-africa',
      },
    ],
    'for Diaspora': [
      { label: 'Cultural Events', href: '/african-diaspora/cultural-events' },
      { label: 'Diaspora Support', href: '/african-diaspora/diaspora-support' },
      {
        label: 'Networking Opportunities',
        href: '/african-diaspora/networking',
      },
      {
        label: 'Fundraising Campaigns',
        href: '/african-diaspora/fundraising-campaigns',
      },
      { label: 'Donation Drives', href: '/african-diaspora/donation-drives' },
      {
        label: 'Community Projects',
        href: '/african-diaspora/community-projects',
      },
      { label: 'Volunteer Opportunities', href: '/african-diaspora/volunteer' },
    ],
  };

  return (
    <header
      className={`bg-gray-50 dark:bg-gray-950 sticky top-0 z-50 transition-transform duration-300 ease-in-out hover:text-gray-50 focus:ring-0 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="w-full max-w-screen-xl mx-auto  text-gray-800 dark:bg-gray-950 dark:text-gray-50">
        <div className="relative flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-orange-500"
          >
            <a href="/">
              <img
                src="/bantuhive.svg"
                alt="Bantuhive Logo"
                className="w-24 h-auto"
              />
            </a>
          </motion.div>

          <div className="hidden lg:flex items-center gap-x-2 mx-6">
            {Object.entries(dropdownLinks).map(([key, links]) => (
              <Popover key={key} open={activePopover === key}>
                <PopoverTrigger
                  asChild
                  onMouseEnter={() => setActivePopover(key)}
                  onMouseLeave={() => setActivePopover(null)}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center text-gray-700 dark:text-gray-50 group focus:outline-none focus-visible:outline-none  focus:ring-0 focus-visible:ring-0 hover:outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    <TriangleDownIcon className="ml-2 h-4 w-4 transition-transform duration-100 ease-in-out transform group-hover:rotate-180" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={10}
                  onMouseEnter={() => setActivePopover(key)}
                  onMouseLeave={() => setActivePopover(null)}
                  className="w-full p-0"
                >
                  <motion.ul
                    initial={{ opacity: 0, x: 3 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={
                      key === 'donate' || key === 'for Diaspora'
                        ? 'grid grid-cols-2 gap-x-8 gap-y-2 p-3 bg-gray-50 text-gray-950 dark:text-gray-50 dark:bg-gray-950'
                        : 'p-2 bg-gray-50 text-gray-950 dark:text-gray-50 dark:bg-gray-950'
                    }
                  >
                    {links.map((link) => (
                      <li
                        key={link.href}
                        className="p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800"
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </motion.ul>
                </PopoverContent>
              </Popover>
            ))}
          </div>

          <div className="lg:hidden mr-3">
            <button
              onClick={handleMenuToggle}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <HamburgerMenuIcon className="h-8 w-8" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-gray-800 text-gray-50 dark:text-gray-50 dark:bg-gray-900 lg:hidden">
              <ul className="flex flex-col items-start p-4 space-y-4">
                <li>
                  <Link
                    href="/auth/register"
                    className="block dark:focus:bg-gray-800"
                  >
                    Start Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="block dark:focus:bg-gray-800"
                  >
                    Login
                  </Link>
                </li>
                {Object.entries(dropdownLinks).map(([key, links]) => (
                  <li key={key}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center group focus:outline-none focus:ring-0 dark:hover:bg-gray-800"
                        >
                          {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                          <TriangleDownIcon className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out transform group-hover:rotate-180" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="start"
                        sideOffset={10}
                      >
                        <ul
                          className={
                            key === 'donate' || key === 'africanDiaspora'
                              ? 'grid grid-cols-2 gap-2'
                              : ''
                          }
                        >
                          {links.map((link) => (
                            <li
                              key={link.href}
                              className="p-2 hover:bg-gray-950 hover:text-gray-50 dark:hover:bg-gray-800"
                            >
                              <Link href={link.href}>{link.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </li>
                ))}
                <DarkModeBtn />
              </ul>
            </div>
          )}

          <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-2">
            <DarkModeBtn />
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="py-2 px-4 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 dark:text-gray-50 rounded-full"
                >
                  <Link
                    href="/auth/register"
                    className="text-gray-700 dark:text-gray-50"
                  >
                    Start A Project
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="py-2 px-4 bg-orange-400 rounded-full dark:hover:bg-gray-800"
                >
                  <Link
                    href="/auth/login"
                    className="text-white dark:text-gray-50"
                  >
                    Login
                  </Link>
                </Button>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar name={user.full_name} size="sm" />
                  </div>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" sideOffset={10}>
                  <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-lg shadow-lg">
                    <p className="mb-2">{user.email}</p>
                    <Button variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
