// components/BackingPeriodSelector.tsx
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/app/components/radio/RadioGroup';

interface BackingPeriodSelectorProps {
  billingFrequency: string;
  setBillingFrequency: (value: string) => void;
}

const BackingPeriodSelector: React.FC<BackingPeriodSelectorProps> = ({
  billingFrequency,
  setBillingFrequency,
}) => {
  return (
    <div className="mb-4">
      <h5 className="font-semibold mb-2">Choose Backing Period</h5>
      <RadioGroup value={billingFrequency} onValueChange={setBillingFrequency}>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="once" id="once" className="mr-2" />
          <label htmlFor="once">One-Time</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="hourly" id="hourly" className="mr-2" />
          <label htmlFor="hourly">Hourly</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="daily" id="daily" className="mr-2" />
          <label htmlFor="daily">Daily</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="weekly" id="weekly" className="mr-2" />
          <label htmlFor="weekly">Weekly</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="monthly" id="monthly" className="mr-2" />
          <label htmlFor="monthly">Monthly</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="quartely" id="quartely" className="mr-2" />
          <label htmlFor="quartely">Quarterly</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="biannually" id="biannually" className="mr-2" />
          <label htmlFor="biannually">Bi-Annually</label>
        </div>
        <div className="flex gap-1 items-center">
          <RadioGroupItem value="annualy" id="annualy" className="mr-2" />
          <label htmlFor="annualy">Annually</label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default BackingPeriodSelector;
