import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaSpinner, FaUser, FaMoneyBill, FaListAlt, FaEye, FaEyeSlash } from "react-icons/fa";


type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  targetAmount: string;
  durationDays: string;
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
  const initialState: FormData = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    birthDate: "",
    phoneNumber: "",
    targetAmount: "",
    durationDays: "",
    nationalId: "",
    country: "",
    paymentMethod: "",
    mobileMoneyProvider: "",
    currency: "",
    currencySymbol: "",
    phoneCode: "",
    category: ""
  };

  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countryCode, setCountryCode] = useState('');

  const categories = ["Business", "Personal", "Education", "Healthcare"];
  const paymentMethods = ["Credit Card", "Mobile Money", "Bank Transfer"];
  const mobileProviders = ["Provider A", "Provider B", "Provider C"];

  const isStepValid = (): boolean => {
    const fieldsToValidate: Record<number, (keyof FormData)[]> = {
      1: ["email", "password", "confirmPassword", "fullName", "phoneCode", "birthDate"],
      2: ["category", "targetAmount", "durationDays", "nationalId"],
      3: ["country", "paymentMethod", ...(formData.paymentMethod === "Mobile Money" ? ["mobileMoneyProvider"] : [])] as (keyof FormData)[]
    };

    return fieldsToValidate[currentStep].every(field => {
      const value = formData[field];
      return value && value.trim() !== "" && !errors[field];
    });
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const ipResponse = await fetch("https://ipapi.co/json/");
        const data = await ipResponse.json();

        setCountryCode(data.country_calling_code);
  
        const currencyResponse = await fetch(
          `https://restcountries.com/v3.1/alpha/${data.country_code}`
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
          phoneCode: `+${data.country_calling_code.replace(/\+/g, "")}`,
        }));
      } catch (error) {
        console.error("Error fetching location:", error);
        setFormData((prev) => ({
          ...prev,
          country: "United States",
          currency: "USD",
          currencySymbol: "$",
          phoneCode: "+1",
        }));
      } finally {
        setIsLocationLoading(false);
      }
    };
  
    fetchUserLocation();
  }, []);
  

  const validateField = (name: keyof FormData, value: string): string => {
    let error = "";
    switch (name) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = !emailRegex.test(value) ? "Invalid email format" : "";
        break;
      }
      case "password":
        error = value.length < 8 ? "Password must be at least 8 characters" : "";
        break;
      case "confirmPassword":
        error = value !== formData.password ? "Passwords do not match" : "";
        break;
      case "phoneNumber": {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        error = !phoneRegex.test(value) ? "Invalid phone number" : "";
        break;
      }
      default:
        error = value.trim() === "" ? "This field is required" : "";
    }
    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePhoneCodeChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      phoneCode: value
    }));
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    const updatedPhoneNumber = value; // Store the value of the phone number input
  
    // Update the phone number state
    setFormData(prev => ({
      ...prev,
      phoneNumber: updatedPhoneNumber
    }));
  
    // Use the updated value to validate and set the error
    const error = validateField("phoneNumber", `${formData.phoneCode}${updatedPhoneNumber}`);
    setErrors(prev => ({ ...prev, phoneNumber: error }));
  };  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStepValid()) return;

    setIsLoading(true);

    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof FormData, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormData] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<{
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    min?: string;
    value?: string;
  }> = ({ label, name, type = "text", min, value, ...props }) => {
    const isPassword = name === "password" || name === "confirmPassword";
    const showPasswordState = name === "password" ? showPassword : showConfirmPassword;
    const togglePassword = () => {
      if (name === "password") {
        setShowPassword(!showPassword);
      } else if (name === "confirmPassword") {
        setShowConfirmPassword(!showConfirmPassword);
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    };

    if (name === "phoneNumber") {
      return (
        <div className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label} <span className="text-red-500">*</span>
          </label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
  <input
    type="text"
    value={formData.phoneCode}
    onChange={handlePhoneCodeChange}
    className="mt-1 block w-[70px] px-4 py-2 border-none focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
    placeholder="Code"
  />
  <input
    type="tel"
    id={name}
    name={name}
    value={formData.phoneNumber}
    onChange={handlePhoneNumberChange}
    className={`mt-1 block flex-grow px-4 py-2 border-none focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
    placeholder="Phone number"
    {...props}
  />
</div>

          {errors[name] && (
            <p className="mt-1 text-sm text-red-500" role="alert">
              {errors[name]}
            </p>
          )}
        </div>
      );
    }

    return (
        <div className="mb-4">
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id={name}
            name={name}
            type={isPassword ? (showPasswordState ? "text" : "password") : type}
            value={value ?? formData[name]}
            onChange={handleInputChange}
            autoComplete="off"
            className={`block w-full py-2 px-4 rounded-md border mt-1 focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white  ${errors[name] ? 'border-red-500' : 'border-gray-300'} ${isPassword ? 'pr-10' : ''} ${name === 'targetAmount' ? 'pl-8' : 'pl-4'}`}
            aria-invalid={errors[name] ? "true" : "false"}
            aria-describedby={`${name}-error`}
            {...props}
            min={min}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-transparent border-none cursor-pointer"
            >
              {showPasswordState ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
          {name === "targetAmount" && (
            <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
              {formData.currencySymbol}
            </span>
          )}
        </div>
        {errors[name] && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {errors[name]}
          </p>
        )}
      </div>
      
    );
  };

  const SelectField: React.FC<{
    label: string;
    name: keyof FormData;
    options: string[];
    disabled?: boolean;
  }> = ({ label, name, options, disabled = false }) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === step ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-600"} ${currentStep > step ? "bg-green-500 text-white" : ""}`}
          >
            {step === 1 && <FaUser />}
            {step === 2 && <FaListAlt />}
            {step === 3 && <FaMoneyBill />}
          </div>
          {step < 3 && (
            <div
              className={`w-20 h-1 ${currentStep > step ? "bg-green-500" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center mb-6">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
              <InputField
                label="Password"
                name="password"
                required
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                required
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                required
              />
              <InputField
                label="Birth Date"
                name="birthDate"
                type="date"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center mb-6">Category & Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Category"
                name="category"
                options={categories}
              />
              <InputField
                label="Target Amount"
                name="targetAmount"
                type="number"
                min="0"
                required
              />
              <InputField
                label="Duration (Days)"
                name="durationDays"
                type="number"
                min="1"
                required
              />
              <InputField
                label="National ID"
                name="nationalId"
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center mb-6">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                disabled
                required
              />
              <SelectField
                label="Payment Method"
                name="paymentMethod"
                options={paymentMethods}
              />
              {formData.paymentMethod === "Mobile Money" && (
                <SelectField
                  label="Mobile Money Provider"
                  name="mobileMoneyProvider"
                  options={mobileProviders}
                />
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
        <span className="ml-2 text-gray-600">Loading location data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-0 px-2 lg:px-0">
      <div className="max-w-2xl mx-auto bg-white shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Registration Form
        </h2>
        <StepIndicator />
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            Location detected: {formData.country} ({formData.currency} - {formData.currencySymbol})
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid()}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !isStepValid()}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
