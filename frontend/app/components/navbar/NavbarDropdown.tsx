'use client';
import React from 'react';
import { Button } from '../button/Button';
import { Popover, PopoverTrigger, PopoverContent } from '../popover/Popover';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { DropdownLinks } from '@/app/types/navbar.types';

interface NavbarDropdownProps {
  keyName: string;
  links: DropdownLinks[keyof DropdownLinks];
  activeMenu: string | null;
  setActiveMenu: (key: string | null) => void;
  closeTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
}

export const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
  keyName,
  links,
  activeMenu,
  setActiveMenu,
  closeTimeout,
}) => {
  return (
    <Popover
      open={activeMenu === keyName}
      onOpenChange={(isOpen) => {
        if (!isOpen) setActiveMenu(null);
      }}
    >
      <PopoverTrigger
        onMouseEnter={() => {
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          setActiveMenu(keyName);
        }}
        onMouseLeave={() => {
          closeTimeout.current = setTimeout(() => setActiveMenu(null), 200);
        }}
        className="flex items-center text-gray-700 dark:text-gray-50 group focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 hover:outline-none"
      >
        <Button variant="ghost" className="flex items-center">
          {keyName.charAt(0).toUpperCase() + keyName.slice(1)}
          <TriangleDownIcon
            className={`ml-2 h-4 w-4 transition-transform ${
              activeMenu === keyName ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-50 p-2"
        onMouseEnter={() => {
          if (closeTimeout.current) clearTimeout(closeTimeout.current);
          setActiveMenu(keyName);
        }}
        onMouseLeave={() => {
          closeTimeout.current = setTimeout(() => setActiveMenu(null), 200);
        }}
      >
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            passHref
            className="focus-visible:outline-none focus:ring-0 hover:outline-none"
          >
            <div className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus:ring-0 hover:outline-none">
              <div className="flex items-center justify-center rounded-lg !bg-white p-2">
                <link.icon className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h6 className="text-sm font-bold text-gray-800 dark:text-gray-50">
                  {link.label}
                </h6>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {link.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
};
