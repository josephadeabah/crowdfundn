import React from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignTabsProps {
  selectedTab: string;
  setSelectedTab: (
    tab: 'details' | 'donate' | 'updates' | 'comments' | 'backers' | 'faqs',
  ) => void;
  tabsRef: React.RefObject<HTMLDivElement>;
  campaign: SingleCampaignResponseDataType | null;
  isEquityCampaign: boolean;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({
  selectedTab,
  setSelectedTab,
  tabsRef,
  campaign,
  isEquityCampaign,
}) => {
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const tabs = [
    'details',
    'donate',
    'updates',
    'comments',
    'backers',
    ...(isEquityCampaign ? ['faqs'] : []),
  ].map((tab) => {
    let count = 0;
    if (tab === 'updates') {
      count = campaign?.updates?.length || 0;
    } else if (tab === 'comments') {
      count = campaign?.comments?.length || 0;
    } else if (tab === 'backers') {
      count = isEquityCampaign
        ? campaign?.total_investors || 0
        : campaign?.total_donors || 0;
    }

    const isDonateTabDisabled =
      tab === 'donate' && !campaign?.permissions?.accept_donations;

    const tabLabel =
      tab === 'donate' && isEquityCampaign
        ? 'Invest'
        : tab === 'backers' && isEquityCampaign
          ? 'Investors'
          : tab === 'faqs'
            ? 'FAQs'
            : tab.charAt(0).toUpperCase() + tab.slice(1);

    return {
      id: tab,
      label: tabLabel,
      count,
      disabled: isDonateTabDisabled,
    };
  });

  const renderTabContent = () => {
    if (selectedTab === 'details') {
      return (
        <div className="relative w-full h-full">
          <Image
            src={campaign?.media || '/bantuhive.svg'}
            alt={campaign?.title as string}
            layout="fill"
            objectFit="cover"
            unoptimized
            className="rounded-2xl"
            quality={100}
            priority
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.currentTarget.src = '/bantuhive.svg';
            }}
          />
        </div>
      );
    }

    // Placeholder content for other tabs
    if (selectedTab !== 'faqs') {
      return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12 border border-gray-200 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">
                {selectedTab === 'donate'
                  ? '💳'
                  : selectedTab === 'updates'
                    ? '📰'
                    : selectedTab === 'comments'
                      ? '💬'
                      : '👥'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {tabs.find((t) => t.id === selectedTab)?.label} View
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedTab === 'donate'
                ? 'Contribution options will be displayed here'
                : selectedTab === 'updates'
                  ? 'Latest news and campaign progress updates'
                  : selectedTab === 'comments'
                    ? 'Community discussions and feedback'
                    : 'Campaign supporters and investors list'}
            </p>
          </div>
        </div>
      );
    }

    return null; // FAQs tab content will be handled by CampaignFAQs component
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Vertical Tabs - Left Side (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/3 xl:w-1/4 bg-gray-50 p-6 lg:p-8">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-white text-green-600 shadow-md border border-green-100'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-800'
                } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!tab.disabled) {
                    setSelectedTab(tab.id as any);
                  }
                }}
                disabled={tab.disabled}
              >
                <span className="text-sm lg:text-base">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full min-w-6 text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Right Side */}
        <div className="lg:w-2/3 xl:w-3/4 p-6 lg:p-8">
          <div className="relative">
            {/* Mobile horizontal scroll for smaller screens */}
            <div className="lg:hidden relative mb-6">
              <div className="flex items-center justify-center">
                <button
                  onClick={() => scrollTabs('left')}
                  className="absolute left-0 z-10 bg-white shadow-md p-3 rounded-full flex items-center justify-center"
                >
                  <FaChevronLeft className="text-sm" />
                </button>

                <div
                  ref={tabsRef}
                  className="flex overflow-x-auto scrollbar-hide whitespace-nowrap pl-12 pr-12 gap-2 w-full"
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex-shrink-0 ${
                        selectedTab === tab.id
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!tab.disabled) {
                          setSelectedTab(tab.id as any);
                        }
                      }}
                      disabled={tab.disabled}
                    >
                      <span className="text-sm">{tab.label}</span>
                      {tab.count > 0 && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ml-2 ${
                            selectedTab === tab.id
                              ? 'bg-white text-green-600'
                              : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollTabs('right')}
                  className="absolute right-0 z-10 bg-white shadow-md p-3 rounded-full flex items-center justify-center"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTabs;
