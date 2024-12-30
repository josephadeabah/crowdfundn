'use client';

import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaComment,
  FaPaperclip,
  FaSort,
  FaBell,
} from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chatMessages, setChatMessages] = useState<
    { text: string; sender: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState('');
  const [agentStatus, setAgentStatus] = useState('Available');
  const [articles, setArticles] = useState<
    { id: number; title: string; category: string; date: string }[]
  >([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['All', 'Account', 'Payments', 'Projects', 'Technical'];

  useEffect(() => {
    // Simulating fetching of articles
    const fetchedArticles = [
      {
        id: 1,
        title: 'How to Start a Campaign',
        category: 'Projects',
        date: '2023-06-01',
      },
      {
        id: 2,
        title: 'Troubleshooting Payment Issues',
        category: 'Payments',
        date: '2023-05-28',
      },
      {
        id: 3,
        title: 'Account Security Best Practices',
        category: 'Account',
        date: '2023-05-25',
      },
    ];
    setArticles(fetchedArticles);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement contact form submission logic here
    console.log('Contact form submitted');
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      // Simulate agent response
      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Thank you for your message. How can I assist you today?',
            sender: 'agent',
          },
        ]);
      }, 1000);
    }
  };

  const handleSort = (criteria: string) => {
    setSortBy(criteria);
    // Implement sorting logic here
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mt-8 bg-green-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">
        Support Center
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pr-12 rounded-lg border-2 border-green-300 focus:border-green-500 focus:outline-none"
            aria-label="Search for help"
          />
          <button
            type="submit"
            className="absolute right-3 top-3 text-green-500 hover:text-green-700"
            aria-label="Submit search"
          >
            <FaSearch size={24} />
          </button>
        </div>
      </form>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-100'} transition-colors duration-200`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Live Chat */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaComment className="mr-2 text-green-500" /> Live Chat
          </h2>
          <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded p-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-green-100' : 'bg-gray-200'}`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-r-lg hover:bg-green-600 transition-colors duration-200"
            >
              Send
            </button>
          </form>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>
              Support Agent Status:{' '}
              <span className="font-semibold text-green-500">
                {agentStatus}
              </span>
            </span>
            <button
              className="text-green-500 hover:text-green-700"
              aria-label="Attach file"
            >
              <FaPaperclip size={20} />
            </button>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Knowledge Base</h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleSort('relevance')}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <FaSort className="mr-1" /> Sort by: {sortBy}
              <MdKeyboardArrowDown className="ml-1" />
            </button>
          </div>
          <ul className="space-y-4">
            {articles.map((article) => (
              <li key={article.id} className="border-b pb-4">
                <h3 className="text-lg font-semibold hover:text-green-600 cursor-pointer">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Category: {article.category} | Published: {article.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
        <form onSubmit={handleContactSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center">
          <FaBell className="mr-2" />
          <span>{notification}</span>
        </div>
      )}
    </section>
  );
};

export default Support;
