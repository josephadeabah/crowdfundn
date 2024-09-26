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
      className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="p-6 w-full bg-white dark:bg-gray-950">
        <div className="relative flex items-center justify-between">
          <a href="/">
            <svg fill="none" viewBox="0 0 28 28" height="28" width="28">
              <path
                className="fill-red-600"
                d="M2.333 0A2.333 2.333 0 0 0 0 2.333V14c0 7.732 6.268 14 14 14 1.059 0 2.09-.117 3.082-.34.965-.217 1.585-1.118 1.585-2.107v-2.22a4.667 4.667 0 0 1 4.666-4.666h2.334A2.333 2.333 0 0 0 28 16.333v-14A2.333 2.333 0 0 0 25.667 0H21a2.333 2.333 0 0 0-2.333 2.333V14a4.667 4.667 0 0 1-9.334 0V2.333A2.333 2.333 0 0 0 7 0H2.333Z"
              />
            </svg>
          </a>

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
                    className="flex items-center group focus:outline-none focus:ring-0 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  className="w-full"
                >
                  <ul
                    className={
                      key === 'donate' || key === 'for Diaspora'
                        ? 'grid grid-cols-2 gap-x-8 gap-y-2 p-3'
                        : 'p-2'
                    }
                  >
                    {links.map((link) => (
                      <li
                        key={link.href}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
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
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <HamburgerMenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 lg:hidden">
              <ul className="flex flex-col items-start p-4 space-y-4">
                <li>
                  <Link
                    href="/auth/register"
                    className="block focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    Start Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="block focus:bg-gray-100 dark:focus:bg-gray-800"
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
                          className="flex items-center group focus:outline-none focus:ring-0 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
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
              className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Link href="/auth/register">Start Campaign</Link>
            </Button>
            <Button
              variant="ghost"
              className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
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
