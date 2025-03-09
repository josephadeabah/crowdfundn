// NavbarLoader.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NavbarLoader = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm p-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto relative flex items-center justify-between text-gray-800 dark:bg-gray-950 dark:text-gray-50">
        {/* Original Logo or Title */}
        <div className="mx-6">
          <img
            src="/bantuhive.svg"
            alt="Bantuhive Logo"
            className="w-24 h-auto"
          />
        </div>

        <div className="hidden lg:flex items-center gap-x-2 mx-6">
          {/* Original Navigation Links */}
          <span className="mx-2 text-sm font-semibold p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800">
            About
          </span>
          <span className="mx-2 text-sm font-semibold p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800">
            Guides
          </span>
          <span className="mx-2 text-sm font-semibold p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800">
            Contact
          </span>
          <span className="mx-2 text-sm font-semibold p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800">
            Donate
          </span>
          <span className="mx-2 text-sm font-semibold p-2 hover:text-gray-700 dark:text-gray-50 hover:outline-none dark:hover:bg-gray-800">
            Leaderboard
          </span>
        </div>

        <div className="hidden lg:flex grow basis-0 items-center justify-end gap-x-2">
          {/* Original Additional Links */}
        </div>

        {/* Skeleton Loaders for Avatars */}
        <div className="flex items-center gap-x-2 mx-6">
          <Skeleton circle={true} width={40} height={40} />
        </div>
      </div>
    </header>
  );
};

export default NavbarLoader;
