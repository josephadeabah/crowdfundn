'use client';

import React, { useEffect, useState } from 'react';
import DarkModeBtn from './DarkModeBtn';
import { Button } from './button/Button';
import Link from 'next/link';
import {
  UserGroupIcon,
  XMarkIcon,
  SquaresPlusIcon,
  SunIcon,
  LightBulbIcon,
  PhoneIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import {
  HamburgerMenuIcon,
  ChevronDownIcon,
  TriangleDownIcon,
} from '@radix-ui/react-icons';
import Avatar from '@/app/components/avatar/Avatar';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import NavbarLoader from '../loaders/NavbarLoader';
import { motion } from 'framer-motion';
import { useUserContext } from '../context/users/UserContext';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/app/components/popover/Popover';
import { cn } from '../lib/utils';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, token, logout } = useAuth();
  const { userAccountData } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  let closeTimeout: NodeJS.Timeout;

  // Mock data for notifications and messages
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New donation received', read: false },
    { id: 2, text: 'Campaign approved', read: true },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Message from supporter', read: false },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const dropdownLinks = {
    About: [
      {
        label: 'Who We Are',
        href: '/about-us',
        icon: UserGroupIcon,
        description: 'Learn more about our mission and vision.',
      },
      {
        label: 'Why Is This Right For You?',
        href: '/articles/is-crowdfunding-right-for-you',
        icon: SunIcon,
        description: 'Discover why crowdfunding is the right choice for you.',
      },
      {
        label: 'Who Can Fundraise?',
        href: '/articles/who-can-fundraise',
        icon: UserIcon,
        description: 'Find out who can start a fundraising campaign.',
      },
    ],
    Guides: [
      {
        label: 'How To Get Started',
        href: '/articles/how-to-get-started',
        icon: LightBulbIcon,
        description: 'Step-by-step guide to launching your campaign.',
      },
      {
        label: 'How To Withdraw Funds Safely',
        href: '/articles/how-to-withdraw-funds',
        icon: CreditCardIcon,
        description: 'Learn how to securely withdraw your funds.',
      },
      {
        label: 'Pricing',
        href: '/pricing',
        icon: BanknotesIcon,
        description: 'Understand our pricing structure.',
      },
    ],
    Contact: [
      {
        label: 'Ghana',
        href: '/contactus',
        icon: PhoneIcon,
        description: 'Reach out to our Ghana office.',
      },
      {
        label: 'Eswatini',
        href: '/contactus',
        icon: PhoneIcon,
        description: 'Reach out to our Eswatini office.',
      },
    ],
    Donate: [
      {
        label: 'By Category',
        href: '/explore/category',
        icon: SquaresPlusIcon,
        description: 'Donate to campaigns by category.',
      },
      {
        label: 'By Advance Filtering',
        href: '/explore/advance',
        icon: SquaresPlusIcon,
        description: 'Use advanced filters to find campaigns.',
      },
    ],
    Leaderboard: [
      {
        label: 'Backers',
        href: '/leaderboard/backers',
        icon: UserGroupIcon,
        description: 'See the top backers on our platform.',
      },
      {
        label: 'Fundraisers',
        href: '/leaderboard/fundraisers',
        icon: UserGroupIcon,
        description: 'See the top fundraisers on our platform.',
      },
    ],
  };

  if (loading) {
    return <NavbarLoader />;
  }

  // Notification and message icons component
  const NotificationIcons = () => (
    <div className="flex items-center gap-2">
      {/* Notification Icon */}
      <Popover>
        <PopoverTrigger>
          <div className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800">
            <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                {unreadNotifications}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 p-2 w-64"
        >
          <div className="p-2 text-sm font-medium">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 text-sm ${
                    notification.read ? 'text-gray-500' : 'text-gray-800 font-medium'
                  } dark:text-gray-300 border-b border-gray-100 dark:border-gray-700`}
                >
                  {notification.text}
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Message Icon */}
      <Popover>
        <PopoverTrigger>
          <div className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800">
            <EnvelopeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                {unreadMessages}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 p-2 w-64"
        >
          <div className="p-2 text-sm font-medium">Messages</div>
          {messages.length === 0 ? (
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
              No messages
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 text-sm ${
                    message.read ? 'text-gray-500' : 'text-gray-800 font-medium'
                  } dark:text-gray-300 border-b border-gray-100 dark:border-gray-700`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-transform duration-300 ease-in-out',
        isVisible || isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm translate-y-0'
          : 'bg-transparent -translate-y-full',
      )}
    >
      <div className="max-w-7xl mx-auto relative flex items-center justify-between text-gray-800 dark:bg-gray-950 dark:text-gray-50 px-4">
        <div className="text-2xl font-bold text-orange-500">
          <a href="/">
            <BantuHiveLogoIcon className="w-24 h-auto" />
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-x-2 mx-6">
          {Object.entries(dropdownLinks).map(([key, links]) => (
            <Popover key={key} open={activeMenu === key} onOpenChange={(isOpen) => {
              if (!isOpen) setActiveMenu(null);
            }}>
              <PopoverTrigger
                onMouseEnter={() => {
                  clearTimeout(closeTimeout);
                  setActiveMenu(key);
                }}
                onMouseLeave={() => {
                  closeTimeout = setTimeout(() => setActiveMenu(null), 200);
                }}
                className="flex items-center text-gray-700 dark:text-gray-50 group focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none"
              >
                <Button variant="ghost" className="flex items-center">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <TriangleDownIcon
                    className={`ml-2 h-4 w-4 transition-transform ${
                      activeMenu === key ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-50 p-2"
                onMouseEnter={() => {
                  clearTimeout(closeTimeout);
                  setActiveMenu(key);
                }}
                onMouseLeave={() => {
                  closeTimeout = setTimeout(() => setActiveMenu(null), 200);
                }}
              >
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    passHref
                    className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                  >
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none">
                      <div className="flex items-center justify-center rounded-lg !bg-white p-2">
                        {React.createElement(link.icon, {
                          className: 'h-5 w-5 text-gray-800',
                        })}
                      </div>
                      <div>
                        <h6 className="text-sm font-bold text-gray-800 dark:text-gray-50">
                          {link.label}
                        </h6>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </PopoverContent>
            </Popover>
          ))}
        </div>

        {/* Right side content */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button and icons */}
          <div className="lg:hidden flex items-center gap-2">
            {user && <NotificationIcons />}
            <button
              onClick={handleMenuToggle}
              className="text-gray-800 shadow-none rounded-none dark:text-gray-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <HamburgerMenuIcon className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Desktop auth/user section */}
          <div className="hidden lg:flex items-center gap-2">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-1 px-4 bg-white dark:bg-gray-900 dark:text-gray-50 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <Link href="/auth/register" className="text-sm">
                    Start A Project
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-1 px-4 bg-orange-400 rounded-full hover:bg-orange-600 text-white transition-colors"
                >
                  <Link href="/auth/login" className="text-sm">
                    Login
                  </Link>
                </motion.button>
              </>
            ) : (
              <>
                <NotificationIcons />
                <Popover>
                  <PopoverTrigger>
                    <div className="cursor-pointer">
                      <Avatar
                        name={user.full_name}
                        size="sm"
                        imageUrl={
                          userAccountData?.profile?.avatar?.record?.avatar as string
                        }
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 p-2"
                  >
                    <div className="cursor-pointer flex items-center">
                      <Link href="/account">
                        <Avatar
                          name={user.full_name}
                          size="sm"
                          imageUrl={
                            userAccountData?.profile?.avatar?.record?.avatar as string
                          }
                        />
                      </Link>
                      <div className="ml-3 flex flex-col">
                        <span className="font-semibold">{user.full_name}</span>
                        <span className="text-gray-600">{user.email}</span>
                      </div>
                    </div>
                    {userAccountData?.admin && (
                      <Link href="/admin/manage">
                        <div className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
                          Go to Admin
                        </div>
                      </Link>
                    )}
                    <Link href="/account">
                      <div className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2">
                        Go to Account
                      </div>
                    </Link>
                    <div 
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 cursor-pointer"
                      onClick={logout}
                    >
                      Logout
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white text-gray-800 dark:text-gray-50 dark:bg-gray-900 lg:hidden">
            <div className="flex flex-col items-start p-4 space-y-4">
              {!user && (
                <>
                  <div className="w-full">
                    <Link href="/auth/register" className="block">
                      Start Project
                    </Link>
                  </div>
                  <div className="w-full">
                    <Link href="/auth/login" className="block">
                      Login
                    </Link>
                  </div>
                </>
              )}
              {Object.entries(dropdownLinks).map(([key, links]) => (
                <div key={key} className="w-full">
                  <div
                    className="text-base p-2 flex justify-between items-center w-full cursor-pointer"
                    onClick={() => handleDropdownToggle(key)}
                  >
                    <div>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === key ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openDropdown === key && (
                    <div className="pl-4 w-full">
                      {links.map((link) => (
                        <Link
                          href={link.href}
                          key={link.href}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center justify-center rounded-lg bg-white p-2">
                            {React.createElement(link.icon, {
                              className: 'h-5 w-5 text-gray-800',
                            })}
                          </div>
                          <div>
                            <h6 className="text-sm font-bold">{link.label}</h6>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {user && (
                <div className="flex items-center gap-3 w-full">
                  <Link href="/account">
                    <Avatar
                      name={user.full_name}
                      size="sm"
                      imageUrl={
                        userAccountData?.profile?.avatar?.record?.avatar as string
                      }
                    />
                  </Link>
                  <div className="ml-3 flex flex-col">
                    <span className="font-semibold">{user.full_name}</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  <div 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;