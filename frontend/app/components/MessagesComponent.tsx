'use client';
import { Notification } from '@/app/types/navbar.types';
import React from 'react';
import {
  Search,
  Edit,
  ChevronDown,
  Paperclip,
  Send,
  MoreHorizontal,
  Phone,
  Video,
  User,
  Star,
  MessageSquare,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface MessagesComponentProps {
  message: Notification[];
}

export const MessagesComponent: React.FC<MessagesComponentProps> = ({
  message,
}) => {
  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      status: 'online',
      lastMessage: 'Thanks for backing my project!',
      time: '2m ago',
      unread: 3,
      avatar: 'https://source.unsplash.com/random/100x100?portrait=10',
    },
    {
      id: 2,
      name: 'Alex Martinez',
      status: 'offline',
      lastMessage: 'When will the rewards be shipped?',
      time: '1h ago',
      unread: 0,
      avatar: 'https://source.unsplash.com/random/100x100?portrait=11',
    },
    {
      id: 3,
      name: 'James Wilson',
      status: 'online',
      lastMessage: 'Great progress on your campaign!',
      time: '3h ago',
      unread: 0,
      avatar: 'https://source.unsplash.com/random/100x100?portrait=12',
    },
    {
      id: 4,
      name: 'Emma Davis',
      status: 'online',
      lastMessage: 'I just pledged to your new campaign',
      time: '5h ago',
      unread: 2,
      avatar: 'https://source.unsplash.com/random/100x100?portrait=13',
    },
    {
      id: 5,
      name: 'Michael Brown',
      status: 'offline',
      lastMessage: 'Looking forward to the launch!',
      time: '1d ago',
      unread: 0,
      avatar: 'https://source.unsplash.com/random/100x100?portrait=14',
    },
  ];

  const activeContact = contacts[0];

  const messages = [
    {
      id: 1,
      sender: 'them',
      text: 'Hi there! I just backed your eco-friendly water bottle project.',
      time: '10:24 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Thank you so much for your support! It means a lot to us.',
      time: '10:26 AM',
    },
    {
      id: 3,
      sender: 'them',
      text: 'The design looks amazing. When do you expect to start shipping?',
      time: '10:28 AM',
    },
    {
      id: 4,
      sender: 'me',
      text: "We're on track to start shipping rewards by next month. You'll be one of the first to receive it!",
      time: '10:30 AM',
    },
    {
      id: 5,
      sender: 'them',
      text: "That's fantastic news! I'm excited to try it out.",
      time: '10:31 AM',
    },
    {
      id: 6,
      sender: 'them',
      text: 'Do you offer international shipping?',
      time: '10:32 AM',
    },
    {
      id: 7,
      sender: 'me',
      text: "Yes, we do! There's a small additional fee for international shipping, but we ship worldwide.",
      time: '10:35 AM',
    },
    {
      id: 8,
      sender: 'them',
      text: 'Perfect! Thanks for the quick responses.',
      time: '10:36 AM',
    },
    {
      id: 9,
      sender: 'me',
      text: 'No problem at all! Feel free to reach out if you have any other questions.',
      time: '10:38 AM',
    },
    {
      id: 10,
      sender: 'them',
      text: 'Will do. Looking forward to receiving my bottle!',
      time: '10:42 AM',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Connect with backers and creators
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Edit size={16} />
            New Message
          </Button>
        </div>

        <div className="flex flex-1 border border-border rounded-lg overflow-hidden shadow-sm bg-white">
          {/* Contact List */}
          <div className="w-1/3 border-r border-border">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search messages..."
                  className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="h-[calc(100vh-16rem)] overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    'flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors',
                    contact.id === activeContact.id
                      ? 'bg-gray-50 border-l-2 border-video'
                      : '',
                  )}
                >
                  <div className="relative mr-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                        contact.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-300',
                      )}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span className="text-xs text-gray-500">
                        {contact.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unread > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-video text-white text-xs font-medium rounded-full">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-3 border-b border-border flex items-center justify-between bg-gray-50">
              <div className="flex items-center">
                <img
                  src={activeContact.avatar}
                  alt={activeContact.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-medium">{activeContact.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mr-1.5',
                        activeContact.status === 'online'
                          ? 'bg-green-500'
                          : 'bg-gray-300',
                      )}
                    ></div>
                    <span>
                      {activeContact.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.sender === 'me' ? 'justify-end' : 'justify-start',
                  )}
                >
                  {message.sender === 'them' && (
                    <img
                      src={activeContact.avatar}
                      alt={activeContact.name}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div className="max-w-[70%]">
                    <div
                      className={cn(
                        'p-3 rounded-lg',
                        message.sender === 'me'
                          ? 'bg-video text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none',
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div
                      className={cn(
                        'text-xs mt-1 text-gray-500',
                        message.sender === 'me' ? 'text-right' : 'text-left',
                      )}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-3 mx-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button size="icon" className="bg-video hover:bg-video-hover">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
