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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default on small screens
  const [activeTab, setActiveTab] =
    useState<'general-dashboard'>('general-dashboard');

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
  };

  const navItems = [
    { name: 'general-dashboard', label: 'Dashboard', icon: <FaDashcube /> },
    { name: 'userManagement', label: 'User Manager', icon: <FiUser /> },
    { name: 'moneyTransfers', label: 'Transactions', icon: <FiDollarSign /> },
    { name: 'campaignsManager', label: 'Campaigns', icon: <BiSolidLayout /> },
    { name: 'contentManager', label: 'Content', icon: <FaBoxes /> },
    { name: 'promotions', label: 'Promotions', icon: <FiActivity /> },
    { name: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
    { name: 'support', label: 'Support', icon: <MdOutlineSupportAgent /> },
    { name: 'settings', label: 'Settings', icon: <FiSettings /> },
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
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 w-64 sm:w-80 md:w-96 lg:w-56 transition-all duration-300 ease-in-out bg-black text-gray-50 overflow-hidden lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="text-2xl font-semibold">Bantuhive Admin</div>
          {/* Close Icon for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-50 focus:outline-none"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col items-start space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 ${
                activeTab === item.name ? 'bg-gray-700' : ''
              }`}
              onClick={() => selectTab(item.name as 'general-dashboard')}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="mx-auto px-4 py-8">{tabContent[activeTab]}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
