import React from 'react';
import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import { cn } from '@/app/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?:
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'xxxlarge'
    | 'full';
  closeOnBackdropClick?: boolean;
  customStyles?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  closeOnBackdropClick = true,
  customStyles = {},
}) => {
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xlarge: 'max-w-xl',
    xxlarge: 'max-w-2xl',
    xxxlarge: 'max-w-3xl',
    full: 'max-w-full md:mx-6',
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          `fixed left-[50%] top-[50%] z-50 grid w-full ${sizeClasses[size]} translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg`,
        )}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          ...customStyles,
        }}
        onPointerDownOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
        onInteractOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
