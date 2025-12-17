// components/mentorship/HowItWorks.tsx
'use client';

import { useState } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  color: string;
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Request a Mentor',
      description: 'Founders with active campaigns can request mentors',
      icon: '📨',
      details: [
        'Ensure your fundraising campaign is active and published',
        'Browse mentor profiles with expertise in your industry',
        'Submit a mentorship request with your specific needs',
        'Mentors see your campaign details and business model',
      ],
      color: 'bg-blue-100 border-blue-300',
    },
    {
      id: 2,
      title: 'Mentor Acceptance',
      description:
        'Mentors review requests and choose which ventures to support',
      icon: '✅',
      details: [
        'Mentors review your request and campaign materials',
        'They assess fit based on their expertise and your needs',
        'You receive notification when a mentor accepts your request',
        'Schedule your first mentorship session',
      ],
      color: 'bg-green-100 border-green-300',
    },
    {
      id: 3,
      title: 'Capacity Limits',
      description: 'Mentors can support up to 5 ventures simultaneously',
      icon: '📊',
      details: [
        'Each mentor works with maximum 5 founders at a time',
        'Ensures quality attention and dedicated support',
        'Mentors become available as they complete engagements',
        'You get focused, high-quality guidance',
      ],
      color: 'bg-purple-100 border-purple-300',
    },
    {
      id: 4,
      title: 'Become a Mentor',
      description:
        'Verified users can apply to become mentors via Account → Settings → KYC',
      icon: '👨‍🏫',
      details: [
        'Go to Account → Settings → KYC verification',
        'Complete your profile with experience and expertise',
        'Submit verification for review',
        'Start helping founders once approved',
      ],
      color: 'bg-amber-100 border-amber-300',
    },
  ];

  return (
    <div id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            How Mentor Assignments Work
          </h2>
          <p className="text-xl text-gray-600">
            A simple, transparent process designed to create meaningful
            founder-mentor connections
          </p>
        </div>

        {/* Desktop Steps */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`${step.color} border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${activeStep === step.id ? 'ring-4 ring-blue-300 ring-opacity-50 transform -translate-y-2' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-lg font-bold mb-2 text-gray-900">
                Step {step.id}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Steps */}
        <div className="md:hidden mb-8">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${step.color} border-2 rounded-xl p-4 min-w-[85%] cursor-pointer ${activeStep === step.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{step.icon}</div>
                  <div>
                    <div className="text-sm font-medium">Step {step.id}</div>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{steps[activeStep - 1].icon}</div>
              <div>
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Step {activeStep}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {steps[activeStep - 1].title}
                </h3>
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-8">
              {steps[activeStep - 1].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps[activeStep - 1].details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-2 mt-1 shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-700">{detail}</p>
                </div>
              ))}
            </div>

            {activeStep === 4 && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="font-bold text-lg mb-2 text-blue-900">
                  Ready to become a mentor?
                </div>
                <p className="text-blue-800 mb-4">
                  Share your expertise and help the next generation of founders
                  succeed.
                </p>
                <a
                  href="/account/settings"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Go to Account Settings
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            )}

            {activeStep === 1 && (
              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="font-bold text-lg mb-2 text-green-900">
                  Ready to request a mentor?
                </div>
                <p className="text-green-800 mb-4">
                  Ensure your campaign is active and complete your founder
                  profile.
                </p>
                <a
                  href="#request-mentor"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Request a Mentor Now
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
