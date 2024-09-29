import React, { useState, useEffect } from 'react';
import { FaCircle, FaPaperPlane, FaBell } from 'react-icons/fa';

const ChatInterface = () => {
  interface Message {
    id: number;
    sender: number;
    text: string;
    timestamp: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  interface User {
    id: number;
    name: string;
    status: string;
    avatar: string;
    unreadMessages?: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating fetching initial data
    fetchInitialData();

    // Simulating real-time updates
    const interval = setInterval(() => {
      updateData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = () => {
    // Simulated API call
    setUsers([
      {
        id: 1,
        name: 'John Doe',
        status: 'online',
        avatar:
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 2,
        name: 'Jane Smith',
        status: 'offline',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      },
      {
        id: 3,
        name: 'Alice Johnson',
        status: 'busy',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      },
    ]);
    setMessages([
      {
        id: 1,
        sender: 1,
        text: 'Hello everyone!',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        sender: 2,
        text: 'Hi John, how are you?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const updateData = () => {
    // Simulating real-time updates
    const newMessage = {
      id: messages.length + 1,
      sender: Math.floor(Math.random() * 3) + 1,
      text: `New message ${messages.length + 1}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulating user status changes
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        status: ['online', 'offline', 'busy'][Math.floor(Math.random() * 3)],
      })),
    );
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 1, // Assuming the current user is John Doe
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-500';
      case 'busy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="bg-theme-color-primary p-4 text-white">
          <h1 className="text-2xl font-bold">Chat Interface</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {messages.map((message) => {
            const sender = users.find((user) => user.id === message.sender);
            return (
              <div key={message.id} className="flex items-start space-x-2">
                <img
                  src={sender?.avatar || 'default-avatar-url'}
                  alt={sender ? sender.name : 'Unknown Sender'}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      {sender ? sender.name : 'Unknown Sender'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="bg-gray-100 rounded-lg p-2 mt-1">
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSendMessage} className="bg-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
            />
            <button
              type="submit"
              className="bg-theme-color-primary text-white rounded-full p-2 hover:bg-theme-color-primary-dark transition-colors duration-200"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <FaCircle
                  className={`absolute bottom-0 right-0 text-xs ${getStatusColor(user.status)}`}
                  aria-label={`${user.name} is ${user.status}`}
                />
              </div>
              <span className="font-medium">{user.name}</span>
              {user.unreadMessages && user.unreadMessages > 0 && (
                <span
                  className="bg-theme-color-primary text-white text-xs rounded-full px-2 py-1 animate-pulse"
                  aria-label={`${user.unreadMessages} unread messages`}
                >
                  {user.unreadMessages}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
