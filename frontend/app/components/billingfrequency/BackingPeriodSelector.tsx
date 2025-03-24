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

  return (
    <div className="mb-6 px-4 py-6 bg-white rounded-lg shadow-sm">
      <h5 className="font-semibold text-xl mb-4 text-gray-800">
        Choose Backing Period
      </h5>

      <RadioGroup value={billingFrequency} onValueChange={setBillingFrequency}>
        {/* One-Time option is always enabled */}
        <div className="flex items-center space-x-3 mb-4">
          <RadioGroupItem value="once" id="once" className="h-5 w-5" />
          <label htmlFor="once" className="text-gray-700">
            One-Time
          </label>
        </div>

        {/* Show other options only if user is logged in */}
        {user && (
          <div className="space-y-3">
            {[
              'hourly',
              'daily',
              'weekly',
              'monthly',
              'quartely',
              'biannually',
              'annualy',
            ].map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="h-5 w-5"
                  disabled
                />
                <label htmlFor={option} className="text-gray-700 capitalize">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default BackingPeriodSelector;
