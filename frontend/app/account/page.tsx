'use client';

import { useState, useEffect } from 'react';
import {
  DashboardIcon,
  HandIcon,
  IconJarLogoIcon,
  GearIcon,
  RocketIcon,
  ChatBubbleIcon,
  StarIcon,
  MaskOffIcon,
} from '@radix-ui/react-icons';
import { HiOutlineTruck } from 'react-icons/hi';
import { BiTransfer } from 'react-icons/bi';
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
import { FaCashRegister, FaCrown } from 'react-icons/fa';
import { usePremium } from '@/app/context/premium/PremiumContext';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

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

  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      component: <Dashboard />,
      description:
        'Your overall dashboard where you can see an overview of activities and analytics.',
    },
    {
      label: 'Investments',
      icon: <MaskOffIcon />,
      component: <EquityInvestments />,
      description: 'Manage your equity investments and portfolio.',
    },
    {
      label: 'Backers',
      icon: <HandIcon />,
      component: <Donations />,
      description: 'Manage your backers and send thank you to them here.',
    },
    {
      label: 'Transfers',
      icon: <BiTransfer />,
      component: <Transfers />,
      description: 'View and manage your transfers.',
    },
    {
      label: 'Pledges',
      icon: <HiOutlineTruck />,
      component: <PledgesListPage />,
      description: 'View and manage your pledges here.',
    },
    {
      label: 'Rewards',
      icon: <IconJarLogoIcon />,
      component: <Rewards />,
      description: 'Receive and give rewards to your backers here.',
    },
    {
      label: 'Campaigns',
      icon: <RocketIcon />,
      component: <Campaigns />,
      description: 'Create and manage your fundraising campaigns.',
    },
    {
      label: 'Updates',
      icon: <ChatBubbleIcon />,
      component: <CampaignUpdates />,
      description: 'Add your fundraising updates in this tab.',
    },
    {
      label: 'Favorites',
      icon: <StarIcon />,
      component: <Favorites />,
      description: 'View your favorited campaigns here.',
    },
    {
      label: 'Settings',
      icon: <GearIcon />,
      component: <AccountSettings />,
      description:
        'Manage your account and Payment settings here. <p class="text-white bg-red-500 text-xs px-1">IMPORTANT: Please add your bank or mobile money account in this tab after you click Finish or Skip button.</p>',
    },
  ];

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const hashTab = window.location.hash.replace('#', '');

    const urlParams = new URLSearchParams(window.location.search);
    const subscribeParam = urlParams.get('subscribe');

    if (subscribeParam === 'true') {
      window.history.replaceState(null, '', '/account#Settings?subscribe=true');
      setActiveTab('Settings');
    } else if (hashTab && tabs.find((tab) => tab.label === hashTab)) {
      setActiveTab(hashTab);
    } else if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab(tabs[0].label);
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
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

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto flex flex-col mt-0 md:flex-row h-screen">
        {/* Tabs Menu */}
        <div className="md:w-1/6 border-b h-auto md:h-screen md:border-b-0 md:border-r-2 border-dashed border-orange-200 flex flex-col sticky top-0">
          <div className="flex flex-col h-full">
            <div
              className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-2 space-x-1 lg:space-x-0 lg:space-y-1"
              aria-label="Tabs"
            >
              {tabs.map(({ label, icon }, index) => {
                const isActive = activeTab === label;
                const isOnboarding = showOnboarding && currentStep === index;

                return (
                  <button
                    key={label}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap min-w-fit lg:min-w-full lg:w-full relative group ${
                      isActive
                        ? 'border-b-2 border-2 border-dashed md:border-b-0 md:border-l-2 md:border-r-0 border-orange-200 text-orange-600'
                        : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 ${
                      isOnboarding ? 'bg-green-600 text-white' : ''
                    }`}
                    onClick={() => handleTabClick(label)}
                    aria-selected={isActive}
                    aria-controls={`vertical-tab-${label}`}
                    role="tab"
                    id={`tab-${label}`}
                  >
                    <span className="mr-2">{icon}</span>
                    {label}
                    {isActive && (
                      <span className="ml-2 relative">
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Subscribe/Plan */}
            <div className="sticky bottom-0 bg-white pt-2 pb-4 px-3 border-t border-dashed border-orange-200">
              {hasPremium ? (
                <div className="w-full py-2 px-4 z-50 border-2 border-purple-600 text-purple-800 rounded-full text-center shadow-sm">
                  <div className="flex text-xs items-center justify-center mb-1">
                    <FaCrown className="mr-2" />
                    <div className="opacity-90">
                      {subscription.current_plan?.name} Plan
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  className="w-full py-2 px-4 z-50 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300 shadow-sm"
                >
                  <FaCashRegister className="mr-2" />
                  Subscribe plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col bg-amber-100 px-3 mb-0 overflow-auto h-full md:h-screen [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          <div
            role="tabpanel"
            id={`vertical-tab-${activeTab}`}
            className="flex-1 mb-8"
          >
            {tabs.find((tab) => tab.label === activeTab)?.component}
          </div>
          <div className="bg-white w-full m-0 text-center py-4 text-gray-600">
            © 2025 Bantu Hive Ltd
          </div>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completeOnboarding={completeOnboarding}
            tabs={tabs}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
