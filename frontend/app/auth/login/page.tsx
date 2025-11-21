'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/app/components/button/Button';
import ToastComponent from '@/app/components/toast/Toast';
import { useAuth } from '@/app/context/auth/AuthContext';
import { loginUser } from '@/app/utils/api/api.login';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/seperator';
import { ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen flex">
        {/* Left Side - Hero Image */}
        <div
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-trust/90 to-growth/80" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="animate-fade-up">
              <h1 className="text-4xl font-bold mb-6">Welcome to BantuHive</h1>
              <p className="text-xl mb-8 text-trust-foreground/90">
                The Silicon Valley Experience Tailored To Global Industrial Financial Needs
              </p>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-3 animate-slide-right"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>💝 Donation & Grant-Based Funding</span>
                </div>
                <div
                  className="flex items-center gap-3 animate-slide-right"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>🎁 Reward-Based Funding</span>
                </div>
                <div
                  className="flex items-center gap-3 animate-slide-right"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>📈 Equity Investment Opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white text-gray-800">
          <div className="w-full max-w-md">
            {/* Back to Home Button */}
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors animate-fade-down"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <Card className="shadow-glass-md animate-scale-in">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your BantuHive account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      className="w-full md:w-1/2 flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
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

                {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div> */}
              </CardContent>

              <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="font-medium text-bantu-green hover:text-bantu-green/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
