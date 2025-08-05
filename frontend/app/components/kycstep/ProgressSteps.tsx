// components/ProgressSteps.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-10">
      {/* Vertical stack on mobile, horizontal on desktop */}
      <div className="flex flex-col md:flex-row justify-between mb-2 space-y-4 md:space-y-0">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex md:flex-col items-center md:items-center space-x-4 md:space-x-0"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                index <= currentStep
                  ? 'bg-bantu-green border-bantu-green text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm md:mt-2 text-center ${
                index <= currentStep ? 'text-bantu-green' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute left-0 top-0 h-2 bg-bantu-green rounded-full transition-all"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};