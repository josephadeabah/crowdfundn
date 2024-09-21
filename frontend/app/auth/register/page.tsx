'use client';

import { Button } from '@/app/components/button/Button';
import Stepper from '@/app/components/stepper/Stepper';
import React, { useState } from 'react';
import data from '../../../data.json';
import { Badge } from '@/app/components/badge/Badge';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';

const paymentMethods = data.paymentOptions.methods;
const mobileMoneyMethod = paymentMethods.find(
  (method) => method.value === 'mobile-money',
);
const mobileMoneyProviders = mobileMoneyMethod
  ? mobileMoneyMethod.providers
  : [];
const currencies = data.paymentOptions.currencies;

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedMobileMoneyProvider, setSelectedMobileMoneyProvider] =
    useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: 'Add Personal Information',
      content: (
        <div>
          <form className="w-full grid grid-cols-1 gap-y-5 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-sm p-4 sm:grid-cols-2 sm:gap-x-4">
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

            {/* Fundraiser Name */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="text"
                  id="fundraiser-name"
                  name="fundraiser-name"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Fundraiser Name"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-span-full">
              <div className="relative bg-white dark:bg-gray-950 rounded-lg mt-2">
                <select
                  id="year-of-birth"
                  name="year-of-birth"
                  className="appearance-none relative block w-full bg-transparent z-10 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition ease-in-out duration-[250ms]"
                  required
                >
                  <option value="" disabled selected>
                    Year of Birth
                  </option>
                  <option value="medical">Medical</option>
                  <option value="education">Education</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 256 256"
                  className="absolute top-3 right-4 fill-gray-500"
                >
                  <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                </svg>
              </div>
            </div>

            {/* Duration */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Duration (in days)"
                  required
                />
              </div>
            </div>

            {/* Target Amount */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="number"
                  id="target-amount"
                  name="target-amount"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Target Amount"
                  required
                />
              </div>
            </div>

            {/* Referral Code (Optional) */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="text"
                  id="referral-code"
                  name="referral-code"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Referral Code (Optional)"
                />
              </div>
            </div>

            {/* Your Name */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="text"
                  id="your-name"
                  name="your-name"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            {/* National ID */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="text"
                  id="national-id"
                  name="national-id"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="National ID"
                  required
                />
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="tel"
                  id="mobile-phone"
                  name="mobile-phone"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Mobile Phone"
                  required
                />
              </div>
            </div>
          </form>
        </div>
      ),
    },
    {
      label: 'Select Fundraising Category',
      content: (
        <div className="overflow-y-auto max-h-[calc(100vh-380px)] h-full [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-2 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          <div className="w-full flex flex-wrap gap-2 mb-8 justify-start">
            {data.categories.map((category) => (
              <Badge
                key={category.value}
                className="text-gray-500 bg-gray-50 cursor-pointer"
                variant="secondary"
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: 'Choose payment Method',
      content: (
        <div>
          <form className="w-full grid grid-cols-1 gap-y-5 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-sm p-4 sm:grid-cols-2 sm:gap-x-4">
            {/* Payment Method Selection */}
            <div className="col-span-full">
              <RadioGroup
                onValueChange={(value) => setSelectedPaymentMethod(value)}
                required
              >
                {paymentMethods?.map((method) => (
                  <div key={method.value} className="mt-2">
                    <label className="flex justify-start items-center">
                      <RadioGroupItem
                        value={method.value}
                        className="form-radio text-gray-950 dark:text-gray-50"
                      />
                      <span className="ml-2 text-base text-gray-950 dark:text-gray-50">
                        {method.label}
                      </span>
                    </label>
                    {/* Show sublist if Mobile Money is selected */}
                    {method.value === 'mobile-money' &&
                      selectedPaymentMethod === 'mobile-money' && (
                        <div className="ml-6 mt-2">
                          <select
                            name="mobile-money-provider"
                            className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 focus:outline-none"
                            onChange={(e) =>
                              setSelectedMobileMoneyProvider(e.target.value)
                            }
                            required
                          >
                            <option value="" disabled selected>
                              Select Provider
                            </option>
                            {mobileMoneyProviders?.map((provider) => (
                              <option
                                key={provider.value}
                                value={provider.value}
                              >
                                {provider.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            {/* Currency Selection */}
            {selectedPaymentMethod && (
              <div className="col-span-full sm:col-span-1">
                <div className="mt-2">
                  <select
                    id="currency"
                    name="currency"
                    className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 focus:outline-none"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    required
                  >
                    <option value="" disabled selected>
                      Select Currency
                    </option>
                    {currencies?.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>
      ),
    },
  ];

  return (
    <section className="flex bg-white dark:bg-gray-900">
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
          <div className="w-full flex justify-between gap-8 h-full mt-4">
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
