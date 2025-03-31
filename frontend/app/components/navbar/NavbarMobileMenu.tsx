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
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => handleDropdownToggle('')}
      />

      {/* Menu Content */}
      <div className="absolute top-16 left-0 right-0 bg-white text-gray-800 dark:text-gray-50 dark:bg-gray-900 shadow-lg transform transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-start p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {!user ? (
            <>
              <div className="w-full">
                <Link
                  href="/auth/register"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDropdownToggle('')}
                >
                  Start Project
                </Link>
              </div>
              <div className="w-full">
                <Link
                  href="/auth/login"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDropdownToggle('')}
                >
                  Login
                </Link>
              </div>
            </>
          ) : null}

          {Object.entries(dropdownLinks).map(([key, links]) => (
            <div key={key} className="w-full">
              <div
                className="text-base p-2 flex justify-between items-center w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
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
                      onClick={() => handleDropdownToggle('')}
                    >
                      <div className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
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
              <div className="flex items-center gap-4 w-full p-2 border-b border-gray-200 dark:border-gray-700">
                <Link
                  href="/account/notifications"
                  className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDropdownToggle('')}
                >
                  <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account/messages"
                  className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleDropdownToggle('')}
                >
                  <EnvelopeIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  {messages.filter((m) => !m.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
                      {messages.filter((m) => !m.read).length}
                    </span>
                  )}
                </Link>
              </div>

              <div className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Link
                  href="/account"
                  className="flex items-center gap-3 flex-1"
                  onClick={() => handleDropdownToggle('')}
                >
                  <Avatar
                    name={user.full_name}
                    size="sm"
                    imageUrl={
                      userAccountData?.profile?.avatar?.record?.avatar as string
                    }
                  />
                  <div className="ml-3 flex flex-col">
                    <span className="font-semibold">{user.full_name}</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                </Link>
                <button
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition"
                  onClick={() => {
                    logout();
                    handleDropdownToggle('');
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
