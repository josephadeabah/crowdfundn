// KYC.tsx
'use client';
import React, { useState } from 'react';
import KYCProcess from '@/app/components/kycstep/KYCProcess';
import KYCStatus from '@/app/components/kycstep/KYCStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Building2, TrendingUp, Users, CheckCircle, Info } from 'lucide-react';

const KYC = () => {
  const [selectedType, setSelectedType] = useState<'creator' | 'investor' | 'mentor' | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleTypeSelect = (type: 'creator' | 'investor' | 'mentor') => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setSelectedType(null);
    setShowForm(false);
  };

  const verificationOptions = [
    {
      type: 'creator' as const,
      title: 'Fundraiser Verification',
      description: 'Verify your identity to create and manage fundraising campaigns. Required for entrepreneurs and business owners.',
      icon: Building2,
      benefits: [
        'Create equity crowdfunding campaigns',
        'Receive investments from verified investors',
        'Manage your campaign team and documents',
        'Access fundraising analytics and insights',
        'Automatic investor privileges included'
      ]
    },
    {
      type: 'investor' as const,
      title: 'Investor Verification',
      description: 'Complete investor accreditation to participate in equity investments. Ideal for individuals who only want to invest.',
      icon: TrendingUp,
      benefits: [
        'Invest in vetted startup opportunities',
        'Access exclusive investment deals',
        'Build a diversified investment portfolio',
        'Receive investment updates and reports'
      ]
    },
    {
      type: 'mentor' as const,
      title: 'Mentor Application',
      description: 'Apply to become a mentor and share your expertise with growing startups in our ecosystem.',
      icon: Users,
      benefits: [
        'Connect with promising startups',
        'Share your industry expertise',
        'Build your professional network',
        'Contribute to startup success stories'
      ]
    }
  ];

  if (showForm && selectedType) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleBackToSelection}
            className="mb-6"
          >
            ← Back to verification options
          </Button>
          <KYCProcess userType={selectedType} onUserTypeChange={setSelectedType} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Identity Verification</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the type of verification you need to unlock platform features. 
            Fundraiser verification automatically includes investor privileges.
          </p>
        </div>

        <KYCStatus compact={true} showActions={false} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {verificationOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-sm h-12">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Benefits:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleTypeSelect(option.type)}
                  >
                    Select {option.type === 'creator' ? 'Fundraiser' : option.type === 'investor' ? 'Investor' : 'Mentor'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg dark:bg-blue-900/20">
          <div className="flex items-start mb-3">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Important Information
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Fundraiser verification includes investor privileges</strong> - You can invest without separate verification</li>
            <li>• Choose Investor verification only if you don't plan to fundraise</li>
            <li>• Mentor application is separate and doesn't include investment/fundraising rights</li>
            <li>• Verification typically takes 1-2 business days to complete</li>
            <li>• Your information is securely stored and protected</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg dark:bg-amber-900/20">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Recommended Choice
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                If you're unsure, choose <strong>Fundraiser verification</strong>. It gives you both fundraising 
                AND investment capabilities in a single verification process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;