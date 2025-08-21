// ProgressSteps.tsx - Responsive version
'use client';
import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
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
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Desktop view (horizontal) */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep
                    ? 'bg-bantu-green text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <div className="ml-2">
                <div
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-bantu-green' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-8 ${
                    index < currentStep ? 'bg-bantu-green' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile view (vertical) */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? 'bg-bantu-green text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      index < currentStep ? 'bg-bantu-green' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="pt-1">
                <div
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-bantu-green' : 'text-gray-500'
                  }`}
                >
                  Step {index + 1}: {step.title}
                </div>
                {index === currentStep && (
                  <div className="text-xs text-gray-500 mt-1">Current step</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
