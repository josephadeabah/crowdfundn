'use client';

import { Button } from '@/app/components/button/Button';
import Stepper from '@/app/components/stepper/Stepper';
import CardBanner from '@/app/molecules/CardBanner';
import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: 'Select location',
      content: (
        <div>
          <CardBanner
            title="Hello 1"
            description="Description"
            className="text-start p-0 m-0 h-96"
          >
            Hello my very eyes may just see under nine planet Hello my very eyes
            may just see under nine planet Hello my very eyes may just see under
            nine planet
          </CardBanner>
        </div>
      ),
    },
    {
      label: 'Select category',
      content: (
        <div>
          <CardBanner
            title="Hello 2"
            description="Description"
            className="text-start h-96 p-0"
          >
            Hello my very eyes may just see under nine planet Hello my very eyes
            may just see under nine planet Hello my very eyes may just see under
            nine planet
          </CardBanner>
        </div>
      ),
    },
    {
      label: 'Choose payment',
      content: (
        <div>
          <CardBanner
            title="Hello 3"
            description="Description"
            className="text-start h-96"
          >
            Hello my very eyes may just see under nine planet Hello my very eyes
            may just see under nine planet Hello my very eyes may just see under
            nine planet
          </CardBanner>
        </div>
      ),
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
      <div className="w-full lg:w-1/2">
        <div className="p-4">
          <Stepper steps={steps} currentStep={currentStep} />
          <div className="flex justify-between gap-8 mt-4">
            <Button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              className="w-full bg-gray-300 text-white py-2 px-4 rounded"
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
              }
              className="w-full bg-red-600 text-white py-2 px-4 rounded"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
