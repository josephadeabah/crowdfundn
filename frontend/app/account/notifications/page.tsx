'use client';
import { NotificationsComponent } from '@/app/components/NotificationsComponent';
import { Notification } from '@/app/types/navbar.types';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      const data = await fetch('/api/notifications').then((res) => res.json());
      setNotifications(data);
    }
    fetchNotifications();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800 min-h-screen">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-12 py-8 ml-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - 15% width */}
          <div className="lg:w-[15%]"> {/* Changed from lg:w-1/4 to lg:w-[15%] */}
            <div className="sticky top-8 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  All Notifications
                </button>
                {/* Add more sidebar content as needed */}
              </div>
            </div>
          </div>

          {/* Main notifications content - 85% width */}
          <div className="lg:w-[85%]"> {/* Changed from lg:w-3/4 to lg:w-[85%] */}
            <NotificationsComponent notification={notifications} /> {/* Fixed prop name */}
          </div>
        </div>
      </div>
    </div>
  );
}