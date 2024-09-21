'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/button/Button';

export default function Login() {
  const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="flex bg-white dark:bg-gray-900">
      {/* Left container */}
      <div className="hidden w-full items-center justify-center bg-primary-600 dark:bg-gray-950 lg:flex lg:w-1/2">
        <section className="bg-primary-600 text-gray-700 dark:bg-gray-950 dark:text-gray-50">
          <div className="mx-auto flex flex-col items-center gap-y-16 px-6 py-32">
            <div className="mx-auto text-center">
              <h2 className="mb-3 text-3xl font-bold lg:text-4xl">
                Explore Africa's leading Crowdfunding platform
              </h2>
              <p className="text-base">
                Our platform provides you with the tools you need to raise
                funds. We have helped over 1,000,000 people to achieve their
                goals.
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-12 rounded-lg bg-gray-50 px-6 py-12 dark:bg-gray-900 lg:flex-row lg:justify-center lg:gap-6 lg:px-12">
              <div>
                <h4 className="mb-2 text-2xl font-bold text-red-600 lg:text-3xl">
                  500k+
                </h4>
                <p className="text-base font-medium text-gray-950 dark:text-gray-50">
                  Monthly Visitors
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-2xl font-bold text-red-600 lg:text-3xl">
                  250k+
                </h4>
                <p className="text-base font-medium text-gray-950 dark:text-gray-50">
                  Registered Users
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-2xl font-bold text-red-600 lg:text-3xl">
                  175M+
                </h4>
                <p className="text-base font-medium text-gray-950 dark:text-gray-50">
                  Money Raised
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-2xl font-bold text-red-600 lg:text-3xl">
                  5M+
                </h4>
                <p className="text-base font-medium text-gray-950 dark:text-gray-50">
                  Happy Donors
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Right container */}
      <div className="w-full lg:w-1/2">
        <div className="p-4 w-full">
          <div className="mx-auto max-w-[36.75rem] text-center">
            <h2 className="mb-3 text-3xl font-semibold text-red-600 lg:text-4xl">
              Login to your account.
            </h2>
          </div>
          <form className="w-full grid grid-cols-1 gap-y-5 mb-5 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-sm p-4 sm:grid-cols-2 sm:gap-x-4">
            {/* Email Address */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>
            {/* Password */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  required
                />
              </div>
            </div>
          </form>
          <Button
            variant="default"
            size="lg"
            className="w-full dark:bg-gray-950"
          >
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
