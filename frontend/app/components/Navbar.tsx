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

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);

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
      className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out  hover:text-gray-50 focus:ring-0 hover:bg-gray-950 dark:hover:bg-gray-800 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="md:py-6 px-2 w-full shadow-sm bg-gradient-to-b from-black to-gray-950 text-white dark:bg-gray-950 dark:text-gray-50">
        <div className="relative flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-red-500"
          >
            <a href="/">
              <svg
                fill="none"
                viewBox="0 0 512 512"
                height="56"
                width="56"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  transform="translate(0.000000,512.000000) scale(0.10,-0.10)"
                  fill="#C7253E"
                  stroke="none"
                >
                  <path d="M1671 3681 c62 -147 60 -113 56 -1114 -2 -501 -7 -930 -11 -952 l-7 -40 19 35 c24 43 48 141 61 240 20 156 33 632 28 1035 -5 429 -7 451 -56 620 -29 98 -28 133 5 145 28 11 232 12 279 1 25 -6 41 0 92 34 35 22 61 45 59 50 -1 6 -106 11 -278 13 l-276 2 29 -69z" />
                  <path d="M1148 3702 c16 -24 80 -62 106 -62 8 0 19 -6 23 -13 17 -27 75 -58 164 -87 52 -17 100 -38 107 -47 19 -27 14 -6 -13 47 -63 124 -133 167 -294 178 l-108 7 15 -23z" />
                  <path d="M2963 3696 c-99 -46 -182 -141 -257 -292 -89 -182 -366 -838 -366 -869 0 -13 26 -15 158 -14 86 1 148 3 137 6 -73 15 -68 9 -61 66 12 84 95 324 194 557 99 235 216 382 339 429 119 45 213 37 293 -27 l45 -36 -30 33 c-44 49 -149 121 -213 147 -79 32 -169 32 -239 0z" />
                  <path d="M2360 3633 c0 -49 -8 -75 -21 -67 -5 3 -9 15 -9 28 0 12 -2 25 -5 28 -6 6 -116 -31 -160 -54 -83 -45 -135 -137 -135 -243 0 -78 11 -125 95 -400 53 -176 75 -231 75 -195 0 8 23 71 50 139 27 69 47 127 45 130 -3 2 -5 -1 -5 -8 0 -9 -3 -9 -13 1 -19 19 -28 47 -33 103 -3 28 -7 56 -10 63 -2 8 5 44 16 81 15 49 33 80 66 116 67 75 79 100 77 175 -1 36 -8 83 -17 105 l-15 40 -1 -42z" />
                  <path d="M3307 3415 c-75 -26 -123 -95 -197 -280 -24 -60 -79 -195 -122 -299 -43 -105 -78 -193 -78 -196 0 -4 35 -5 78 -2 70 4 139 -4 197 -23 14 -5 16 -4 7 3 -20 14 -12 116 14 187 12 33 30 83 41 110 10 28 20 52 23 55 11 11 45 84 43 92 -2 4 1 8 6 8 5 0 13 10 17 22 8 28 79 97 111 109 37 14 75 11 96 -8 20-18 20-18 2 17 -10 19 -25 46 -35 60 -9 14 -15 30 -13 37 2 7 -6 25 -18 42 -12 16 -19 36 -16 44 4 11 -6 18 -38 26 -55 14 -71 13 -118 -4z" />
                  <path d="M3727 3183 c5 -58 2 -77 -11 -98 -16 -24 -15 -25 2 -25 10 0 26 6 37 13 22 17 17 72 -13 138 l-21 44 6 -72z" />
                  <path d="M2098 2402 c-49 -76 -131 -250 -170 -359 -29 -84 -31 -98 -37 -293 -6 -195 -8 -207 -33 -255 -25 -49 -67 -94 -118 -129 -24 -17 -23 -17 55 -11 65 5 83 11 98 28 9 12 31 39 48 60 16 20 36 37 43 37 11 0 10 10 -1 53 -17 61 -11 141 17 248 10 40 17 76 14 80 -2 4 2 10 8 12 8 4 9 6 2 6 -21 2 4 99 117 454 15 48 16 63 6 92 l-12 34 -37 -57z" />
                  <path d="M2341 2219 c-11 -24 -59 -152 -107 -284 -80 -220 -88 -246 -88 -315 -1 -119 43 -175 153 -192 31 -5 62 -10 68 -10 7 -1 21 -11 30 -22 l18 -21 -25 20 -25 20 16 -20 c10 -11 19 -29 22 -40 4 -16 5 -17 6 -2 0 9 8 17 16 17 18 0 19 -3 -2 67 -22 73 -21 245 1 281 4 6 5 16 1 22 -3 5 -2 17 3 27 46 93 57 111 66 106 5 -4 7 3 4 15 -4 12 -2 20 3 16 5 -3 9 0 9 6 0 14 47 78 75 103 63 56 223 95 406 99 72 2 92 -2 123 -20 l37 -22 -12 22 c-26 48 -92 107 -152 134 l-62 28 -283 4 -282 4 -19 -43z" />
                  <path d="M3346 2151 c14 -35 30 -98 36 -141 32 -216 -95 -450 -294 -545 -41 -19 -94 -39 -119 -44 -35 -7 -38 -9 -14 -10 80 -2 241 79 330 166 98 96 155 260 135 388 -12 76 -53 190 -80 225 -17 21 -16 15 6 -39z" />
                  <path d="M3693 1910 c-1 -176 -55 -315 -174 -443 -89 -97 -172 -159 -284 -213 -131 -64 -224 -85 -380 -87 -159 -2 -175 4 -175 68 l0 45 -73 0 c-44 0 -78 5 -87 13 -7 6 -1 -4 13 -24 15 -20 51 -48 79 -64 29 -16 71 -40 93 -55 59 -39 104 -58 197 -82 95 -25 252 -29 340 -8 61 15 172 62 182 79 4 6 15 11 24 11 9 0 35 16 57 36 22 20 62 55 88 77 27 23 58 58 70 77 11 19 33 50 49 68 15 18 28 37 28 42 0 6 12 34 26 63 22 45 25 66 25 147 1 114 -10 159 -60 265 l-37 80 -1 -95z" />
                  <path d="M2400 1263 c0 -44 -4 -55 -26 -72 -26 -21 -36 -21 -493 -21 l-466 0 45 -25 c207 -116 224 -119 595 -109 154 3 287 8 295 10 8 1 32 3 52 3 24 1 47 10 65 25 l28 24 -24 54 c-13 29 -34 78 -47 108 l-24 55 0 -52z" />
                </g>
              </svg>
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
                    className="flex items-center text-gray-50 group focus:outline-none hover:text-gray-50 focus:ring-0 hover:bg-gray-950 dark:hover:bg-gray-800"
                  >
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    <TriangleDownIcon className="ml-2 h-4 w-4 transition-transform duration-200 ease-in-out transform group-hover:rotate-180" />
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={
                      key === 'donate' || key === 'for Diaspora'
                        ? 'grid grid-cols-2 gap-x-8 gap-y-2 p-3 bg-gray-800 text-gray-50'
                        : 'p-2 bg-gray-800 text-gray-50'
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
                  </motion.ul>
                </PopoverContent>
              </Popover>
            ))}
          </div>

          <div className="lg:hidden">
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

          <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-3">
            <DarkModeBtn />
            <Button
              variant="ghost"
              className="py-2 px-4 dark:hover:bg-gray-800"
            >
              <Link href="/auth/register">Start Project</Link>
            </Button>
            <Button
              variant="ghost"
              className="py-2 px-4 dark:hover:bg-gray-800"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
