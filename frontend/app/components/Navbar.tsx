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
import Avatar from '@/app/components/avatar/Avatar';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import NavbarLoader from '../loaders/NavbarLoader';
import NotificationBar from './noticebar/NotificationBar';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    ],
    donate: [
      { label: 'One-Time Donation', href: '/donate/one-time' },
      { label: 'Recurring Support', href: '/donate/recurring' },
      { label: 'Corporate Giving Programs', href: '/how-to/corporate-giving' },
      {
        label: 'Fundraising Ideas for Africa',
        href: '/how-to/fundraising-ideas-africa',
      },
    ],
    'for Diaspora': [
      { label: 'Cultural Events', href: '/african-diaspora/cultural-events' },
      { label: 'Diaspora Support', href: '/african-diaspora/diaspora-support' },
    ],
  };

  if (loading) {
    return <NavbarLoader />;
  }

  return (
    <>
      <NotificationBar />
      <header
        className={`bg-green-50 p-1 dark:bg-gray-950 sticky top-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <nav className="w-full max-w-screen-xl mx-auto text-gray-800 dark:bg-gray-950 dark:text-gray-50">
          <div className="relative flex items-center justify-between">
            <div className="text-2xl font-bold text-orange-500">
              <a href="/">
                <img
                  src="/bantuhive.svg"
                  alt="Bantuhive Logo"
                  className="w-24 h-auto"
                />
              </a>
            </div>

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
                      className="flex items-center text-gray-700 dark:text-gray-50 group focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <TriangleDownIcon className="ml-2 h-4 w-4 transition-transform duration-100 transform group-hover:rotate-180" />
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
                    <ul className="p-2 bg-gray-50 text-gray-950 dark:text-gray-50 dark:bg-gray-950">
                      {links.map((link) => (
                        <li
                          key={link.href}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
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
              <div className="absolute top-16 left-0 w-full bg-white text-gray-800 dark:text-gray-50 dark:bg-gray-900 lg:hidden">
                <ul className="flex flex-col items-start p-4 space-y-4">
                  {!user && (
                    <>
                      <li>
                        <Link href="/auth/register" className="block">
                          Start Project
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth/login" className="block">
                          Login
                        </Link>
                      </li>
                    </>
                  )}
                  {Object.entries(dropdownLinks).map(([key, links]) => (
                    <li key={key}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center group focus:outline-none focus-visible:outline-none  focus:ring-0 focus-visible:ring-0 hover:outline-none"
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                            <TriangleDownIcon className="ml-2 h-4 w-4 transition-transform duration-200 transform group-hover:rotate-180" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="start"
                          sideOffset={10}
                        >
                          <ul className="grid grid-cols-2 gap-2">
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
                  {user && (
                    <li className="flex items-center gap-3">
                      <Avatar name={user.full_name} size="sm" />
                      <div className="ml-3 flex flex-col">
                        <span className="font-semibold">{user.full_name}</span>
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                      <div
                        className="hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700 p-2 rounded transition"
                        onClick={logout}
                      >
                        Logout
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-2">
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    className="py-2 px-4 bg-white dark:bg-gray-900 dark:text-gray-50 rounded-full focus-visible:outline-none  focus:ring-0 focus-visible:ring-0 hover:outline-none"
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
                    <div className="flex flex-col justify-start gap-3 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                      <div className="cursor-pointer flex items-center">
                        <Link href="/account">
                          <Avatar name={user.full_name} size="sm" />
                        </Link>
                        <div
                          className="ml-3 flex flex-col"
                          onClick={() => router.push('/account')}
                        >
                          <span className="font-semibold">
                            {user.full_name}
                          </span>
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700 px-0 py-2 rounded transition">
                        <DarkModeBtn />
                        <div>Change Theme</div>
                      </div>
                      <div
                        className="hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-700 p-2 rounded transition"
                        onClick={logout}
                      >
                        Logout
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
