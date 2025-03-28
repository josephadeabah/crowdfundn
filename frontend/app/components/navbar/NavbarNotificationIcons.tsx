'use client';
import React from 'react';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/app/types/navbar.types';

interface NavbarNotificationIconsProps {
  notifications: Notification[];
  messages: Notification[];
}

export const NavbarNotificationIcons: React.FC<
  NavbarNotificationIconsProps
> = ({ notifications, messages }) => {
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  return (
    <div className="flex items-center gap-2">
      {/* Notification Icon */}
      <a
        href="/account#notifications"
        className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
            {unreadNotifications}
          </span>
        )}
      </a>

      {/* Message Icon */}
      <a
        href="/account#messages"
        className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <EnvelopeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
            {unreadMessages}
          </span>
        )}
      </a>
    </div>
  );
};
