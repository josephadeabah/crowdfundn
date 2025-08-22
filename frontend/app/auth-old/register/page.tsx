'use client';
import React from 'react';
import RegisterLeftPage from './RegisterLeftPage';
import RegisterForm from './RegisterForm';

const RegisterComponent = () => {
  return (
    <>
      <div className="h-full flex items-center justify-center p-2 mt-10 mb-10">
        <div className="max-w-7xl w-full bg-white dark:bg-gray-800 dark:text-gray-50 rounded-sm">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:block md:w-1/2 pr-8">
              <RegisterLeftPage />
            </div>
            <div className="md:w-1/2">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterComponent;
