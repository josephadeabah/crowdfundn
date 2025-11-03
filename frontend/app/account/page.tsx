'use client';

import { useState, useEffect } from 'react';
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
import { Landmark } from 'lucide-react';
import { FiArchive } from 'react-icons/fi';
import ArchivedCampaigns from './ArchivedCampaigns';

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

const ProfileTabs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['dashboard', 'fundraising']),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
          badge: 'New',
          badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
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
          badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
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
    }, 300);
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
    setTimeout(() => setLoading(false), 300);
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
    return badgeColor || 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  // Mobile sidebar component
  const MobileSidebar = () => (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative bg-white w-80 h-full overflow-y-auto transform transition-all duration-300 ease-out shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-gray-900 truncate text-lg">
                    Bantu Hive
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    <UserNameDisplay name={user?.full_name} />
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              >
                <Cross1Icon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-2 px-4">
              {tabGroups.map((group) => {
                const isExpanded = expandedGroups.has(group.id);
                const hasActiveTab = group.tabs.some(
                  (tab) => tab.label === activeTab,
                );

                return (
                  <div key={group.id} className="space-y-2">
                    <button
                      onClick={() => handleGroupToggle(group.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group border ${
                        hasActiveTab
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border-transparent hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`transition-transform duration-300 ${
                            hasActiveTab 
                              ? 'text-orange-500' 
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        >
                          {group.icon}
                        </span>
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transform transition-all duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        } ${
                          hasActiveTab 
                            ? 'text-orange-400' 
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-4 space-y-2 border-l-2 border-gray-100 pl-4 py-2">
                        {group.tabs.map((tab, index) => {
                          const isActive = activeTab === tab.label;
                          const isOnboarding =
                            showOnboarding &&
                            currentStep ===
                              allTabs.findIndex((t) => t.label === tab.label);

                          return (
                            <button
                              key={tab.label}
                              onClick={() => handleTabClick(tab.label)}
                              className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                isActive
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-100'
                              } ${isOnboarding ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                              style={{
                                animationDelay: isExpanded ? `${index * 50}ms` : '0ms'
                              }}
                            >
                              {/* Active state background */}
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl" />
                              )}
                              
                              <div className="flex items-center space-x-3 relative z-10">
                                <span
                                  className={`transition-transform duration-300 ${
                                    isActive
                                      ? 'text-white transform scale-110'
                                      : 'text-gray-400 group-hover:text-gray-600'
                                  }`}
                                >
                                  {tab.icon}
                                </span>
                                <span className="font-medium">{tab.label}</span>
                              </div>
                              {tab.badge && (
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-300 relative z-10 ${
                                    isActive 
                                      ? 'bg-white text-orange-600 shadow-sm' 
                                      : getBadgeColorClasses(tab.badgeColor)
                                  }`}
                                >
                                  {tab.badge}
                                </span>
                              )}
                              {isActive && (
                                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-full shadow-sm" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Premium Status Section */}
          <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            {hasPremium ? (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCrown className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-900 truncate">
                    {subscription.current_plan?.name} Plan
                  </p>
                  <p className="text-xs text-purple-600 font-medium">Active Subscription</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            ) : (
              <button
                onClick={handleSubscribeClick}
                className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <FaCashRegister className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-semibold block">Upgrade to Premium</span>
                  <span className="text-xs opacity-90">Unlock exclusive features</span>
                </div>
                <svg 
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <DropdownMenuIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-gray-900 truncate">Bantu Hive</h2>
                <p className="text-xs text-gray-600 truncate">
                  <UserNameDisplay name={user?.full_name} />
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Premium Badge */}
          {hasPremium && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
              <FaCrown className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900">Premium</span>
            </div>
          )}
        </div>

        {/* Current Tab Display */}
        <div className="px-4 pb-4">
          <h1 className="text-xl font-bold text-gray-900 animate-fade-in">
            {allTabs.find((tab) => tab.label === activeTab)?.label || 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-600 mt-1 animate-fade-in">
            {allTabs.find((tab) => tab.label === activeTab)?.description || 'Your account overview'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen lg:mt-0">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex lg:w-80 border-r border-gray-200/80 flex-col sticky top-0 bg-white/80 backdrop-blur-md h-screen shadow-lg">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/80 bg-gradient-to-br from-white to-gray-50/80">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Landmark className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-gray-900 truncate text-lg">Bantu Hive</h2>
                  <p className="text-sm text-gray-600 truncate">
                    <UserNameDisplay name={user?.full_name} />
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-2 px-4">
                {tabGroups.map((group) => {
                  const isExpanded = expandedGroups.has(group.id);
                  const hasActiveTab = group.tabs.some(
                    (tab) => tab.label === activeTab,
                  );

                  return (
                    <div key={group.id} className="space-y-2">
                      <button
                        onClick={() => handleGroupToggle(group.id)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group border ${
                          hasActiveTab
                            ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50 hover:border-gray-200 border-transparent hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`transition-transform duration-300 ${
                              hasActiveTab 
                                ? 'text-orange-500' 
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          >
                            {group.icon}
                          </span>
                          <span className="font-medium">{group.name}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transform transition-all duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${
                            hasActiveTab 
                              ? 'text-orange-400' 
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="ml-4 space-y-2 border-l-2 border-gray-100 pl-4 py-2">
                          {group.tabs.map((tab, index) => {
                            const isActive = activeTab === tab.label;
                            const isOnboarding =
                              showOnboarding &&
                              currentStep ===
                                allTabs.findIndex((t) => t.label === tab.label);

                            return (
                              <button
                                key={tab.label}
                                onClick={() => handleTabClick(tab.label)}
                                className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden ${
                                  isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-100'
                                } ${isOnboarding ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                                style={{
                                  animationDelay: isExpanded ? `${index * 50}ms` : '0ms'
                                }}
                              >
                                {/* Active state background */}
                                {isActive && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl" />
                                )}
                                
                                <div className="flex items-center space-x-3 relative z-10">
                                  <span
                                    className={`transition-transform duration-300 ${
                                      isActive
                                        ? 'text-white transform scale-110'
                                        : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                                  >
                                    {tab.icon}
                                  </span>
                                  <span className="font-medium">{tab.label}</span>
                                </div>
                                {tab.badge && (
                                  <span
                                    className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-300 relative z-10 ${
                                      isActive 
                                        ? 'bg-white text-orange-600 shadow-sm' 
                                        : getBadgeColorClasses(tab.badgeColor)
                                    }`}
                                  >
                                    {tab.badge}
                                  </span>
                                )}
                                {isActive && (
                                  <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-full shadow-sm" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Premium Status Section */}
            <div className="p-6 border-t border-gray-200/80 bg-gradient-to-br from-gray-50 to-white">
              {hasPremium ? (
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaCrown className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-purple-900 truncate">
                      {subscription.current_plan?.name} Plan
                    </p>
                    <p className="text-xs text-purple-600 font-medium">Active Subscription</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <FaCashRegister className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-semibold block">Upgrade to Premium</span>
                    <span className="text-xs opacity-90">Unlock exclusive features</span>
                  </div>
                  <svg 
                    className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50/50 to-white/50 overflow-auto lg:h-screen">
          {/* Desktop Content Header - Hidden on mobile */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {allTabs.find((tab) => tab.label === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-lg text-gray-600 mt-2 max-w-2xl">
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
          <div className="flex-1 overflow-auto px-4 lg:px-8 py-6">
            <div 
              role="tabpanel" 
              className="min-h-full animate-fade-in transition-all duration-500"
            >
              {allTabs.find((tab) => tab.label === activeTab)?.component || (
                <Dashboard />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white/80 backdrop-blur-md border-t border-gray-200/80 px-6 py-4 text-center">
            <p className="text-sm text-gray-600 animate-fade-in">
              © 2025 Bantu Hive Ltd • Building the future of African fundraising
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