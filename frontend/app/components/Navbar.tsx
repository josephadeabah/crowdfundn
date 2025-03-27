'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useUserContext } from '../context/users/UserContext';
import { cn } from '../lib/utils';
import BantuHiveLogoIcon from './icons/BantuHiveLogoIcon';
import NavbarLoader from '../loaders/NavbarLoader';
import { NavbarAuthButtons } from './navbar/NavbarAuthButtons';
import { NavbarNotificationIcons } from './navbar/NavbarNotificationIcons';
import { NavbarUserMenu } from './navbar/NavbarUserMenu';
import { NavbarDropdown } from './navbar/NavbarDropdown';
import { dropdownLinks } from '../types/constant';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { NavbarMobileMenu } from './navbar/NavbarMobileMenu';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { userAccountData } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Mock data for notifications and messages
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New donation received', read: false },
    { id: 2, text: 'Campaign approved', read: true },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, text: 'Message from supporter', read: false },
  ]);

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

  if (loading) {
    return <NavbarLoader />;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-transform duration-300 ease-in-out',
        isVisible || isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm translate-y-0'
          : 'bg-transparent -translate-y-full',
      )}
    >
      <div className="max-w-7xl mx-auto relative flex items-center justify-between text-gray-800 dark:bg-gray-950 dark:text-gray-50">
        <div className="text-2xl font-bold text-orange-500">
          <a href="/">
            <BantuHiveLogoIcon className="w-24 h-auto" />
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-x-2 mx-6">
          {Object.entries(dropdownLinks).map(([key, links]) => (
            <NavbarDropdown
              key={key}
              keyName={key}
              links={links}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              closeTimeout={closeTimeout}
            />
          ))}
        </div>

        <div className="lg:hidden mr-3">
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

        {user && (
          <NavbarMobileMenu
            isMenuOpen={isMenuOpen}
            user={user}
            dropdownLinks={dropdownLinks}
            openDropdown={openDropdown}
            handleDropdownToggle={handleDropdownToggle}
            userAccountData={userAccountData}
            logout={logout}
            notifications={notifications}
            messages={messages}
          />
        )}

        <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-2">
          {!user ? (
            <NavbarAuthButtons />
          ) : (
            <div className="flex items-center gap-2">
              <NavbarNotificationIcons
                notifications={notifications}
                messages={messages}
              />
              <NavbarUserMenu
                user={user}
                userAccountData={userAccountData}
                logout={logout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
