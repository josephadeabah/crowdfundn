'use client';
import React from 'react';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverTrigger, PopoverContent } from '../popover/Popover';
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
                    notification.read
                      ? 'text-gray-500'
                      : 'text-gray-800 font-medium'
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
};
