import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
  ];

  useEffect(() => {
    validateEmail(email);
    validatePassword(password);
  }, [email, password]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailError && !passwordError) {
      setIsLoading(true);
      // Simulating API call
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Login successful!');
      }, 2000);
    } else {
      toast.error('Please fix the errors before submitting.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby="email-error"
              />
              {email && !email.includes('@') && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto">
                  {commonDomains.map((domain) => (
                    <li
                      key={domain}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setEmail(`${email}@${domain}`)}
                    >
                      {`${email}@${domain}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {emailError && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {passwordError}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
