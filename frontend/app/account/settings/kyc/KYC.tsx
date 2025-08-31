// KYC.tsx
'use client';
import React, { useState } from 'react';
import KYCProcess from '@/app/components/kycstep/KYCProcess';
import KYCStatus from '@/app/components/kycstep/KYCStatus';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
  Info,
  UserCheck,
} from 'lucide-react';

const KYC = () => {
  const [selectedType, setSelectedType] = useState<
    'issuer' | 'investor' | 'both' | 'mentor' | null
  >(null);
  const [showForm, setShowForm] = useState(false);

  const handleTypeSelect = (
    type: 'issuer' | 'investor' | 'both' | 'mentor',
  ) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setSelectedType(null);
    setShowForm(false);
  };

  const verificationOptions = [
    {
      type: 'issuer' as const,
      title: 'Fundraiser Only',
      description:
        'Verify to create fundraising campaigns only. Ideal for entrepreneurs focused solely on raising funds.',
      icon: Building2,
      benefits: [
        'Create equity crowdfunding campaigns',
        'Receive investments from verified investors',
        'Manage your campaign team and documents',
        'Build and grow your business',
      ],
    },
    {
      type: 'investor' as const,
      title: 'Investor Only',
      description:
        'Verify to invest in startups only. Perfect for individuals who want to support innovation.',
      icon: TrendingUp,
      benefits: [
        'Invest in vetted startup opportunities',
        'Access exclusive investment deals',
        'Build a diversified investment portfolio',
        'Receive investment updates and reports',
      ],
    },
    {
      type: 'both' as const,
      title: 'Full Platform Access',
      description:
        'Verify as both fundraiser AND investor for complete platform access and maximum flexibility.',
      icon: UserCheck,
      benefits: [
        'Create equity crowdfunding campaigns',
        'Invest in other startup opportunities',
        'Manage both fundraising and investing',
        'Full ecosystem participation',
      ],
    },
    {
      type: 'mentor' as const,
      title: 'Mentor Application',
      description:
        'Apply to become a mentor and share your expertise with growing startups in our ecosystem.',
      icon: Users,
      benefits: [
        'Connect with promising startups',
        'Share your industry expertise',
        'Build your professional network',
        'Contribute to startup success stories',
      ],
    },
  ];

  if (showForm && selectedType) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBackToSelection}
            className="mb-6"
          >
            ← Back to verification options
          </Button>
          <KYCProcess
            userType={selectedType}
            onUserTypeChange={setSelectedType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Identity Verification</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the type of verification you need to unlock platform
            features. Select the option that best matches your goals on our
            platform.
          </p>
        </div>

        <KYCStatus showActions={false} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {verificationOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card
                key={option.type}
                className="hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardHeader className="text-center flex-shrink-0">
                  <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full dark:bg-gray-900/20">
                    <IconComponent className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-sm min-h-[3rem]">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="space-y-3 mb-6 flex-grow">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Benefits:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className="w-full mt-auto"
                    variant="outline"
                    onClick={() => handleTypeSelect(option.type)}
                  >
                    Select{' '}
                    {option.type === 'issuer'
                      ? 'Fundraiser'
                      : option.type === 'investor'
                        ? 'Investor'
                        : option.type === 'both'
                          ? 'Full Access'
                          : 'Mentor'}
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
            <li>
              • <strong>Fundraiser verification</strong> - Create campaigns and
              raise funds
            </li>
            <li>
              • <strong>Investor verification</strong> - Invest in other
              startups only
            </li>
            <li>
              • <strong>Full Platform Access</strong> - Both fundraising AND
              investing capabilities
            </li>
            <li>
              • <strong>Mentor application</strong> - Guide startups (no
              investment/fundraising rights)
            </li>
            <li>
              • Verification typically takes 1-2 business days to complete
            </li>
            <li>• Your information is securely stored and protected</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Recommended Choice
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                For most users, we recommend{' '}
                <strong>Full Platform Access</strong>. It gives you complete
                flexibility to both raise funds for your own venture AND invest
                in other promising startups.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg dark:bg-amber-900/20">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Already Verified?
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                If you're already verified as one type (e.g., Investor) and want
                to add additional capabilities (e.g., Fundraiser), you'll need
                to complete a new verification for the additional role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;
