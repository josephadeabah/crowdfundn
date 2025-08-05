// KYC.tsx
'use client';
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import KYCProcess from '@/app/components/kycstep/KYCProcess';

const KYC = () => {
  const [userType, setUserType] = useState<'creator' | 'investor' | 'mentor'>(
    'creator',
  );

  const handleTabChange = (value: string) => {
    setUserType(value as 'creator' | 'investor' | 'mentor');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {userType === 'creator'
                ? 'Campaign Creator'
                : userType === 'investor'
                  ? 'Investor'
                  : 'Mentor'}{' '}
              Verification
            </h1>
            <p className="text-gray-600 mb-6">
              Complete the verification process to{' '}
              {userType === 'creator'
                ? 'start fundraising'
                : userType === 'investor'
                  ? 'begin investing'
                  : 'become a qualified mentor to a startup'}
              .
            </p>
          </div>

          <Tabs
            value={userType}
            onValueChange={handleTabChange}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="creator">Campaign Creator</TabsTrigger>
              <TabsTrigger value="investor">Investor</TabsTrigger>
              <TabsTrigger value="mentor">Apply As Mentor</TabsTrigger>
            </TabsList>
          </Tabs>

          <KYCProcess userType={userType} onUserTypeChange={setUserType} />
        </div>
      </div>
    </div>
  );
};

export default KYC;
