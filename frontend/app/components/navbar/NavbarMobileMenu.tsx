'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Avatar from '../avatar/Avatar';
import { DropdownLinks } from '@/app/types/navbar.types';
import { LoginUserType } from '@/app/types/auth.login.types';
import { Notification } from '@/app/types/navbar.types';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface NavbarMobileMenuProps {
  isMenuOpen: boolean;
  user: LoginUserType | null;
  dropdownLinks: DropdownLinks;
  openDropdown: string | null;
  handleDropdownToggle: (key: string) => void;
  userAccountData: any;
  logout: () => void;
  notifications: Notification[];
  messages: Notification[];
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isMenuOpen,
  user,
  dropdownLinks,
  openDropdown,
  handleDropdownToggle,
  userAccountData,
  logout,
  notifications,
  messages,
}) => {
  if (!isMenuOpen) return null;

  return (
    <div className="absolute top-16 left-0 w-full bg-white text-gray-800 dark:text-gray-50 dark:bg-gray-900 lg:hidden">
      <div className="flex flex-col items-start p-4 space-y-4">
        {!user ? (
          <>
            <div className="w-full">
              <Link
                href="/auth/register"
                className="block focus-visible:outline-none focus:ring-0 hover:outline-none"
              >
                Start Project
              </Link>
            </div>
            <div className="w-full">
              <Link
                href="/auth/login"
                className="block focus-visible:outline-none focus:ring-0 hover:outline-none"
              >
                Login
              </Link>
            </div>
          </>
        ) : null}

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
                    passHref
                    className="focus-visible:outline-none focus:ring-0 hover:outline-none"
                  >
                    <div className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none">
                      <div className="flex items-center justify-center rounded-lg !bg-white p-2">
                        <link.icon className="h-5 w-5 text-gray-800" />
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
              </div>
            )}
          </div>
        ))}

        {user && (
          <>
            {/* Add notification and message icons */}
            <div className="flex items-center gap-4 w-full p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative cursor-pointer">
                <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </div>
              <div className="relative cursor-pointer">
                <EnvelopeIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                {messages.filter((m) => !m.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                    {messages.filter((m) => !m.read).length}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <Link
                href="/account"
                className="focus-visible:outline-none focus:ring-0 hover:outline-none"
              >
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
                className="hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 p-2 rounded transition"
                onClick={logout}
              >
                Logout
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
