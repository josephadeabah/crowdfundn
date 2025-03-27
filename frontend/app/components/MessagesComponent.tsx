'use client';
import { Notification } from '@/app/types/navbar.types';

interface MessagesComponentProps {
  messages: Notification[];
}

export const MessagesComponent: React.FC<MessagesComponentProps> = ({
  messages,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages</p>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.read
                  ? 'bg-gray-50'
                  : 'bg-white border border-orange-200'
              }`}
            >
              <p className={message.read ? 'text-gray-500' : 'font-medium'}>
                {message.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
