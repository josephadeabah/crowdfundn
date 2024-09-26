'use client';

import Stepper from '@/app/components/stepper/Stepper';
import React, { useState } from 'react';
import data from '../../../data.json';
import { Badge } from '@/app/components/badge/Badge';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';
import { useRouter } from 'next/navigation';
import DatePicker from '@/app/components/datepicker/DatePicker';
import RegisterLeftPage from './RegisterLeftPage';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { FaInfoCircle } from 'react-icons/fa';
import ToastComponent from '@/app/components/toast/Toast';

const paymentMethods = data.paymentOptions.methods;
const mobileMoneyMethod = paymentMethods.find(
  (method) => method.value === 'mobile-money',
);
const mobileMoneyProviders = mobileMoneyMethod
  ? mobileMoneyMethod.providers
  : [];
const currencies = data.paymentOptions.currencies;

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [fundraiserName, setFundraiserName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [durationInDays, setDurationInDays] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedMobileMoneyProvider, setSelectedMobileMoneyProvider] =
    useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const steps = [
    {
      label: 'Add Personal Information',
      content: (
        <div>
          <form className="w-full grid grid-cols-1 gap-y-5 bg-white dark:bg-gray-950 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 rounded-sm p-4 sm:grid-cols-2 sm:gap-x-4">
            {/* Birthdate */}
            <label
              htmlFor="birthdate"
              className="col-span-full text-left sm:col-span-1 text-gray-600 dark:text-gray-100"
            >
              Select birth date
              <FaInfoCircle
                data-tooltip-id="birthdate-info"
                data-tooltip-content="Your birthdate is required for eligibility verification."
                className="ml-2 text-gray-500 inline-block"
              />
              <Tooltip id="birthdate-info" />
            </label>
            <div
              className={`col-span-full ${
                errors.birthdate ? 'ring-red-500' : ''
              }`}
            >
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={(date) => setSelectedDate(date)}
                minYear={1940}
                maxYear={2030}
              />
              {errors.birthdate && (
                <span className="text-red-500">{errors.birthdate}</span>
              )}
            </div>
            {/* Email Address */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="email-info"
                  data-tooltip-content="Please provide a valid email for account creation and notifications."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="email-info" />
              </span>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] pl-10 ${
                    errors.email ? 'ring-red-500' : ''
                  }`}
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="password-info"
                  data-tooltip-content="Your password must be at least 8 characters long."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="password-info" />
              </span>
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                    errors.password ? 'ring-red-500' : ''
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Fundraiser Name */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="fundraiser-name-info"
                  data-tooltip-content="Enter the name of your fundraiser. If you're the one raising, you can leave it blank."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="fundraiser-name-info" />
              </span>
              <div className="mt-2">
                <input
                  type="text"
                  id="fundraiser-name"
                  name="fundraiser-name"
                  className="block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms]"
                  placeholder="Fundraiser Name"
                  value={fundraiserName}
                  onChange={(e) => setFundraiserName(e.target.value)}
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="confirm-password-info"
                  data-tooltip-content="Please confirm your password."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="confirm-password-info" />
              </span>
              <div className="mt-2">
                <input
                  type="password"
                  id="confirm-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                    errors.passwordConfirmation ? 'ring-red-500' : ''
                  }`}
                  required
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirmation}
                  </p>
                )}
              </div>
            </div>
            {/* Duration */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="duration-info"
                  data-tooltip-content="Enter the duration of your fundraiser in number of days."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="duration-info" />
              </span>
              <input
                type="number"
                id="duration"
                name="duration"
                className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                  errors.durationInDays ? 'ring-red-500' : ''
                }`}
                placeholder="Duration in Days"
                value={durationInDays}
                onChange={(e) => setDurationInDays(e.target.value)}
                required
              />
              {errors.durationInDays && (
                <p className="text-red-500 text-sm">{errors.durationInDays}</p>
              )}
            </div>

            {/* Target Amount */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="target-amount-info"
                  data-tooltip-content="Enter the target amount without the currency."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="target-amount-info" />
              </span>
              <input
                type="number"
                id="target-amount"
                name="target-amount"
                className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                  errors.targetAmount ? 'ring-red-500' : ''
                }`}
                placeholder="Target Amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
              {errors.targetAmount && (
                <p className="text-red-500 text-sm">{errors.targetAmount}</p>
              )}
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
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
            </div>

            {/* Your Name */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="text"
                  id="your-full-name"
                  name="your-full-name"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                    errors.fullName ? 'ring-red-500' : ''
                  }`}
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>
            </div>

            {/* National ID */}
            <div className="col-span-full sm:col-span-1 relative">
              <span>
                <FaInfoCircle
                  data-tooltip-id="nationalId-info"
                  data-tooltip-content="Enter your National ID. Passport is preferred."
                  className="absolute top-0 left-0 text-gray-500"
                />
                <Tooltip id="nationalId-info" />
              </span>
              <div className="mt-2">
                <input
                  type="text"
                  id="national-id"
                  name="national-id"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                    errors.nationalId ? 'ring-red-500' : ''
                  }`}
                  placeholder="National ID"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  required
                />
                {errors.nationalId && (
                  <p className="text-red-500 text-sm">{errors.nationalId}</p>
                )}
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="col-span-full sm:col-span-1">
              <div className="mt-2">
                <input
                  type="tel"
                  id="mobile-phone"
                  name="mobile-phone"
                  className={`block w-full bg-white dark:bg-gray-950 rounded-lg border-0 px-4 py-2 text-base text-gray-950 dark:text-gray-50 ring-1 ring-inset ring-gray-200 dark:ring-gray-800 hover:ring-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 placeholder:text-gray-500 transition ease-in-out duration-[250ms] ${
                    errors.phoneNumber ? 'ring-red-500' : ''
                  }`}
                  placeholder="Mobile Phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      ),
    },
    {
      label: 'Select Fundraising Category',
      content: (
        <div className="w-full">
          <div className="overflow-y-auto max-h-[calc(100vh-380px)] h-full [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-2 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
            <div className="w-full flex flex-wrap gap-2 mb-8 justify-start">
              {data.categories.map((category) => (
                <Badge
                  key={category.value}
                  className={`cursor-pointer ${
                    selectedCategory === category.value
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-950 dark:text-gray-50 text-gray-500'
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                  variant="secondary"
                >
                  {category.label}
                </Badge>
              ))}
            </div>
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

  const handleValidation = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (!passwordConfirmation)
      newErrors.passwordConfirmation = 'Password confirmation is required.';
    else if (password !== passwordConfirmation)
      newErrors.passwordConfirmation = 'Passwords do not match.';
    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    if (!selectedDate) newErrors.selectedDate = 'Date is required.';
    if (!targetAmount) newErrors.targetAmount = 'Target amount is required.';
    if (!durationInDays)
      newErrors.durationInDays = 'Duration in days is required.';
    if (!nationalId) newErrors.nationalId = 'National ID is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!handleValidation()) {
      return;
    }
    setLoading(true);
    setShowToast(false);
    setError(null);
    setSuccess(null);

    const formData = {
      email,
      password,
      fullName,
      phoneNumber,
      countryCode,
      passwordConfirmation,
      selectedPaymentMethod,
      selectedMobileMoneyProvider,
      selectedCurrency,
      selectedDate,
      selectedCategory,
      targetAmount,
      durationInDays,
      referralCode,
    };

    try {
      console.log('Form data:', formData);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        router.push('/auth/login');
      } else {
        console.error(result.message);
        setError(result.message);
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showToast && error && (
        <ToastComponent
          type="error"
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          description={error}
        />
      )}
      {showToast && success && (
        <ToastComponent
          type="success"
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          description={success}
        />
      )}
      <div className="flex bg-white dark:bg-gray-900">
        {/* Left container */}
        <div className="hidden w-full items-center justify-center dark:bg-gray-950 lg:flex lg:w-1/2">
          <RegisterLeftPage />
        </div>
        {/* Right container */}
        <div className="w-full lg:w-1/2">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
