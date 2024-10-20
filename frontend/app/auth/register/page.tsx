'use client';
import React, { useState, useEffect } from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import RegisterLeftPage from './RegisterLeftPage';
import data from '../../../data.json';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';
import { Badge } from '@/app/components/badge/Badge';

const paymentMethods = data.paymentOptions.methods;
const mobileMoneyMethod = paymentMethods.find(
  (method) => method.value === 'mobile-money',
);
const mobileMoneyProviders = mobileMoneyMethod
  ? mobileMoneyMethod.providers
  : [];
const currencies = data.paymentOptions.currencies;

const RegisterComponent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    duration: '',
    targetAmount: '',
    country: '',
    fullName: '',
    nationalId: '',
    phone: '',
    selectedPaymentMethod: '',
    selectedMobileMoneyProvider: '',
    selectedCurrency: '',
  });
  interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    birthDate?: string;
    duration?: string;
    targetAmount?: string;
    country?: string;
    fullName?: string;
    nationalId?: string;
    [key: string]: string | undefined;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedMobileMoneyProvider, setSelectedMobileMoneyProvider] =
    useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        setFormData((prevData) => ({
          ...prevData,
          country: data.country_name,
          phone: data.country_calling_code,
        }));
        setCountryCode(data.country_calling_code);
      })
      .catch((error) => console.error('Error fetching location:', error));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'phone' && e.target instanceof HTMLInputElement) {
      const phoneValue = value.startsWith(countryCode)
        ? value
        : countryCode + value.replace(/^\+?\d+/, '');
      setFormData((prevData) => ({ ...prevData, [name]: phoneValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'email':
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'phone':
        if (!/^\+?\d+$/.test(value)) {
          newErrors.phone = 'Invalid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        if (
          !value &&
          name !== 'category' &&
          name !== 'paymentMethod' &&
          name !== 'currency'
        ) {
          newErrors[name] = 'This field is required';
        } else {
          delete newErrors[name];
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleNext = () => {
    if (step < 3) setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key as keyof typeof formData] &&
        key !== 'selectedCategory' &&
        key !== 'selectedPaymentMethod' &&
        key !== 'selectedMobileMoneyProvider' &&
        key !== 'selectedCurrency'
      ) {
        newErrors[key] = 'This field is required';
      }
    });
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      // Simulating API call
      setTimeout(() => {
        console.log('Form submitted:', {
          ...formData,
          phone: formData.phone.startsWith(countryCode)
            ? formData.phone
            : countryCode + formData.phone.replace(/^\+?\d+/, ''),
          selectedCategory,
          selectedPaymentMethod,
          selectedMobileMoneyProvider,
          selectedCurrency,
        });
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-gray-700"
          >
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.birthDate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration (days)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.duration ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="targetAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.targetAmount ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.targetAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="nationalId"
            className="block text-sm font-medium text-gray-700"
          >
            National ID
          </label>
          <input
            type="text"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.nationalId ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.nationalId && (
            <p className="mt-1 text-sm text-red-600">{errors.nationalId}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'}`}
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    return (
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
    );
  };

  const renderStep3 = () => {
    return (
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
                            <option key={provider.value} value={provider.value}>
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
    );
  };

  return (
    <div className="h-full flex items-center justify-center p-2 mt-10 mb-10">
      <div className="max-w-7xl w-full bg-white dark:bg-gray-800 dark:text-gray-50 rounded-sm">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2 pr-8">
            <RegisterLeftPage />
          </div>
          <div className="md:w-1/2">
            <div className="rounded-sm shadow p-6">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`w-1/3 h-2 ${num <= step ? 'bg-red-600' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-medium">User Details</span>
                  <span className="text-xs font-medium">Category</span>
                  <span className="text-xs font-medium">Payment Method</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={`px-4 py-2 bg-gray-200 dark:bg-gray-950 dark:text-gray-50 text-gray-800 rounded-md hover:bg-gray-300 ${step === 1 ? 'invisible' : ''}`}
                  >
                    <FaChevronLeft className="inline mr-2" /> Previous
                  </button>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-950 dark:text-gray-50 text-gray-800  rounded-md hover:bg-gray-50"
                    >
                      Next <FaChevronRight className="inline ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white dark:bg-gray-950 dark:text-gray-50 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Finish'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
