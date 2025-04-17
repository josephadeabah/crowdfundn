import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

const CONTRACT_OPTIONS = [
  { id: 'safe', label: 'Future Equity (SAFE)' },
  { id: 'convertible-note', label: 'Convertible Note' },
  { id: 'revenue-share', label: 'Revenue Share' },
  { id: 'equity-revenue', label: 'Future Equity + Revenue Share' },
  { id: 'simple-loan', label: 'Simple Loan' },
  { id: 'preferred-stock', label: 'Preferred Stock' },
  { id: 'other', label: 'Other/I don\'t know yet' },
];

interface TermsContractProps {
  contractType: string;
  setContractType: (value: string) => void;
}

const TermsContract = ({
  contractType,
  setContractType,
}: TermsContractProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Choose an investment contract structure</h3>
        <RadioGroup 
          value={contractType} 
          onValueChange={setContractType}
          className="space-y-3"
        >
          {CONTRACT_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TermsContract;