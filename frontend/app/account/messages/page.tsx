'use client';
import { MessagesComponent } from '@/app/components/MessagesComponent';
import { Notification } from '@/app/types/navbar.types';
import { useEffect, useState } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Notification[]>([]);

  // Fetch messages data here
  useEffect(() => {
    async function fetchMessages() {
      // Your data fetching logic here
      const data = await fetch('/api/messages').then((res) => res.json());
      setMessages(data);
    }
    fetchMessages();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800 min-h-screen">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-12 py-8 ml-auto">
        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium align-middle">
          coming soon
        </span>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - 15% width */}
          <div className="lg:w-[15%]">
            <div className="sticky top-8 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  All Messages
                </button>
                {/* Add more sidebar content as needed */}
              </div>
            </div>
          </div>

          {/* Main notifications content - 85% width */}
          <div className="lg:w-[85%]">
            <MessagesComponent message={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}
