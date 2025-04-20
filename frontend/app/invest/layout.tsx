// app/invest/layout.tsx
'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface InvestLayoutProps {
  children: React.ReactNode;
}

const InvestLayout = ({ children }: InvestLayoutProps) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Campaigns',
      href: '/invest',
      value: 'campaigns',
    },
    {
      name: 'VC Funds',
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
  const activeTab = tabs.find(tab => pathname.startsWith(tab.href))?.value || 'campaigns';

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={tab.href}>{tab.name}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Only render the content for the active tab */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {pathname.startsWith(tab.href) && children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InvestLayout;