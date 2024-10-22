'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import RegisterLeftPage from '../register/RegisterLeftPage';
import { Button } from '@/app/components/button/Button';
import ToastComponent from '@/app/components/toast/Toast';
import { useAuth } from '@/app/context/auth/AuthContext';
import { loginUser } from '@/app/utils/api/api.login';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await loginUser({ email, password });

      if ('error' in response) {
        setError(response.error);
        setShowToast(true);
      } else {
        login(response);
        setSuccess('Login successful!, redirecting...');
        setShowToast(true);
        setTimeout(() => {
          window.location.href = '/account';
        }, 1000);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setShowToast(true);
    } finally {
      setIsLoading(false);
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
      <div className="h-full flex items-center justify-center p-2 mt-10 mb-10">
        <div className="max-w-7xl w-full bg-white dark:bg-gray-800 dark:text-gray-50 rounded-sm">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:block w-1/2">
              <RegisterLeftPage />
            </div>
            <div className="w-full md:w-1/2 p-8 shadow">
              <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email Address"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="mt-1 block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-1/2 flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                    ) : null}
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
