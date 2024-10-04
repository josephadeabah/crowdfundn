'use client';
import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiSettings,
  FiX,
} from 'react-icons/fi';
import { FaDashcube, FaBoxes } from 'react-icons/fa';
import { BiSolidLayout } from 'react-icons/bi';
import { MdOutlineSupportAgent } from 'react-icons/md';
import TransfersManager from './transfers/TransfersManager';
import GeneralDashboard from './general/GeneralDashboard';
import UserManagement from './users/UserManager';
import AnalyticsComponent from './analytics/Analytics';
import AdminSettings from './settings/Settings';
import PromotionScheduler from './promotions/Promotions';
import CampaignManager from './campaigns/CampaignsManager';
import ContentManagerAdminPage from './content/ContentManager';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  type TabNames =
    | 'dashboard'
    | 'userManagement'
    | 'moneyTransfers'
    | 'campaignsManager'
    | 'contentManager'
    | 'promotions'
    | 'analytics'
    | 'support'
    | 'settings';

  // Initialize state for activeTab with default value
  const [activeTab, setActiveTab] = useState<TabNames>('dashboard');

  // Use useEffect to access localStorage only on the client
  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab as TabNames);
    }
  }, []);

  useEffect(() => {
    // Save the active tab in localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectTab = (tabName: TabNames) => {
    setActiveTab(tabName);
  };

  // Navigation items
  const navItems = [
    { name: 'dashboard', label: 'Dashboard', icon: <FaDashcube /> },
    { name: 'userManagement', label: 'User Manager', icon: <FiUser /> },
    { name: 'moneyTransfers', label: 'Transactions', icon: <FiDollarSign /> },
    { name: 'campaignsManager', label: 'Campaigns', icon: <BiSolidLayout /> },
    { name: 'contentManager', label: 'Content', icon: <FaBoxes /> },
    { name: 'promotions', label: 'Promotions', icon: <FiActivity /> },
    { name: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
    { name: 'support', label: 'Support', icon: <MdOutlineSupportAgent /> },
    { name: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const tabContent: Record<TabNames, JSX.Element> = {
    dashboard: <GeneralDashboard />,
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
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-56 overflow-y-auto transition duration-300 ease-in-out transform bg-black lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center py-4 md:py-0">
            <span className="text-2xl font-semibold text-gray-50">
              Bantuhive Admin
            </span>
          </div>
          {/* Close Icon */}
          <button
            onClick={toggleSidebar}
            className="text-gray-50 focus:outline-none lg:hidden"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col items-center">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
                activeTab === item.name ? 'bg-gray-700 bg-opacity-25' : ''
              }`}
              onClick={() => selectTab(item.name as TabNames)}
            >
              <span className="w-6 h-6 mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto px-2 py-8">{tabContent[activeTab]}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
