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
  ExclamationTriangleIcon,
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
import AllKYCs from './kyc/AllKYCs';
import { useUserContext } from '@/app/context/users/UserContext';
import { UserProfile } from '@/app/types/user_profiles.types';
import { CrownIcon } from 'lucide-react';
import PayoutsManager from './payouts/Payouts';
import PremiumUsers from './users/PremiumUsers';
import { FaExclamationTriangle } from 'react-icons/fa';
import ReportsManager from './reports/ReportsManager';
import AdminMentorApplications from './mentors/AdminMentorApplications';

// Type definitions for better type safety
type TabGroup = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: TabItem[];
  badgeCount?: number;
  requiredRole?: string[];
  requiredAdmin?: boolean;
};

type TabItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  badgeCount?: number;
  requiredRole?: string[];
  requiredAdmin?: boolean;
};

// Role definitions matching your system
const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MODERATOR: 'Moderator',
} as const;

// Role hierarchy - higher roles inherit permissions of lower roles
const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 100,
  [ROLES.MANAGER]: 80,
  [ROLES.MODERATOR]: 60,
};

// Helper function to check if user has required role
const hasRequiredRole = (
  user: UserProfile | null,
  requiredRoles?: string[],
  requiredAdmin?: boolean,
): boolean => {
  if (!user) return false;

  // Check admin access first (top-level permission)
  if (requiredAdmin && !user.admin) return false;

  // If no specific roles required and admin check passed, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has any of the required roles
  const userRoles = user.roles?.map((role) => role.name) || [];

  // Get user's highest role level
  let userRoleLevel = 0;
  if (user.admin) {
    userRoleLevel = ROLE_HIERARCHY[ROLES.ADMIN]; // Admin gets highest access
  } else {
    userRoleLevel = Math.max(
      ...userRoles.map((role) => {
        // Handle role names that might not exactly match our constants
        if (role === ROLES.ADMIN) return ROLE_HIERARCHY[ROLES.ADMIN];
        if (role === ROLES.MANAGER) return ROLE_HIERARCHY[ROLES.MANAGER];
        if (role === ROLES.MODERATOR) return ROLE_HIERARCHY[ROLES.MODERATOR];
        return 0;
      }),
    );
  }

  return requiredRoles.some((requiredRole) => {
    let requiredRoleLevel = 0;

    // Map required role to hierarchy level
    if (requiredRole === ROLES.ADMIN)
      requiredRoleLevel = ROLE_HIERARCHY[ROLES.ADMIN];
    else if (requiredRole === ROLES.MANAGER)
      requiredRoleLevel = ROLE_HIERARCHY[ROLES.MANAGER];
    else if (requiredRole === ROLES.MODERATOR)
      requiredRoleLevel = ROLE_HIERARCHY[ROLES.MODERATOR];

    return userRoleLevel >= requiredRoleLevel;
  });
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

  const { userAccountData } = useUserContext();

  // Tab groups configuration with role-based access
  const tabGroups: TabGroup[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <PresentationChartBarIcon className="h-5 w-5" />,
      requiredAdmin: true, // Only top-level admins can access dashboard section
      items: [
        {
          id: 'general-dashboard',
          label: 'Overview',
          icon: <ChartBarIcon className="h-5 w-5" />,
          component: <GeneralDashboard />,
          requiredAdmin: true, // Only top-level admins can access general dashboard
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <PresentationChartBarIcon className="h-5 w-5" />,
          component: <AnalyticsComponent />,
          badgeCount: 3,
          requiredAdmin: true, // Only top-level admins can access analytics
        },
      ],
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
      items: [
        {
          id: 'campaignsManager',
          label: 'All Campaigns',
          icon: <InboxIcon className="h-5 w-5" />,
          component: <CampaignManager />,
          requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'campaignReview',
          label: 'Campaign Review',
          icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
          component: <CampaignReview />,
          badgeCount: 5,
          requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'kycReview',
          label: 'KYC Review',
          icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
          component: <KYCReview />,
          badgeCount: 5,
          requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'contentManager',
          label: 'Content Manager',
          icon: <Cog6ToothIcon className="h-5 w-5" />,
          component: <ContentManagerAdminPage />,
          requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <FaExclamationTriangle className="h-5 w-5" />,
          component: <ReportsManager />,
          badgeCount: 5, // You can dynamically calculate this
          requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
          requiredAdmin: true,
        },
        {
          id: 'promotions',
          label: 'Promotions',
          icon: <MegaphoneIcon className="h-5 w-5" />,
          component: <PromotionScheduler />,
          requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
        },
      ],
    },
    {
      id: 'financial',
      title: 'Financial',
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
      items: [
        {
          id: 'moneyTransfers',
          label: 'Transactions',
          icon: <ShoppingBagIcon className="h-5 w-5" />,
          component: <TransfersManager />,
          requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'payouts',
          label: 'Payouts',
          icon: <ShieldCheckIcon className="h-5 w-5" />,
          component: <PayoutsManager />,
          requiredRole: [ROLES.MANAGER, ROLES.ADMIN],
        },
      ],
    },
    {
      id: 'administration',
      title: 'Administration',
      icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
      requiredAdmin: true, // Only admins can access administration section
      items: [
        {
          id: 'userManagement',
          label: 'User Manager',
          icon: <UsersIcon className="h-5 w-5" />,
          component: <UserManagement />,
          requiredAdmin: true, // Only full admins can manage users
        },
        {
          id: 'mentorManagement',
          label: 'Mentor Applications',
          icon: <UserCircleIcon className="h-5 w-5" />,
          component: <AdminMentorApplications/>,
          requiredAdmin: true,
        },
        {
          id: 'allKycs',
          label: 'All KYC Records',
          icon: <ShieldCheckIcon className="h-5 w-5" />,
          component: <AllKYCs />,
          requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'support',
          label: 'Support',
          icon: <LifebuoyIcon className="h-5 w-5" />,
          component: <div>Support Center</div>,
          badgeCount: 12,
          requiredRole: [ROLES.MODERATOR, ROLES.MANAGER, ROLES.ADMIN],
        },
        {
          id: 'premiumUsers',
          label: 'Premium Users',
          icon: <CrownIcon className="h-5 w-5" />, // You'll need to import CrownIcon or use another icon
          component: <PremiumUsers />,
          requiredAdmin: true,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Cog6ToothIcon className="h-5 w-5" />,
          component: <AdminSettings />,
          requiredAdmin: true, // Only full admins can access settings
        },
      ],
    },
  ];

  // Filter tab groups and items based on user permissions
  const filteredTabGroups = React.useMemo(() => {
    return tabGroups
      .filter((group) =>
        hasRequiredRole(
          userAccountData,
          group.requiredRole,
          group.requiredAdmin,
        ),
      )
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          hasRequiredRole(
            userAccountData,
            item.requiredRole,
            item.requiredAdmin,
          ),
        ),
      }))
      .filter((group) => group.items.length > 0); // Remove empty groups
  }, [userAccountData]);

  // Get all accessible tabs
  const accessibleTabs = React.useMemo(() => {
    return filteredTabGroups.flatMap((group) => group.items);
  }, [filteredTabGroups]);

  // Initialize with default active tab
  useEffect(() => {
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab && accessibleTabs.some((tab) => tab.id === storedTab)) {
      setActiveTab(storedTab);
    } else if (accessibleTabs.length > 0) {
      // Set to first accessible tab if stored tab is not accessible
      setActiveTab(accessibleTabs[0].id);
    }
  }, [accessibleTabs]);

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
    if (accessibleTabs.some((tab) => tab.id === tabId)) {
      setActiveTab(tabId);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  };

  // Find the active tab component
  const activeComponent = accessibleTabs.find(
    (item) => item.id === activeTab,
  )?.component;

  // If user has no access to any tabs, show access denied
  if (filteredTabGroups.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Contact your administrator for access.
          </p>
        </div>
      </div>
    );
  }

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
            {filteredTabGroups.map((group) => (
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
        <main className="mx-auto px-4 py-8 max-w-7xl">
          {activeComponent || (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No Access
                </h2>
                <p className="text-gray-600">
                  You don't have permission to access this section.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
