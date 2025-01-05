import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import {
  ApiResponse,
  UserRegistrationData,
} from '@/app/types/auth.register.types';
import { registerUser } from '@/app/utils/api/api.register';
import ToastComponent from '@/app/components/toast/Toast';
import { categories } from '@/app/utils/helpers/categories';
import { useAuth } from '@/app/context/auth/AuthContext';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  targetAmount: string;
  nationalId: string;
  country: string;
  paymentMethod: string;
  mobileMoneyProvider: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  category: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const initialState: FormData = {
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthDate: '',
    phoneNumber: '',
    targetAmount: '',
    nationalId: '',
    country: '',
    paymentMethod: '',
    mobileMoneyProvider: '',
    currency: '',
    currencySymbol: '',
    phoneCode: '',
    category: '',
  };

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [countryCode, setCountryCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { signup } = useAuth();

  const paymentMethods = [
    'Credit Card',
    'Mobile Money',
    // 'PayStack',
    // 'FlutterWave',
    // 'Bank Transfer',
  ];
  const mobileProviders = ['MTN', 'MPesa', 'Telecel', 'AirtelTigo'];

  const isStepValid = (): boolean => {
    const fieldsToValidate: Record<number, (keyof FormData)[]> = {
      1: [
        'email',
        'password',
        'confirmPassword',
        'fullName',
        'phoneNumber',
        'birthDate',
      ],
      2: ['category', 'targetAmount', 'nationalId'],
      3: [
        'country',
        'paymentMethod',
        ...(formData.paymentMethod === 'Mobile Money'
          ? ['mobileMoneyProvider']
          : []),
      ] as (keyof FormData)[],
    };
    return fieldsToValidate[currentStep].every((field) => {
      const value = formData[field];
      return value && value.trim() !== '' && !errors[field];
    });
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const data = await ipResponse.json();
        setCountryCode(data.country_calling_code);
        const currencyResponse = await fetch(
          `https://restcountries.com/v3.1/alpha/${data.country_code}`,
        );
        const [countryData] = await currencyResponse.json();
        const currencies = Object.values(countryData.currencies)[0];
        const currencySymbol = (currencies as { symbol: string }).symbol;
        const currencyCode = Object.keys(countryData.currencies)[0];

        setFormData((prev) => ({
          ...prev,
          country: data.country_name,
          currency: currencyCode,
          currencySymbol: currencySymbol,
          phoneCode: `+${data.country_calling_code.replace(/\+/g, '')}`,
        }));
      } catch (error) {
        console.error('Error fetching location:', error);
        setFormData((prev) => ({
          ...prev,
          country: 'United States',
          currency: 'USD',
          currencySymbol: '$',
          phoneCode: '+1',
        }));
      } finally {
        setIsLocationLoading(false);
      }
    };

    fetchUserLocation();
  }, []);

  const validateField = (name: keyof FormData, value: string): string => {
    let error = '';
    switch (name) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = !emailRegex.test(value) ? 'Invalid email format' : '';
        break;
      }
      case 'password':
        error =
          value.length < 8 ? 'Password must be at least 8 characters' : '';
        break;
      case 'confirmPassword':
        error = value !== formData.password ? 'Passwords do not match' : '';
        break;
      case 'phoneNumber': {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        error = !phoneRegex.test(value) ? 'Invalid phone number' : '';
        break;
      }
      case 'paymentMethod':
        // General check for payment method
        error = value.trim() === '' ? 'Payment method is required' : '';
        break;
      case 'mobileMoneyProvider':
        // Validate mobile money provider only if payment method is 'Mobile Money'
        if (formData.paymentMethod === 'Mobile Money' && value.trim() === '') {
          error = 'Mobile Money Provider is required';
        } else if (formData.paymentMethod !== 'Mobile Money') {
          error = ''; // Clear error if not relevant
        }
        break;
      default:
        error = value.trim() === '' ? 'This field is required' : '';
    }
    return error;
  };

  // const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setTermsAccepted(event.target.checked);
  // };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStepValid()) return;
    setError(null);
    setSuccess(null);
    setShowToast(false);
    setIsLoading(true);

    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof FormData,
        formData[key as keyof FormData],
      );
      if (error) newErrors[key as keyof FormData] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: UserRegistrationData = {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        country: formData.country,
        payment_method: formData.paymentMethod,
        mobile_money_provider: formData.mobileMoneyProvider,
        currency: formData.currency,
        currency_symbol: formData.currencySymbol,
        phone_code: formData.phoneCode,
        birth_date: formData.birthDate,
        category: formData.category,
        target_amount: parseInt(formData.targetAmount, 10),
        national_id: formData.nationalId,
      };

      const response: ApiResponse = await registerUser(registrationData);
      setIsLoading(false);

      if ('errors' in response) {
        if (Array.isArray(response.errors)) {
          setError(response.errors.join(', '));
        } else {
          setError(response.error ?? 'An unknown error occurred');
        }
        setShowToast(true);
      } else {
        signup(response);
        setSuccess(
          'Registration successful! Please check your email to confirm your account.',
        );
        setShowToast(true);
        // Redirect to /auth/signin after success
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      setIsLoading(false);
      setShowToast(true);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-1/3 h-2 ${currentStep >= step ? 'bg-orange-400' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs font-medium">User Details</span>
        <span className="text-xs font-medium">Category & other</span>
        <span className="text-xs font-medium">Payment Method</span>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="John Doe"
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="john@example.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    placeholder="Enter Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <input
                    type="text"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="mt-1 block w-[70px] px-4 py-2 border-none focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white "
                    placeholder="Code"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`mt-1 block flex-grow px-4 py-2 border-none focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Phone without code"
                    required
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.birthDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <span className="px-4 text-gray-700">
                    {formData.currencySymbol}
                  </span>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    className={`mt-1 block flex-grow px-4 py-1 rounded-md border-none focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.targetAmount ? 'border-red-500' : 'border-gray-300'}`}
                    min="0"
                    required
                  />
                </div>
                {errors.targetAmount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.targetAmount}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.nationalId ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nationalId}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  name="country"
                  value={formData.country}
                  className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                  disabled
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.paymentMethod ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
              {formData.paymentMethod === 'Mobile Money' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Money Provider{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mobileMoneyProvider"
                    value={formData.mobileMoneyProvider}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors.mobileMoneyProvider ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Provider</option>
                    {mobileProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                  {errors.mobileMoneyProvider && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.mobileMoneyProvider}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLocationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
        <span className="ml-2 text-gray-600">
          Loading your location data...
        </span>
      </div>
    );
  }

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
      <div className="min-h-screen py-0 px-2 lg:px-0">
        <div className="max-w-2xl mx-auto bg-white shadow p-2 md:p-6">
          <StepIndicator />
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-violet-600">
              Location detected: {formData.country} ({formData.currency} -{' '}
              {formData.currencySymbol})
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            {currentStep === 3 && (
             <div className="flex items-start mt-4">
               <input
                 id="terms"
                 type="checkbox"
                 checked={termsAccepted}
                 onChange={() => setTermsAccepted(!termsAccepted)}
                 className="peer hidden"
                 required
               />
               <div
                 onClick={() => setTermsAccepted(!termsAccepted)} // Allow clicking on the custom checkbox
                 className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-green-600 peer-checked:bg-green-600 flex justify-center items-center cursor-pointer"
               >
                 <label htmlFor="terms" className="cursor-pointer w-full h-full"></label>
               </div>
               <label
                 htmlFor="terms"
                 className="ml-2 text-sm text-gray-700"
               >
                 I accept the{" "}
                 <a
                   href="/terms"
                   target="_blank"
                   className="text-green-600 underline hover:text-green-700"
                 >
                   Terms and Conditions
                 </a>
               </label>
             </div>                        
            )}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepValid()}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  type="submit"
                  disabled={isLoading || !isStepValid() || !termsAccepted}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Registering...
                    </span>
                  ) : (
                    "Let's Go!"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
