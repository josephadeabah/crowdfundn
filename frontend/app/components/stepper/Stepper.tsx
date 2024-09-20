'use client';

import React from 'react';

interface Step {
  label: string;
  content?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
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
    </div>
  );
};

export default Stepper;
