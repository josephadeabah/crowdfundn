// app/invest/layout.tsx
'use client';

import React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs';
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
      value: 'campaigns',
    },
    {
      name: 'Venture Funds',
      href: '/invest/funds',
      value: 'funds',
    },
    {
      name: 'Top Investors',
      href: '/invest/investors',
      value: 'investors',
    },
  ];

  // Get active tab based on current route
  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.value || 'campaigns';

  return (
    <div className="w-full bg-white pt-12">
      {' '}
      {/* Added pt-12 for top padding */}
      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <TabsList className="grid w-full grid-cols-3 px-4 py-2 md:py-6 md:px-8 gap-4">
            {' '}
            {/* Added gap-4 */}
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                asChild
                className="px-4 py-2 md:py-6 md:px-8 text-sm md:text-lg font-medium" // Bigger padding and font
              >
                <Link
                  href={tab.href}
                  className="w-full h-full flex items-center justify-center"
                >
                  {tab.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Only render the content for the active tab */}
        {tabs.map((tab) => (
          <div className="max-w-7xl mx-auto px-4">
            <TabsContent key={tab.value} value={tab.value}>
              {pathname.startsWith(tab.href) && children}
            </TabsContent>
          </div>
        ))}
      </Tabs>
    </div>
  );
};

export default InvestLayout;
