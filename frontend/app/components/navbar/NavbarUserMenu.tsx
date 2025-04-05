'use client';
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../popover/Popover';
import Avatar from '../avatar/Avatar';
import Link from 'next/link';
import { LoginUserType } from '@/app/types/auth.login.types';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import SearchBar from '../searchbar/SearchBar';

interface NavbarUserMenuProps {
  user: LoginUserType;
  userAccountData: any;
  logout: () => void;
}

export const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({
  user,
  userAccountData,
  logout,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearchOpen}
        aria-label="Search"
        className="hidden md:flex"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Popover>
        <PopoverTrigger>
          <div className="cursor-pointer">
            <Avatar
              name={user.full_name}
              size="sm"
              imageUrl={
                userAccountData?.profile?.avatar?.record?.avatar as string
              }
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 p-2"
        >
          <div className="cursor-pointer flex items-center focus-visible:outline-none focus:ring-0 hover:outline-none">
            <Link
              href="/account"
              className="focus-visible:outline-none focus:ring-0 hover:outline-none"
            >
              <Avatar
                name={user.full_name}
                size="sm"
                imageUrl={
                  userAccountData?.profile?.avatar?.record?.avatar as string
                }
              />
            </Link>
            <div className="ml-3 flex flex-col">
              <span className="font-semibold">{user.full_name}</span>
              <span className="text-gray-600">{user.email}</span>
            </div>
          </div>
          {userAccountData?.admin && (
            <Link
              href="/admin/manage"
              passHref
              className="focus-visible:outline-none focus:ring-0 hover:outline-none"
            >
              <div className="hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none p-2">
                Go to Admin
              </div>
            </Link>
          )}
          <Link
            href="/account"
            passHref
            className="focus-visible:outline-none focus:ring-0 hover:outline-none"
          >
            <div className="hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none p-2">
              Go to Account
            </div>
          </Link>
          <div
            className="hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus:ring-0 hover:outline-none p-2"
            onClick={logout}
          >
            Logout
          </div>
        </PopoverContent>
      </Popover>

      <SearchBar isOpen={searchOpen} onClose={handleSearchClose} />
    </div>
  );
};
