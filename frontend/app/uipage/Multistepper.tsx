import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Address Details' },
    { id: 3, title: 'Payment Information' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        error = value.trim() === '' ? 'Name is required' : '';
        break;
      case 'email':
        error = !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : '';
        break;
      case 'phone':
        error = !/^\d{10}$/.test(value) ? 'Phone number must be 10 digits' : '';
        break;
      case 'address':
        error = value.trim() === '' ? 'Address is required' : '';
        break;
      case 'city':
        error = value.trim() === '' ? 'City is required' : '';
        break;
      case 'country':
        error = value.trim() === '' ? 'Country is required' : '';
        break;
      case 'cardNumber':
        error = !/^\d{16}$/.test(value) ? 'Card number must be 16 digits' : '';
        break;
      case 'expiryDate':
        error = !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
          ? 'Invalid expiry date (MM/YY)'
          : '';
        break;
      case 'cvv':
        error = !/^\d{3}$/.test(value) ? 'CVV must be 3 digits' : '';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  // Removed the misplaced validateField call
  const validateStep = () => {
    const currentFields: (keyof typeof formData)[] =
      {
        1: ['name', 'email', 'phone'] as (keyof typeof formData)[],
        2: ['address', 'city', 'country'] as (keyof typeof formData)[],
        3: ['cardNumber', 'expiryDate', 'cvv'] as (keyof typeof formData)[],
      }[currentStep as 1 | 2 | 3] || [];

    const stepErrors: Partial<typeof formData> = {};
    currentFields?.forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) stepErrors[field] = errors[field];
    });

    setErrors((prevErrors) => ({ ...prevErrors, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
    }
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </>
        );
      case 2:
        return (
          <>
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />
          </>
        );
      case 3:
        return (
          <>
            <Input
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              error={errors.cardNumber}
            />
            <Input
              label="Expiry Date (MM/YY)"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              error={errors.expiryDate}
            />
            <Input
              label="CVV"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              error={errors.cvv}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-low to-secondary-low flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <Stepper steps={steps} currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-theme-color-primary">
                {steps[currentStep - 1].title}
              </h2>
              {renderFormFields()}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2 bg-neutral-medium text-theme-color-neutral-content text-gray-800 rounded-md hover:bg-neutral-medium-dark transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-theme-color-primary text-gray-800 rounded-md hover:bg-theme-color-primary-dark transition-colors ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-theme-color-secondary text-gray-800 rounded-md hover:bg-theme-color-secondary-dark transition-colors ml-auto"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const Stepper = ({
  steps,
  currentStep,
}: {
  steps: { id: number; title: string }[];
  currentStep: number;
}) => {
  return (
    <div className="flex justify-between">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex items-center ${step.id !== steps.length ? 'flex-1' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id <= currentStep ? 'bg-theme-color-primary text-gray-800' : 'bg-neutral-medium text-theme-color-neutral-content'} transition-colors duration-300`}
            aria-label={`Step ${step.id} ${step.id === currentStep ? '(Current)' : step.id < currentStep ? '(Completed)' : ''}`}
          >
            {step.id < currentStep ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <span>{step.id}</span>
            )}
          </div>
          {step.id !== steps.length && (
            <div
              className={`flex-1 h-1 mx-2 ${step.id < currentStep ? 'bg-theme-color-primary' : 'bg-neutral-medium'} transition-colors duration-300`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

interface InputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-medium focus:border-theme-color-primary'}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MultiStepForm;
