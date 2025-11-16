// app/account/investor-clubs/components/Transfers/TransferClubBalanceModal.tsx
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
      size="xxxlarge"
      closeOnBackdropClick={false}
      customStyles={{
        padding: 0,
        maxHeight: '95vh',
        overflow: 'hidden',
      }}
    >
      <div className="h-full">
        <ClubTransfers
          club={club}
          formatCurrency={formatCurrency}
          onTransferSuccess={onTransferSuccess}
        />
      </div>
    </Modal>
  );
};

export default TransferClubBalanceModal;
