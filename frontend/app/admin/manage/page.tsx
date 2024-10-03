'use client';
import React, { useState } from 'react';
import {
  FiMenu,
  FiUser,
  FiDollarSign,
  FiXSquare,
  FiSliders,
  FiActivity,
  FiPieChart,
  FiSettings,
  FiSearch,
  FiDownload,
  FiX,
} from 'react-icons/fi';
import { HiExternalLink } from 'react-icons/hi';
import { FaChessBoard, FaDashcube, FaBoxes } from 'react-icons/fa';
import { BiSolidLayout } from 'react-icons/bi';
import { MdOutlineSupportAgent } from 'react-icons/md';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TransfersManager from './transfers/TransfersManager';
import GeneralDashboard from './general/GeneralDashboard';
import UserManagement from './users/UserManager';
import AnalyticsComponent from './analytics/Analytics';
import AdminSettings from './settings/Settings';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex h-screen  bg-white text-gray-800">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-56 overflow-y-auto transition duration-300 ease-in-out transform bg-black  lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between px-2 py-4 mt-4">
          <div className="flex items-center py-8 md:py-0">
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
          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'dashboard' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('dashboard')}
          >
            <FaDashcube className="w-6 h-6 mr-3" />
            <span>Dashboard</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'userManagement' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('userManagement')}
          >
            <FiUser className="w-6 h-6 mr-3" />
            <span>User Manager</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'moneyTransfers' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('moneyTransfers')}
          >
            <FiDollarSign className="w-6 h-6 mr-3" />
            <span>Transactions</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'campaignsManager'
                ? 'bg-gray-700 bg-opacity-25'
                : ''
            }`}
            onClick={() => selectTab('campaignsManager')}
          >
            <BiSolidLayout className="w-6 h-6 mr-3" />
            <span>Campaigns</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'contentManager' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('contentManager')}
          >
            <FaBoxes className="w-6 h-6 mr-3" />
            <span>Content Manager</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'promotions' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('promotions')}
          >
            <FiActivity className="w-6 h-6 mr-3" />
            <span> Promotions</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'analytics' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('analytics')}
          >
            <FiPieChart className="w-6 h-6 mr-3" />
            <span>Analytics</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'support' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('support')}
          >
            <MdOutlineSupportAgent className="w-6 h-6 mr-3" />
            <span>Support</span>
          </button>

          <button
            className={`w-full max-w-xl flex items-center px-4 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${
              activeTab === 'settings' ? 'bg-gray-700 bg-opacity-25' : ''
            }`}
            onClick={() => selectTab('settings')}
          >
            <FiSettings className="w-6 h-6 mr-3" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'dashboard' && <GeneralDashboard />}
            {activeTab === 'userManagement' && (
              <div>
                <UserManagement />
              </div>
            )}
            {activeTab === 'moneyTransfers' && (
              <div>
                <TransfersManager />
              </div>
            )}
            {activeTab === 'campaignsManager' && (
              <div>
                <h2>Campaigns Manager</h2>
              </div>
            )}
            {activeTab === 'contentManager' && (
              <div>
                <h2>Content Manager</h2>
              </div>
            )}
            {activeTab === 'promotions' && (
              <div>
                <h2>Promotions</h2>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div>
                <AnalyticsComponent />
              </div>
            )}
            {activeTab === 'support' && (
              <div>
                <h2>Support</h2>
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <AdminSettings />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
