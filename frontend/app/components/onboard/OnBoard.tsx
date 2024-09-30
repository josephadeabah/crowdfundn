'use client';

import React, { useState } from 'react';
import {
  FiArrowRight,
  FiCheck,
  FiPieChart,
  FiUsers,
  FiActivity,
  FiBarChart,
  FiAward,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../button/Button';

const OnBoard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Bantuhive',
      description:
        'Easy onboarding and fun to get started and manage your campaigns and supporters.',
      icon: <FiPieChart size={80} />,
    },
    {
      title: 'Manage Your Campaigns',
      description:
        'Track donations, monitor progress, and keep your supporters updated all in one place.',
      icon: <FiUsers size={80} />,
    },
    {
      title: 'Supporter Engagement',
      description:
        'Keep your community engaged by thanking donors and sharing updates with them.',
      icon: <FiActivity size={80} />,
    },
    {
      title: 'Rewards & Recognition',
      description:
        'Show your appreciation by offering rewards to your backers and recognizing their contributions.',
      icon: <FiAward size={80} />,
    },
    {
      title: 'Track Your Impact',
      description:
        'Monitor campaign analytics to see how your efforts are making a difference.',
      icon: <FiBarChart size={80} />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            layout
          >
            <div className="flex justify-center">
              <div className="text-gray-700 dark:text-gray-300">
                {steps[currentStep].icon}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-lg text-center">
              {steps[currentStep].description}
            </p>
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 disabled:opacity-50"
                size="default"
                variant="destructive"
              >
                Previous
              </Button>
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentStep ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="px-4 py-2 flex items-center"
                  size="default"
                  variant="destructive"
                >
                  Next <FiArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSkip}
                  className="px-4 py-2 flex items-center"
                  size="default"
                  variant="destructive"
                >
                  Finish <FiCheck className="ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnBoard;
