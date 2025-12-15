// app/account/ProfileTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DashboardIcon,
  IconJarLogoIcon,
  GearIcon,
  RocketIcon,
  StarIcon,
  MaskOffIcon,
  PersonIcon,
  BarChartIcon,
  HeartIcon,
  GroupIcon,
  DropdownMenuIcon,
  Cross1Icon,
} from '@radix-ui/react-icons';
import { BiTransfer } from 'react-icons/bi';
import {
  FaCashRegister,
  FaCrown,
  FaUsers,
  FaChartLine,
  FaHandHoldingUsd,
} from 'react-icons/fa';
import { MdOutlinePayments, MdUpdate } from 'react-icons/md';
import { IoGitPullRequest } from 'react-icons/io5';
import Rewards from '@/app/account/Rewards';
import Campaigns from '@/app/account/Campaigns';
import Transfers from '@/app/account/Transfers';
import Donations from '@/app/account/Donations';
import CampaignUpdates from '@/app/account/Updates';
import Dashboard from '@/app/account/Dashboard';
import ProfileTabsLoader from '@/app/loaders/ProfileTabsLoader';
import AccountSettings from '@/app/account/settings/AccountSettings';
import OnboardingModal from '@/app/components/onboarding/OnboardingModal';
import Favorites from '@/app/account/Favorites';
import PledgesListPage from '@/app/account/Pledges';
import EquityInvestments from './EquityInvestments';
import { usePremium } from '@/app/context/premium/PremiumContext';
import { useAuth } from '../context/auth/AuthContext';
import { Landmark, UserCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { FiArchive } from 'react-icons/fi';
import ArchivedCampaigns from './ArchivedCampaigns';
import InvestmentClubsDashboard from './InvestmentClubsDashboard';
import ClubsListPage from './investor-clubs/ClubsListPage';

// Import better icons for clubs
import {
  Users,
  Building2,
  Briefcase,
  PieChart,
  Target,
  Handshake,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { DealRoom } from '../components/deal-room/DealRoom';
import MentorDashboard from '../components/mentor/MentorDashboard';

// Define proper TypeScript interfaces
interface Tab {
  label: string;
  icon: JSX.Element;
  component: JSX.Element;
  description: string;
  badge?: string | null;
  badgeColor?: string;
}

interface TabGroup {
  id: string;
  name: string;
  icon: JSX.Element;
  tabs: Tab[];
}

// Smart truncation component with tooltip
const UserNameDisplay = ({
  name,
  maxLength = 20,
}: {
  name?: string;
  maxLength?: number;
}) => {
  if (!name) return <span>User's Account</span>;

  const needsTruncation = name.length > maxLength;
  const displayName = needsTruncation
    ? `${name.substring(0, maxLength)}…`
    : name;

  return (
    <span
      className={`relative ${needsTruncation ? 'group cursor-help' : ''}`}
      title={needsTruncation ? name : undefined}
    >
      {displayName}'s Account
      {needsTruncation && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {name}'s Account
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900"></span>
        </span>
      )}
    </span>
  );
};

// Component to render scrollable tab list with gradient fade
const ScrollableTabList = ({
  children,
  hasManyTabs,
}: {
  children: React.ReactNode;
  hasManyTabs: boolean;
}) => {
  if (!hasManyTabs) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {children}
      </div>

      {/* Bottom fade gradient (only visible when scrolled) */}
      <div className="absolute bottom-0 left-0 right-4 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

const ProfileTabs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['dashboard', 'investing']),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const tabContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Get premium subscription status
  const { subscription, fetchSubscription } = usePremium();
  const [isPremiumDataLoaded, setIsPremiumDataLoaded] = useState(false);

  useEffect(() => {
    const loadPremiumData = async () => {
      try {
        await fetchSubscription();
      } catch (err) {
        console.error('Failed to load premium data:', err);
      } finally {
        setIsPremiumDataLoaded(true);
      }
    };

    if (!subscription) {
      loadPremiumData();
    } else {
      setIsPremiumDataLoaded(true);
    }
  }, [fetchSubscription, subscription]);

  // Grouped tabs with proper type definitions
  const tabGroups: TabGroup[] = [
    {
      id: 'dashboard',
      name: 'Overview',
      icon: <BarChartIcon className="w-4 h-4" />,
      tabs: [
        {
          label: 'Dashboard',
          icon: <DashboardIcon className="w-4 h-4" />,
          component: <Dashboard />,
          description: 'Your overall dashboard with activities and analytics.',
        },
      ],
    },
    {
      id: 'investing',
      name: 'Investing',
      icon: <FaChartLine className="w-4 h-4" />,
      tabs: [
        {
          label: 'Investments',
          icon: <MaskOffIcon className="w-4 h-4" />,
          component: <EquityInvestments />,
          description: 'Manage your equity investments and portfolio.',
        },
        {
          label: 'Your Clubs',
          icon: <Briefcase className="w-4 h-4" />,
          component: <InvestmentClubsDashboard />,
          description:
            'Manage clubs you belong to and track your contributions.',
          badge: 'New',
          badgeColor: 'bg-green-100 text-green-800',
        },
        {
          label: 'Venture Clubs',
          icon: <Building2 className="w-4 h-4" />,
          component: <ClubsListPage />,
          description:
            'Discover and join investment clubs to collaborate with other investors.',
          badge: 'New',
          badgeColor: 'bg-green-100 text-green-800',
        },
        {
          label: 'Deal Room',
          icon: <Handshake className="w-4 h-4" />,
          component: <DealRoom />,
          description:
            'Access exclusive investment opportunities and connect with founders.',
          badge: 'Dev',
          badgeColor: 'bg-yellow-100 text-yellow-800',
        },
      ],
    },
    {
      id: 'fundraising',
      name: 'Fundraising',
      icon: <FaHandHoldingUsd className="w-4 h-4" />,
      tabs: [
        {
          label: 'Campaigns',
          icon: <RocketIcon className="w-4 h-4" />,
          component: <Campaigns />,
          description: 'Create and manage your fundraising campaigns.',
        },
        {
          label: 'Archives',
          icon: <FiArchive className="w-4 h-4" />,
          component: <ArchivedCampaigns />,
          description: 'View and manage your archived campaigns.',
        },
        {
          label: 'Backers',
          icon: <FaUsers className="w-4 h-4" />,
          component: <Donations />,
          description: 'Manage your backers and send thank you messages.',
        },
        {
          label: 'Pledges',
          icon: <IoGitPullRequest className="w-4 h-4" />,
          component: <PledgesListPage />,
          description: 'View and manage your supporter pledges.',
        },
        {
          label: 'Updates',
          icon: <MdUpdate className="w-4 h-4" />,
          component: <CampaignUpdates />,
          description: 'Add updates and communicate with your supporters.',
        },
        {
          label: 'Rewards',
          icon: <IconJarLogoIcon className="w-4 h-4" />,
          component: <Rewards />,
          description: 'Manage rewards for your backers.',
        },
        {
          label: 'Mentors',
          icon: <UserCheck className="w-4 h-4" />,
          component: <MentorDashboard />,
          description: 'Manage mentor relationships and find mentors.',
          badge: 'New',
          badgeColor: 'bg-green-100 text-green-800',
        },
      ],
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: <MdOutlinePayments className="w-4 h-4" />,
      tabs: [
        {
          label: 'Transfers',
          icon: <BiTransfer className="w-4 h-4" />,
          component: <Transfers />,
          description: 'View and manage your fund transfers.',
        },
      ],
    },
    {
      id: 'engagement',
      name: 'Engagement',
      icon: <HeartIcon className="w-4 h-4" />,
      tabs: [
        {
          label: 'Favorites',
          icon: <StarIcon className="w-4 h-4" />,
          component: <Favorites />,
          description: 'Your favorite campaigns and projects.',
        },
      ],
    },
    {
      id: 'settings',
      name: 'Account',
      icon: <PersonIcon className="w-4 h-4" />,
      tabs: [
        {
          label: 'Settings',
          icon: <GearIcon className="w-4 h-4" />,
          component: <AccountSettings />,
          description: 'Manage your account and payment settings.',
          badge: 'Important',
          badgeColor: 'bg-red-100 text-red-800',
        },
      ],
    },
  ];

  // Flatten all tabs for easy access
  const allTabs: Tab[] = tabGroups.flatMap((group) => group.tabs);

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const hashTab = window.location.hash.replace('#', '');

    const urlParams = new URLSearchParams(window.location.search);
    const subscribeParam = urlParams.get('subscribe');

    if (subscribeParam === 'true') {
      window.history.replaceState(null, '', '/account#Settings?subscribe=true');
      setActiveTab('Settings');
    } else if (hashTab && allTabs.find((tab) => tab.label === hashTab)) {
      setActiveTab(hashTab);
    } else if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab(allTabs[0]?.label || '');
    }

    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab) {
      const url = new URL(window.location.href);
      url.hash = activeTab;
      window.history.replaceState(null, '', url.toString());
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const handleTabClick = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    // Close mobile menu when a tab is selected
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleSubscribeClick = () => {
    const url = new URL(window.location.href);
    url.hash = 'Settings';
    url.searchParams.set('subscribe', 'true');
    window.history.replaceState(null, '', url.toString());

    setActiveTab('Settings');
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  const hasPremium = subscription?.has_premium;

  if (loading) {
    return <ProfileTabsLoader />;
  }

  // Helper function to get badge color classes
  const getBadgeColorClasses = (badgeColor?: string) => {
    return badgeColor || 'bg-blue-100 text-blue-800';
  };

  // Helper to check if group has many tabs
  const hasManyTabs = (tabs: Tab[]) => tabs.length > 4;

  // Mobile sidebar component
  const MobileSidebar = () => (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative bg-white w-80 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 truncate">
                  Bantu Hive
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  <UserNameDisplay name={user?.full_name} />
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Cross1Icon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {tabGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.id);
                const hasActiveTab = group.tabs.some(
                  (tab) => tab.label === activeTab,
                );
                const manyTabs = hasManyTabs(group.tabs);

                return (
                  <div key={group.id} className="space-y-1">
                    <button
                      onClick={() => handleGroupToggle(group.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                        hasActiveTab
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`${hasActiveTab ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}
                        >
                          {group.icon}
                        </span>
                        <span>{group.name}</span>
                      </div>
                      <div className="flex items-center">
                        {manyTabs && isExpanded && (
                          <span className="text-xs text-gray-500 mr-2">
                            {group.tabs.length} tabs
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="ml-4 border-l-2 border-gray-100 pl-3">
                        <ScrollableTabList hasManyTabs={manyTabs}>
                          {group.tabs.map((tab) => {
                            const isActive = activeTab === tab.label;
                            const isOnboarding =
                              showOnboarding &&
                              currentStep ===
                                allTabs.findIndex((t) => t.label === tab.label);

                            return (
                              <button
                                key={tab.label}
                                onClick={() => handleTabClick(tab.label)}
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 group relative mb-1 ${
                                  isActive
                                    ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-600 bg-orange-50'
                                    : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                } ${isOnboarding ? 'ring-2 ring-green-400' : ''}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={
                                      isActive
                                        ? 'text-orange-600'
                                        : 'text-gray-400 group-hover:text-gray-600'
                                    }
                                  >
                                    {tab.icon}
                                  </span>
                                  <span className="text-left">{tab.label}</span>
                                </div>
                                {tab.badge && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${getBadgeColorClasses(tab.badgeColor)}`}
                                  >
                                    {tab.badge}
                                  </span>
                                )}
                                {isActive && (
                                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full" />
                                )}
                              </button>
                            );
                          })}
                        </ScrollableTabList>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Premium Status Section */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            {hasPremium ? (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <FaCrown className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-purple-900 truncate">
                    {subscription.current_plan?.name} Plan
                  </p>
                  <p className="text-xs text-purple-600">Active</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSubscribeClick}
                className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCashRegister className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Upgrade to Premium</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <DropdownMenuIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 truncate">
                  Bantu Hive
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  <UserNameDisplay name={user?.full_name} />
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Premium Badge */}
          {hasPremium && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1 rounded-full border border-purple-200">
              <FaCrown className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-900">
                Premium
              </span>
            </div>
          )}
        </div>

        {/* Current Tab Display */}
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-gray-900">
            {allTabs.find((tab) => tab.label === activeTab)?.label ||
              'Dashboard'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {allTabs.find((tab) => tab.label === activeTab)?.description ||
              'Your account overview'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen lg:mt-0">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-64 border-r border-gray-200 flex-col sticky top-0 bg-white h-screen">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 truncate">
                    Bantu Hive
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    <UserNameDisplay name={user?.full_name} />
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {tabGroups.map((group) => {
                  const isExpanded = expandedGroups.has(group.id);
                  const hasActiveTab = group.tabs.some(
                    (tab) => tab.label === activeTab,
                  );
                  const manyTabs = hasManyTabs(group.tabs);

                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        onClick={() => handleGroupToggle(group.id)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                          hasActiveTab
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`${hasActiveTab ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}
                          >
                            {group.icon}
                          </span>
                          <span>{group.name}</span>
                        </div>
                        <div className="flex items-center">
                          {manyTabs && isExpanded && (
                            <span className="text-xs text-gray-500 mr-2">
                              {group.tabs.length} tabs
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div
                          ref={(el) =>
                            (tabContainerRefs.current[group.id] = el)
                          }
                          className="ml-4 border-l-2 border-gray-100 pl-3"
                        >
                          <ScrollableTabList hasManyTabs={manyTabs}>
                            {group.tabs.map((tab) => {
                              const isActive = activeTab === tab.label;
                              const isOnboarding =
                                showOnboarding &&
                                currentStep ===
                                  allTabs.findIndex(
                                    (t) => t.label === tab.label,
                                  );

                              return (
                                <button
                                  key={tab.label}
                                  onClick={() => handleTabClick(tab.label)}
                                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 group relative mb-1 ${
                                    isActive
                                      ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-600 bg-orange-50'
                                      : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                  } ${isOnboarding ? 'ring-2 ring-green-400' : ''}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span
                                      className={
                                        isActive
                                          ? 'text-orange-600'
                                          : 'text-gray-400 group-hover:text-gray-600'
                                      }
                                    >
                                      {tab.icon}
                                    </span>
                                    <span className="text-left">
                                      {tab.label}
                                    </span>
                                  </div>
                                  {tab.badge && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${getBadgeColorClasses(tab.badgeColor)}`}
                                    >
                                      {tab.badge}
                                    </span>
                                  )}
                                  {isActive && (
                                    <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </ScrollableTabList>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Premium Status Section */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              {hasPremium ? (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FaCrown className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-purple-900 truncate">
                      {subscription.current_plan?.name} Plan
                    </p>
                    <p className="text-xs text-purple-600">Active</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FaCashRegister className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    Upgrade to Premium
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-auto lg:h-screen">
          {/* Desktop Content Header - Hidden on mobile */}
          <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {allTabs.find((tab) => tab.label === activeTab)?.label ||
                    'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {allTabs.find((tab) => tab.label === activeTab)
                    ?.description || 'Your account overview'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Add future header actions here */}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto px-4 py-4">
            <div role="tabpanel" className="min-h-full">
              {allTabs.find((tab) => tab.label === activeTab)?.component || (
                <Dashboard />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Bantu Hive Ltd • Building the future of fundraising
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          completeOnboarding={completeOnboarding}
          tabs={allTabs}
        />
      )}
    </div>
  );
};

export default ProfileTabs;
