import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
}

const Stepper = ({ steps }: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <form className="w-full">
      <div data-stepper="true">
        {/* Step Indicators */}
        <div className="flex justify-between items-center gap-4 py-8">
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;
            return (
              <div
                key={index}
                className={`flex gap-2.5 items-center ${isActive ? 'active' : ''}`}
                data-stepper-item={`#stepper_${index + 1}`}
              >
                <div
                  className={`rounded-full w-10 h-10 flex items-center justify-center font-semibold text-md ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {!isCompleted ? (
                    <span>{index + 1}</span>
                  ) : (
                    <CheckIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h4
                    className={`text-sm font-medium ${isCompleted ? 'text-gray-600' : isActive ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {step.title}
                  </h4>
                  <span
                    className={`text-xs ${isCompleted ? 'text-gray-400' : 'text-gray-700'}`}
                  >
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="py-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={index + 1 === currentStep ? '' : 'hidden'}
              id={`stepper_${index + 1}`}
            >
              <div className="flex items-center justify-center text-3xl font-semibold text-gray-900">
                {step.content}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="py-8 flex justify-between">
          <button
            type="button"
            className={`bg-gray-200 px-4 py-2 rounded ${currentStep === 1 ? 'hidden' : ''}`}
            onClick={handleBack}
          >
            Back
          </button>
          <div>
            <button
              type="button"
              className={`bg-gray-200 px-4 py-2 rounded ${currentStep === steps.length ? 'hidden' : ''}`}
              onClick={handleNext}
            >
              Next
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded ${currentStep !== steps.length ? 'hidden' : ''}`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Stepper;
