'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from '@material-tailwind/react';
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import TransfersManager from './transfers/TransfersManager';
import GeneralDashboard from './general/GeneralDashboard';
import UserManagement from './users/UserManager';
import AnalyticsComponent from './analytics/Analytics';
import AdminSettings from './settings/Settings';
import PromotionScheduler from './promotions/Promotions';
import CampaignManager from './campaigns/CampaignsManager';
import ContentManagerAdminPage from './content/ContentManager';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default on small screens
  const [activeTab, setActiveTab] = useState<'general-dashboard'>('general-dashboard');

  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab as 'general-dashboard');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectTab = (tabName: 'general-dashboard') => {
    setActiveTab(tabName);
    // Close sidebar on mobile after selecting a tab
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { name: 'general-dashboard', label: 'Dashboard', icon: <PresentationChartBarIcon className="h-5 w-5" /> },
    { name: 'userManagement', label: 'User Manager', icon: <UserCircleIcon className="h-5 w-5" /> },
    { name: 'moneyTransfers', label: 'Transactions', icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { name: 'campaignsManager', label: 'Campaigns', icon: <InboxIcon className="h-5 w-5" /> },
    { name: 'contentManager', label: 'Content', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    { name: 'promotions', label: 'Promotions', icon: <PowerIcon className="h-5 w-5" /> },
    { name: 'analytics', label: 'Analytics', icon: <PresentationChartBarIcon className="h-5 w-5" /> },
    { name: 'support', label: 'Support', icon: <InboxIcon className="h-5 w-5" /> },
    { name: 'settings', label: 'Settings', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ];

  const tabContent = {
    'general-dashboard': <GeneralDashboard />,
    userManagement: <UserManagement />,
    moneyTransfers: <TransfersManager />,
    campaignsManager: <CampaignManager />,
    contentManager: <ContentManagerAdminPage />,
    promotions: <PromotionScheduler />,
    analytics: <AnalyticsComponent />,
    support: <h2>Support</h2>,
    settings: <AdminSettings />,
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Material Tailwind Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 w-64 sm:w-80 md:w-96 lg:w-56 transition-all duration-300 ease-in-out overflow-hidden lg:translate-x-0 lg:static lg:inset-0 z-50`}
      >
        <Card className="h-full w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray">
               Admin
            </Typography>
            {/* Close Icon for Mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.name}
                className={`${
                  activeTab === item.name ? 'bg-gray-700 text-white' : ''
                }`}
                onClick={() => selectTab(item.name as 'general-dashboard')}
              >
                <ListItemPrefix>{item.icon}</ListItemPrefix>
                {item.label}
              </ListItem>
            ))}
          </List>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="mx-auto px-4 py-8">{tabContent[activeTab]}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;