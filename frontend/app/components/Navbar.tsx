'use client';

import React, { useEffect, useState } from 'react';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  IconButton,
  List,
  ListItem,
} from '@material-tailwind/react';
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

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user, token, logout } = useAuth();
  const { userAccountData } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  let closeTimeout: NodeJS.Timeout; // Declare closeTimeout here

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

  return (
    <header
      className={`bg-green-50 dark:bg-gray-950 sticky top-0 z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto relative flex items-center justify-between text-gray-800 dark:bg-gray-950 dark:text-gray-50">
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
            <Menu key={key} allowHover>
              <MenuHandler
                open={activeMenu === key}
                onOpenChange={(isOpen: any) => {
                  if (!isOpen) setActiveMenu(null);
                }}
              >
                <Button
                  onMouseEnter={() => {
                    clearTimeout(closeTimeout); // Prevent immediate close
                    setActiveMenu(key);
                  }}
                  onMouseLeave={() => {
                    closeTimeout = setTimeout(() => setActiveMenu(null), 200);
                  }}
                  variant="ghost"
                  className="flex items-center text-gray-700 dark:text-gray-50 group focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {/* Arrow with rotation */}
                  <TriangleDownIcon
                    className={`ml-2 h-4 w-4 transition-transform ${
                      activeMenu === key ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-2 bg-gray-50 text-gray-950 dark:text-gray-50 dark:bg-gray-950">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    passHref
                    className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                  >
                    <MenuItem className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none">
                      <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
                        {React.createElement(link.icon, {
                          className: 'h-5 w-5 text-gray-900',
                        })}
                      </div>
                      <div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="text-sm font-bold"
                        >
                          {link.label}
                        </Typography>
                        <Typography
                          variant="paragraph"
                          className="text-xs !font-medium text-blue-gray-500"
                        >
                          {link.description}
                        </Typography>
                      </div>
                    </MenuItem>
                  </Link>
                ))}
              </MenuList>
            </Menu>
          ))}
        </div>

        <div className="lg:hidden mr-3">
          <IconButton
            onClick={handleMenuToggle}
            variant="text"
            className="text-gray-800 shadow-none rounded-none dark:text-gray-300"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <HamburgerMenuIcon className="h-8 w-8" />
            )}
          </IconButton>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white text-gray-800 dark:text-gray-50 dark:bg-gray-900 lg:hidden">
            <List className="flex flex-col items-start p-4 space-y-4">
              {!user && (
                <>
                  <ListItem>
                    <Link
                      href="/auth/register"
                      className="block focus-visible:outline-none focus:ring-0 hover:outline-none"
                    >
                      Start Project
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link
                      href="/auth/login"
                      className="block focus-visible:outline-none focus:ring-0 hover:outline-none"
                    >
                      Login
                    </Link>
                  </ListItem>
                </>
              )}
              {Object.entries(dropdownLinks).map(([key, links]) => (
                <Menu key={key}>
                  <MenuHandler>
                    <ListItem className="flex justify-between items-center">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <ChevronDownIcon className="h-4 w-4" />
                    </ListItem>
                  </MenuHandler>
                  <MenuList className="p-3 bg-gray-50 text-gray-800 dark:text-gray-50 dark:bg-gray-950">
                    {links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.href}
                        passHref
                        className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                      >
                        <MenuItem className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none">
                          <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
                            {React.createElement(link.icon, {
                              className: 'h-5 w-5 text-gray-900',
                            })}
                          </div>
                          <div>
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="text-sm font-bold"
                            >
                              {link.label}
                            </Typography>
                            <Typography
                              variant="paragraph"
                              className="text-xs !font-medium text-blue-gray-500"
                            >
                              {link.description}
                            </Typography>
                          </div>
                        </MenuItem>
                      </Link>
                    ))}
                  </MenuList>
                </Menu>
              ))}
              {user && (
                <ListItem className="flex items-center gap-3 focus-visible:outline-none focus:ring-0 hover:outline-none">
                  <Link
                    href="/account"
                    className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                  >
                    <Avatar
                      name={user.full_name}
                      size="sm"
                      imageUrl={
                        userAccountData?.profile?.avatar?.record
                          ?.avatar as string
                      }
                    />
                  </Link>
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
                </ListItem>
              )}
            </List>
          </div>
        )}

        <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-2">
          {!user ? (
            <>
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
            </>
          ) : (
            <Menu>
              <MenuHandler>
                <div className="cursor-pointer">
                  <Avatar
                    name={user.full_name}
                    size="sm"
                    imageUrl={
                      userAccountData?.profile?.avatar?.record?.avatar as string
                    }
                  />
                </div>
              </MenuHandler>
              <MenuList className="p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                <div className="cursor-pointer flex items-center focus-visible:outline-none focus:ring-0 hover:outline-none">
                  <Link
                    href="/account"
                    className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                  >
                    <Avatar
                      name={user.full_name}
                      size="sm"
                      imageUrl={
                        userAccountData?.profile?.avatar?.record
                          ?.avatar as string
                      }
                    />
                  </Link>
                  <div
                    className="ml-3 flex flex-col"
                    onClick={() => router.push('/account')}
                  >
                    <span className="font-semibold">{user.full_name}</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </div>
                {userAccountData &&
                  (userAccountData?.admin === true ||
                    userAccountData?.roles.some(
                      (role) =>
                        role.name === 'Admin' || role.name === 'Manager',
                    )) && (
                    <Link
                      href="/admin/manage"
                      passHref
                      className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                    >
                      <MenuItem className="hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none">
                        Go to Admin
                      </MenuItem>
                    </Link>
                  )}
                <Link
                  href="/account"
                  passHref
                  className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                >
                  <MenuItem className="hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none">
                    Go to Account
                  </MenuItem>
                </Link>
                <MenuItem
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none"
                  onClick={logout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
