'use client';

import React from 'react';

interface OnboardingModalProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  completeOnboarding: () => void;
  tabs: { label: string; description: string }[];
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentStep,
  setCurrentStep,
  completeOnboarding,
  tabs,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-sm max-w-xl w-full">
        <h3 className="text-xl font-semibold mb-4">
          Welcome to Bantu Hive! Let's take a quick tour.
        </h3>
        <div className="mb-4">
          <h4 className="font-bold text-lg">{tabs[currentStep].label}</h4>
          <p>{tabs[currentStep].description}</p>
        </div>
        <div className="flex justify-between mt-4">
          {/* Grouping Previous and Next Buttons */}
          <div className="flex space-x-4">
            <button
              className="py-2 px-4 bg-gray-300 text-black rounded-lg cursor-pointer"
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                }
              }}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-lg cursor-pointer"
              onClick={() => {
                if (currentStep === tabs.length - 1) {
                  completeOnboarding();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
            >
              {currentStep === tabs.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>

          {/* Skip Tour Button */}
          <button
            className="py-2 px-4 bg-gray-300 text-black rounded-lg cursor-pointer"
            onClick={completeOnboarding}
          >
            Skip Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
