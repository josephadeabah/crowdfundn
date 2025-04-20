// app/invest/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/app/components/ui/tabs'; // Adjust the import path as needed

interface InvestLayoutProps {
  children: React.ReactNode;
}

const InvestLayout = ({ children }: InvestLayoutProps) => {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Campaigns',
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

  // Get the default tab value based on current route
  const defaultValue = tabs.find((tab) => tab.current)?.href || '/invest';

  return (
    <div className="w-full">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <Link href={tab.href} key={tab.href} passHref legacyBehavior>
              <TabsTrigger value={tab.href} asChild>
                <a className="w-full">{tab.name}</a>
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
        <TabsContent value="/invest">
          {pathname === '/invest' && children}
        </TabsContent>
        <TabsContent value="/invest/funds">
          {pathname === '/invest/funds' && children}
        </TabsContent>
        <TabsContent value="/invest/investors">
          {pathname === '/invest/investors' && children}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestLayout;
