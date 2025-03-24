import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';
import { useAuth } from '@/app/context/auth/AuthContext';

interface BackingPeriodSelectorProps {
  billingFrequency: string;
  setBillingFrequency: (value: string) => void;
}

const BackingPeriodSelector: React.FC<BackingPeriodSelectorProps> = ({
  billingFrequency,
  setBillingFrequency,
}) => {
  const { user } = useAuth();

  // Only show the component if user is logged in
  if (!user) {
    return null;
  }

  return (
    <div className="mb-6 px-4 py-6 bg-white rounded-lg shadow-sm">
      <h5 className="font-semibold text-xl mb-4 text-gray-800">
        Choose Backing Period
      </h5>

      <RadioGroup value={billingFrequency} onValueChange={setBillingFrequency}>
        <div className="space-y-3">
          {[
            'daily',
            'weekly',
            'monthly',
            'quarterly',
            'biannually',
            'annually'
          ].map((option) => (
            <div key={option} className="flex items-center space-x-3">
              <RadioGroupItem
                value={option}
                id={option}
                className="h-5 w-5"
              />
              <label htmlFor={option} className="text-gray-700 capitalize">
                {option}
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default BackingPeriodSelector;