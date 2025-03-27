'use client';
import React, { useState } from 'react';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/app/types/navbar.types';
import Modal from '../modal/Modal';

interface NavbarNotificationIconsProps {
  notifications: Notification[];
  messages: Notification[];
}

export const NavbarNotificationIcons: React.FC<
  NavbarNotificationIconsProps
> = ({ notifications, messages }) => {
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Notification Icon */}
      <div
        className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setShowNotificationsModal(true)}
      >
        <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
            {unreadNotifications}
          </span>
        )}
      </div>

      <Modal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        size="xxlarge"
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
      </Modal>

      {/* Message Icon */}
      <div
        className="relative cursor-pointer p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setShowMessagesModal(true)}
      >
        <EnvelopeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs">
            {unreadMessages}
          </span>
        )}
      </div>

      <Modal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        size="xxlarge"
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
      </Modal>
    </div>
  );
};
