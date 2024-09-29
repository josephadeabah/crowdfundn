import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { FiArrowRight, FiInfo, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const WalkthroughComponent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      title: 'Welcome to Our App',
      content: "Let's walk you through the main features of our application.",
      position: { top: '10%', left: '50%' },
    },
    {
      title: 'Dashboard Overview',
      content:
        'This is your dashboard where you can see all your important information at a glance.',
      position: { top: '30%', left: '20%' },
    },
    {
      title: 'Create New Project',
      content:
        'Click here to start a new project and collaborate with your team.',
      position: { top: '50%', right: '20%' },
    },
    {
      title: 'Profile Settings',
      content:
        'Customize your profile and adjust your preferences in the settings menu.',
      position: { bottom: '20%', left: '30%' },
    },
  ];

  useEffect(() => {
    // Check if running in the browser before accessing window object
    if (typeof window !== 'undefined') {
      const handleResize = () => setWindowWidth(window.innerWidth);
      setWindowWidth(window.innerWidth); // Set initial width
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].focus();
    }
  }, [currentStep]);

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

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen || windowWidth === null) return null; // Ensure windowWidth is set before rendering

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full h-full">
        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => (stepRefs.current[index] = el)}
            tabIndex={0}
            className={`absolute transition-all duration-300 ease-in-out ${
              index === currentStep
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
            style={{
              ...step.position,
              transform: `translate(-50%, -50%) ${
                index === currentStep ? 'scale(1)' : 'scale(0.95)'
              }`,
            }}
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                {step.title}
              </h2>
              <p className="text-gray-700 mb-6">{step.content}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-full ${
                    currentStep === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  } transition-colors duration-200`}
                >
                  <FaArrowLeft />
                </button>
                <div className="flex space-x-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i === currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className={`px-4 py-2 rounded-full ${
                    currentStep === steps.length - 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  } transition-colors duration-200`}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors duration-200"
          aria-label="Close walkthrough"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default WalkthroughComponent;

export const Walkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const steps = [
    {
      title: 'Welcome to Our App',
      description: "Let's explore the key features together!",
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      title: 'Dashboard Overview',
      description:
        "Here's where you can see all your important stats at a glance.",
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      title: 'Task Management',
      description: 'Create, assign, and track tasks effortlessly.',
      image:
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
    },
    {
      title: 'Analytics',
      description: 'Gain insights with our powerful analytics tools.',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="relative">
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <h2 className="text-white text-3xl font-bold">
                  {steps[currentStep].title}
                </h2>
              </div>
              <div
                className="absolute top-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <FiInfo className="text-blue-500" />
              </div>
              {showTooltip && (
                <div className="absolute top-14 right-4 bg-white p-2 rounded shadow-md">
                  Click on hotspots for more info
                </div>
              )}
            </div>
            <p className="text-gray-600 text-lg">
              {steps[currentStep].description}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
                >
                  Next <FiArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
                >
                  Finish <FiCheck className="ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
