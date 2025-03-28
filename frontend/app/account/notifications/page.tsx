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
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 ml-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - can be used for filters or other content */}
          <div className="lg:w-1/4">
            <div className="sticky top-8 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  All Notifications
                </button>
              </div>
            </div>
          </div>
          
          {/* Main notifications content - positioned on the right */}
          <div className="lg:w-3/4">
            <NotificationsComponent notification={notifications} />
          </div>
        </div>
      </div>
    </div>
  );
}