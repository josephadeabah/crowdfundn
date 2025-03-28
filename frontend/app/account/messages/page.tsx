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
      <div className="max-w-7xl mx-auto">
        <MessagesComponent messages={messages} />
      </div>
    </div>
  );
}
