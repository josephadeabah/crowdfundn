import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import RichTextEditor from '@/app/components/ui/RichTextEditor';

interface TermsContractProps {
  contractTerms: string;
  setContractTerms: (value: string) => void;
}

const TermsContract = ({
  contractTerms,
  setContractTerms,
}: TermsContractProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Contract Terms</h3>
        <RichTextEditor
          value={contractTerms}
          onChange={setContractTerms}
          placeholder="Legal terms, investment contract details, and conditions..."
        />
      </CardContent>
    </Card>
  );
};

export default TermsContract;
