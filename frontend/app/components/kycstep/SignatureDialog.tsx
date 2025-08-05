// components/SignatureDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import SignaturePad from '@/app/account/settings/kyc/signature/SignaturePad';
import { Point } from '@/app/account/settings/kyc/signature/signatureUtils';

interface SignatureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (signature: Point[]) => void;
  onCancel: () => void;
}

export const SignatureDialog: React.FC<SignatureDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Your Certificate</DialogTitle>
          <DialogDescription>
            Please sign in the box below to validate your digital certificate.
          </DialogDescription>
        </DialogHeader>
        <SignaturePad onSave={onSave} onCancel={onCancel} />
        <DialogFooter className="sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
