// app/account/investor-clubs/components/VotingPanel/MemberInvestmentProposalModal.tsx

import React from 'react';
import Modal from '@/app/components/modal/Modal';
import ClubTransfers from './ClubTransfers';
import { Club } from '../../clubTypes';

interface MemberInvestmentProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
  onTransferSuccess?: () => void;
  club: Club;
}

const TransferClubBalanceModal: React.FC<
  MemberInvestmentProposalModalProps
> = ({ isOpen, onClose, formatCurrency, onTransferSuccess, club }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge"
      closeOnBackdropClick={false}
      customStyles={{
        padding: 0
      }}
    >
        <ClubTransfers formatCurrency={formatCurrency} onTransferSuccess={onTransferSuccess} club={club} />
    </Modal>
  );
};

export default TransferClubBalanceModal;
