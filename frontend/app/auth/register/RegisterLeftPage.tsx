import React from 'react';

export default function RegisterLeftPage() {
  return (
    <section className="text-gray-700 dark:bg-gray-950 dark:text-gray-50">
      <div className="mx-auto flex flex-col items-center gap-y-16 px-6 py-32">
        <div className="mx-auto text-center">
          <h2 className="mb-3 text-3xl font-bold lg:text-4xl">
            Explore Africa's leading Crowdfunding platform
          </h2>
          <p className="text-base">
            Our platform provides you with the tools you need to raise funds. We
            have helped over 1,000 people to achieve their goals.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-12 rounded-lg bg-gray-50 px-6 py-12 dark:bg-gray-900 lg:flex-row lg:justify-center lg:gap-6 lg:px-12">
          <div>
            <h4 className="mb-2 text-2xl font-bold text-orange-400 lg:text-3xl">
              2K+
            </h4>
            <p className="text-base font-medium text-gray-950 dark:text-gray-50">
              Monthly Visitors
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-2xl font-bold text-orange-400  lg:text-3xl">
              1K+
            </h4>
            <p className="text-base font-medium text-gray-950 dark:text-gray-50">
              Registered Users
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-2xl font-bold text-orange-400  lg:text-3xl">
              1M+
            </h4>
            <p className="text-base font-medium text-gray-950 dark:text-gray-50">
              Money Raised
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-2xl font-bold text-orange-400  lg:text-3xl">
              1K+
            </h4>
            <p className="text-base font-medium text-gray-950 dark:text-gray-50">
              Happy Donors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
