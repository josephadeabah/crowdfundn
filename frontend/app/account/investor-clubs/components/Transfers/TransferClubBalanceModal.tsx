import React from 'react';
import Modal from '@/app/components/modal/Modal';
import ClubTransfers from './ClubTransfers';
import { Club } from '../../clubTypes';

interface TransferClubBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
  onTransferSuccess?: () => void;
  club: Club;
}

const TransferClubBalanceModal: React.FC<TransferClubBalanceModalProps> = ({
  isOpen,
  onClose,
  formatCurrency,
  onTransferSuccess,
  club,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge" // This now uses max-w-6xl (1152px) + w-[95vw]
      closeOnBackdropClick={false}
      customStyles={{
        padding: 0,
      }}
    >
      <ClubTransfers
        club={club}
        formatCurrency={formatCurrency}
        onTransferSuccess={onTransferSuccess}
      />
    </Modal>
  );
};

export default TransferClubBalanceModal;