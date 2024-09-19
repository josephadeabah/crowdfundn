'use client';

import Stepper from '@/app/components/stepper/Stepper';
import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const steps = [
    {
      title: 'Step 1',
      description: 'Description of Step 1',
      content: (
        <>
          {' '}
          <div className="mx-auto flex w-full flex-col items-center justify-center">
            <form className="md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <svg
                    className="inline h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  'Sign up'
                )}
              </button>
            </form>
          </div>
        </>
      ),
    },
    {
      title: 'Step 2',
      description: 'Description of Step 2',
      content: 'Content for Step 2',
    },
    {
      title: 'Step 3',
      description: 'Description of Step 3',
      content: 'Content for Step 3',
    },
  ];

  return (
    <section className="flex h-screen bg-white dark:bg-gray-900">
      {/* Left container */}
      <div className="hidden w-full items-center justify-center bg-primary-600 dark:bg-gray-950 lg:flex lg:w-1/2">
        <section className="bg-primary-600 text-gray-700 dark:bg-gray-950 dark:text-gray-50">
          <div className="mx-auto flex max-w-[52.5rem] flex-col items-center gap-y-16 px-6 py-32 lg:max-w-[78rem]">
            <div className="mx-auto max-w-[36.75rem] text-center">
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
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <Stepper steps={steps} />
      </div>
    </section>
  );
}
