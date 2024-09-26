'use client';

import React from 'react';
import { Button } from '../button/Button';

interface Step {
  label: string;
  content?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void; // Function to handle step changes
  onSubmit: () => void; // Function to handle final form submission
  loading?: boolean; // Optional loading state
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  loading,
}) => {
  // Handler for moving to the next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onSubmit(); // Call onSubmit if it's the last step
    }
  };

  // Handler for moving to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center mx-auto w-full">
      {steps.map((step, index) => (
        <div className="flex items-center w-full" key={index}>
          <div
            className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${
              index < currentStep || index === currentStep
                ? 'bg-red-600'
                : 'bg-gray-300'
            }`}
          >
            {index < currentStep ? (
              // Completed steps with check icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full fill-white"
                viewBox="0 0 24 24"
              >
                <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" />
              </svg>
            ) : index === currentStep ? (
              // Active step with an icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full fill-white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <circle cx="12" cy="12" r="5" fill="white" />
              </svg>
            ) : (
              // Future steps with the step number
              <span
                className={`text-base ${
                  index === currentStep ? 'text-white' : 'text-gray-400'
                } font-bold`}
              >
                {index + 1}
              </span>
            )}
          </div>
          <h6
            className={`text-lg ml-4 whitespace-nowrap ${
              index === steps.length - 1 ? 'hidden lg:block' : ''
            }`}
          >
            {step.label}
          </h6>
          {index < steps.length - 1 && (
            <div
              className={`w-full h-1 rounded-xl mx-4 ${
                index < currentStep ? 'bg-red-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}

      {/* Render content for the current step */}
      <div className="mt-4 w-full text-center">
        {steps[currentStep]?.content}
      </div>

      {/* Step navigation buttons */}
      <div className="w-full flex justify-between gap-8 h-full mt-4">
        {/* Previous Button */}
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`w-full px-6 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
            currentStep === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          Previous
        </Button>

        {/* Next or Submit Button */}
        <Button
          onClick={handleNext}
          disabled={loading}
          className={`w-full px-6 py-2 text-sm font-semibold rounded-md transition-all duration-150 ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : currentStep === steps.length - 1
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading
            ? 'Loading...'
            : currentStep === steps.length - 1
              ? 'Finish'
              : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default Stepper;
