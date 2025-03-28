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
    <div className="w-full bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
      <span>This page is under construction</span>
        <MessagesComponent message={messages} />
      </div>
    </div>
  );
}
