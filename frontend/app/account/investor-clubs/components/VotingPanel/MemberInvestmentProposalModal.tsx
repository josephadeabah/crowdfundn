// app/account/investor-clubs/components/VotingPanel/MemberInvestmentProposalModal.tsx

import React from 'react';
import Modal from '@/app/components/modal/Modal';
import MemberInvestmentProposal from './MemberInvestmentProposal';

interface MemberInvestmentProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: any;
}

const MemberInvestmentProposalModal: React.FC<
  MemberInvestmentProposalModalProps
> = ({ isOpen, onClose, club }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge"
      closeOnBackdropClick={true}
    >
      <div className="h-full">
        <MemberInvestmentProposal club={club} onClose={onClose} />
      </div>
    </Modal>
  );
};

export default MemberInvestmentProposalModal;
