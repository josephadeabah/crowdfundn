'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
} from '@material-tailwind/react';
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import TransfersManager from './transfers/TransfersManager';
import GeneralDashboard from './general/GeneralDashboard';
import UserManagement from './users/UserManager';
import AnalyticsComponent from './analytics/Analytics';
import AdminSettings from './settings/Settings';
import PromotionScheduler from './promotions/Promotions';
import CampaignManager from './campaigns/CampaignsManager';
import ContentManagerAdminPage from './content/ContentManager';
import { CampaignReview } from './equitycampaigns/CampaignReview';
import KYCReview from './kyc/KYCReview';

// Type definitions for better type safety
type TabGroup = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: TabItem[];
  badgeCount?: number;
};

type TabItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  badgeCount?: number;
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('general-dashboard');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      dashboard: true,
      content: false,
      financial: false,
      administration: false,
    },
  );

  // Initialize with default open accordions
  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      setActiveTab(storedTab);
    }

    const storedAccordions = localStorage.getItem('openAccordions');
    if (storedAccordions) {
      setOpenAccordions(JSON.parse(storedAccordions));
    }
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
      localStorage.setItem('openAccordions', JSON.stringify(openAccordions));
    }
  }, [activeTab, openAccordions]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAccordion = (group: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Tab groups configuration - easily extensible
  const tabGroups: TabGroup[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
      items: [
        {
          id: 'general-dashboard',
          label: 'Overview',
          icon: <ChartBarIcon className="h-5 w-5" />,
          component: <GeneralDashboard />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <PresentationChartBarIcon className="h-5 w-5" />,
          component: <AnalyticsComponent />,
          badgeCount: 3, // Example badge
        },
      ],
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      items: [
        {
          id: 'campaignsManager',
          label: 'All Campaigns',
          icon: <InboxIcon className="h-5 w-5" />,
          component: <CampaignManager />,
        },
        {
          id: 'campaignReview',
          label: 'Campaign Review',
          icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
          component: <CampaignReview />,
          badgeCount: 5, // Pending reviews
        },
        {
          id: 'kycReview',
          label: 'KYC Review',
          icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
          component: <KYCReview />,
          badgeCount: 5, // Pending reviews
        },
        {
          id: 'contentManager',
          label: 'Content Manager',
          icon: <Cog6ToothIcon className="h-5 w-5" />,
          component: <ContentManagerAdminPage />,
        },
        {
          id: 'promotions',
          label: 'Promotions',
          icon: <MegaphoneIcon className="h-5 w-5" />,
          component: <PromotionScheduler />,
        },
      ],
    },
    {
      id: 'financial',
      title: 'Financial',
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      items: [
        {
          id: 'moneyTransfers',
          label: 'Transactions',
          icon: <ShoppingBagIcon className="h-5 w-5" />,
          component: <TransfersManager />,
        },
        {
          id: 'payouts',
          label: 'Payouts',
          icon: <ShieldCheckIcon className="h-5 w-5" />,
          component: <div>Payouts Management</div>, // Replace with actual component
        },
      ],
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
      items: [
        {
          id: 'userManagement',
          label: 'User Manager',
          icon: <UsersIcon className="h-5 w-5" />,
          component: <UserManagement />,
        },
        {
          id: 'support',
          label: 'Support',
          icon: <LifebuoyIcon className="h-5 w-5" />,
          component: <div>Support Center</div>, // Replace with actual component
          badgeCount: 12, // Open tickets
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Cog6ToothIcon className="h-5 w-5" />,
          component: <AdminSettings />,
        },
      ],
    },
  ];

  // Find the active tab component
  const activeComponent = tabGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === activeTab)?.component || <GeneralDashboard />;

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 w-64 sm:w-80 md:w-96 lg:w-72 transition-all duration-300 ease-in-out overflow-hidden lg:translate-x-0 lg:static lg:inset-0 z-50`}
      >
        <Card className="h-full w-full p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto">
          <div className="mb-2 p-4 flex justify-between items-center">
            <Typography variant="h5" color="blue-gray">
              Admin Dashboard
            </Typography>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <List className="p-0">
            {tabGroups.map((group) => (
              <Accordion
                key={group.id}
                open={openAccordions[group.id]}
                icon={
                  <ChevronDownIcon
                    className={`mx-auto h-4 w-4 transition-transform ${
                      openAccordions[group.id] ? 'rotate-180' : ''
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={openAccordions[group.id]}>
                  <AccordionHeader
                    onClick={() => toggleAccordion(group.id)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>{group.icon}</ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      {group.title}
                    </Typography>
                    {group.badgeCount && (
                      <Chip
                        value={group.badgeCount}
                        size="sm"
                        variant="ghost"
                        color="red"
                        className="rounded-full"
                      />
                    )}
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {group.items.map((item) => (
                      <ListItem
                        key={item.id}
                        className={`${
                          activeTab === item.id
                            ? 'bg-gray-100 font-semibold'
                            : ''
                        } pl-8`}
                        onClick={() => selectTab(item.id)}
                      >
                        <ListItemPrefix>{item.icon}</ListItemPrefix>
                        {item.label}
                        {item.badgeCount && (
                          <Chip
                            value={item.badgeCount}
                            size="sm"
                            variant="ghost"
                            color="red"
                            className="ml-auto rounded-full"
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            ))}
          </List>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="mx-auto px-4 py-8 max-w-7xl">{activeComponent}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
