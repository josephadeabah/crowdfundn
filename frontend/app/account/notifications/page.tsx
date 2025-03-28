'use client';
import { NotificationsComponent } from '@/app/components/NotificationsComponent';
import { Notification } from '@/app/types/navbar.types';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications data here
  useEffect(() => {
    async function fetchNotifications() {
      // Your data fetching logic here
      const data = await fetch('/api/notifications').then((res) => res.json());
      setNotifications(data);
    }
    fetchNotifications();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <span>This page is under construction</span>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <NotificationsComponent notification={notifications} />
      </div>
    </div>
  );
}
