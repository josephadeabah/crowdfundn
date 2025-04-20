// app/invest/layout.tsx
import React from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface InvestLayoutProps {
  children: React.ReactNode;
}

const InvestLayout = ({ children }: InvestLayoutProps) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Founders',
      href: '/invest',
      current: pathname === '/invest',
    },
    {
      name: 'VC Funds',
      href: '/invest/funds',
      current: pathname === '/invest/funds',
    },
    {
      name: 'Top Investors',
      href: '/invest/investors',
      current: pathname === '/invest/investors',
    },
  ];

  return (
    <div className="w-full">
      <TabGroup>
        <div className="border-b border-gray-200">
          <TabList className="-mb-px flex space-x-8 px-4 sm:px-6 lg:px-8">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                as={Link}
                href={tab.href}
                className={`
                  whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
                  ${
                    tab.current
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
        </div>
        <TabPanels>{children}</TabPanels>
      </TabGroup>
    </div>
  );
};

export default InvestLayout;
