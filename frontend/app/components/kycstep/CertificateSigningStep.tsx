// components/CertificateSigningStep.tsx
import React from 'react';
import { Button } from '@/app/components/ui/button';
import DigitalCertificate from '@/app/account/settings/kyc/signature/DigitalCertificate';
import { Point } from '@/app/account/settings/kyc/signature/signatureUtils';
interface CertificateSigningStepProps {
  isSigned: boolean;
  signature: Point[];
  onSignClick: () => void;
  onRemoveSignature: () => void;
  onPreviousStep: () => void;
  onSubmit: () => void;
}

export const CertificateSigningStep: React.FC<CertificateSigningStepProps> = ({
  isSigned,
  signature,
  onSignClick,
  onRemoveSignature,
  onPreviousStep,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <DigitalCertificate
        isSigned={isSigned}
        signature={signature}
        onSignClick={onSignClick}
        onRemoveSignature={onRemoveSignature}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPreviousStep}>
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isSigned}
          className="bg-bantu-green hover:bg-bantu-dark-green"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
