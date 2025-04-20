import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignTabsProps {
  selectedTab: string;
  setSelectedTab: (
    tab: 'details' | 'donate' | 'updates' | 'comments' | 'backers',
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

  return (
    <div className="relative">
      <div className="flex items-center mb-6">
        <button
          onClick={() => scrollTabs('left')}
          className="absolute left-0 z-10 bg-white dark:text-gray-100 shadow-md p-2 rounded-full md:hidden"
        >
          <FaChevronLeft />
        </button>
        <div
          ref={tabsRef}
          className="flex overflow-x-auto scrollbar-hide whitespace-nowrap"
        >
          {['details', 'donate', 'updates', 'comments', 'backers'].map(
            (tab) => {
              let count = 0;
              if (tab === 'updates') {
                count = campaign?.updates?.length || 0;
              } else if (tab === 'comments') {
                count = campaign?.comments?.length || 0;
              } else if (tab === 'backers') {
                count = campaign?.total_donors || 0;
              }

              const isDonateTabDisabled =
                tab === 'donate' && !campaign?.permissions?.accept_donations;

              const tabLabel =
                tab === 'donate' && isEquityCampaign
                  ? 'Invest'
                  : tab === 'backers' && isEquityCampaign
                    ? 'Investors'
                    : tab.charAt(0).toUpperCase() + tab.slice(1);

              return (
                <button
                  key={tab}
                  className={`px-4 py-2 font-semibold ${selectedTab === tab ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'} ${isDonateTabDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (!isDonateTabDisabled) {
                      setSelectedTab(tab as any);
                    }
                  }}
                  disabled={isDonateTabDisabled}
                >
                  {tabLabel}
                  {count > 0 && (
                    <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full ml-1 mr-4">
                      {count}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
        <button
          onClick={() => scrollTabs('right')}
          className="absolute right-0 z-10 bg-white shadow-md p-2 rounded-full md:hidden"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CampaignTabs;
