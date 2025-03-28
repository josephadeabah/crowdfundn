'use client';
import { Notification } from '@/app/types/navbar.types';
import React from 'react';
import {
  Bell,
  Settings,
  Filter,
  Check,
  MessageSquare,
  Award,
  CreditCard,
  Users,
  AlertCircle,
  Heart,
  Activity,
  TrendingUp,
  Gift,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

interface NotificationsComponentProps {
  notification: Notification[];
}

export const NotificationsComponent: React.FC<NotificationsComponentProps> = ({
  notification,
}) => {
  const notifications = [
    {
      id: 1,
      type: 'backer',
      title: 'New Backer',
      message:
        'Emma Wilson just backed your "Eco-friendly Water Bottle" campaign with $75.',
      time: '5 minutes ago',
      read: false,
      icon: Heart,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      image: 'https://source.unsplash.com/random/100x100?portrait=1',
    },
    {
      id: 2,
      type: 'milestone',
      title: 'Milestone Reached',
      message:
        'Your "Smart Home Garden" campaign has reached 75% of its funding goal!',
      time: '2 hours ago',
      read: false,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      image: 'https://source.unsplash.com/random/100x100?item=1',
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Michael Brown sent you a message about your campaign rewards.',
      time: '5 hours ago',
      read: true,
      icon: MessageSquare,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      image: 'https://source.unsplash.com/random/100x100?portrait=2',
    },
    {
      id: 4,
      type: 'reward',
      title: 'Badge Earned',
      message:
        'Congratulations! You\'ve earned the "Super Creator" badge for your contributions.',
      time: '1 day ago',
      read: true,
      icon: Award,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Processed',
      message:
        'Your campaign payout of $1,250 has been processed and will arrive in 2-3 business days.',
      time: '2 days ago',
      read: true,
      icon: CreditCard,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      id: 6,
      type: 'community',
      title: 'Community Milestone',
      message:
        'Your community has reached 500 members! Keep growing your network.',
      time: '3 days ago',
      read: true,
      icon: Users,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
    },
    {
      id: 7,
      type: 'system',
      title: 'System Update',
      message:
        'Platform maintenance scheduled for May 15th, 2:00 AM - 4:00 AM EST.',
      time: '4 days ago',
      read: true,
      icon: AlertCircle,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    {
      id: 8,
      type: 'achievement',
      title: 'Achievement Unlocked',
      message:
        "You've completed all your daily tasks! Claim your 50 bonus points.",
      time: '5 days ago',
      read: true,
      icon: Gift,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your campaign activities and community
              interactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm pb-2 border-b">
          <button className="px-3 py-2 font-medium border-b-2 border-video text-gray-900">
            All
          </button>
          <button className="px-3 py-2 text-muted-foreground hover:text-gray-900">
            Unread
          </button>
          <button className="px-3 py-2 text-muted-foreground hover:text-gray-900">
            Mentions
          </button>
          <button className="px-3 py-2 text-muted-foreground hover:text-gray-900">
            Comments
          </button>
        </div>

        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 hover:bg-gray-50 transition-colors flex items-start',
                  !notification.read && 'bg-blue-50/30',
                )}
              >
                <div
                  className={cn(
                    'shrink-0 rounded-full p-2 mr-4',
                    notification.iconBg,
                  )}
                >
                  <notification.icon
                    className={cn('h-5 w-5', notification.iconColor)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-x-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-x-2">
                        <h3 className="text-sm font-medium leading-none">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-video"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-x-2">
                        {notification.image && (
                          <img
                            src={notification.image}
                            alt=""
                            className="h-8 w-8 rounded-md object-cover"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center border-t border-border">
            <Button variant="ghost">Load More</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              Notification Highlights
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">New Badges</span>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">New Backers</span>
                </div>
                <span className="text-sm font-medium">27</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Unread Messages</span>
                </div>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Campaign Updates</span>
                </div>
                <span className="text-sm font-medium">2</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg border border-border p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              Notification Settings
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Email Notifications',
                  description: 'Receive daily digest of important activities',
                },
                {
                  title: 'Push Notifications',
                  description: 'Get instant alerts on your device',
                },
                {
                  title: 'SMS Notifications',
                  description: 'Receive text messages for urgent updates',
                },
                {
                  title: 'In-app Notifications',
                  description: 'Control which notifications appear in the app',
                },
              ].map((setting, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-100 pb-3"
                >
                  <div>
                    <h3 className="font-medium text-sm">{setting.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={i < 2} />
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Switch = ({ checked = false }) => {
  return (
    <div
      className={cn(
        'relative inline-flex h-5 w-10 items-center rounded-full transition-colors',
        checked ? 'bg-video' : 'bg-gray-200',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </div>
  );
};
