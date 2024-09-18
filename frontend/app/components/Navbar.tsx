'use client';
import React, { useEffect, useState } from 'react';
import DarkModeBtn from './DarkModeBtn';
import { Button } from './button/Button';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="p-6 w-full bg-white dark:bg-gray-950">
        <div className="relative flex items-center gap-x-4">
          <div className="flex items-center group peer lg:hidden">
            <input type="checkbox" id="menu" className="hidden" />
            <label
              htmlFor="menu"
              className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-lg p-2 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                className="group-has-[input:checked]:hidden fill-gray-950 dark:fill-white"
              >
                <path d="M228 128a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24h176a12 12 0 0 1 12 12ZM40 76h176a12 12 0 0 0 0-24H40a12 12 0 0 0 0 24Zm176 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24Z" />
              </svg>
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                className="hidden group-has-[input:checked]:block fill-gray-950 dark:fill-white"
              >
                <path d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128 47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
              </svg>
            </label>
          </div>
          <a href=".">
            <svg fill="none" viewBox="0 0 28 28" height="28" width="28">
              <path
                className="fill-blue-600"
                d="M2.333 0A2.333 2.333 0 0 0 0 2.333V14c0 7.732 6.268 14 14 14 1.059 0 2.09-.117 3.082-.34.965-.217 1.585-1.118 1.585-2.107v-2.22a4.667 4.667 0 0 1 4.666-4.666h2.334A2.333 2.333 0 0 0 28 16.333v-14A2.333 2.333 0 0 0 25.667 0H21a2.333 2.333 0 0 0-2.333 2.333V14a4.667 4.667 0 0 1-9.334 0V2.333A2.333 2.333 0 0 0 7 0H2.333Z"
              />
            </svg>
          </a>
          <div className="absolute top-11 left-0 w-full hidden peer-has-[:checked]:flex flex-col gap-2 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-100 dark:ring-gray-900 shadow-md rounded-lg px-6 py-4 lg:relative lg:top-0 lg:w-auto lg:flex lg:flex-row lg:ring-0 lg:p-0 lg:shadow-none *:flex *:items-center *:gap-x-1.5 *:py-1.5 *:text-sm *:text-gray-950 dark:*:text-gray-50 *:font-medium lg:*:px-2">
            <a href="." className="font-popins">
              For Diaspora
              <p className="bg-blue-50 dark:bg-blue-900 flex px-1.5 py-0.5 rounded-full text-xs text-blue-600 dark:text-white font-medium">
                NEW
              </p>
            </a>
            <a href=".">How It Works</a>
            <a href=".">Success Stories</a>
            <a href=".">Donate</a>
            <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 lg:hidden md:hidden">
              <a
                href="."
                className=" text-white text-center py-2 px-4 rounded-sm font-popins"
              >
                Start Campaign
              </a>
            </div>
          </div>
          <div className="flex grow basis-0 items-center justify-end gap-x-3 *:px-3 *:py-1.5 *:text-sm *:font-medium *:transition *:duration-[250ms] *:ease-in-out">
            <DarkModeBtn />
            <Button
              variant="outline"
              size="sm"
              className="shadow-none hidden lg:inline-block py-2 px-4 hover:bg-slate-50"
            >
              Start Campaign
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="shadow-none hover:bg-slate-50"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
