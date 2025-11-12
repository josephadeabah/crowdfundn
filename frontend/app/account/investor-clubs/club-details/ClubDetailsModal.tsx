// app/account/investor-clubs/club-details/ClubDetailsModal.tsx
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { ClubDetailsModalProps } from './types/club-details-types';
import { useClubMembership } from './hooks/useClubMembership';
import ClubHeader from './components/ClubHeader';
import ClubTabs from './components/ClubTabs';
import AboutTab from './components/AboutTab';
import MembersTab from './components/MembersTab';
import ActionsTab from './components/ActionsTab';
import { ContributionModal } from '../components/Contribution/ContributionModal';
import { useAuth } from '@/app/context/auth/AuthContext';

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  club,
  members,
  onMembershipUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'about' | 'members' | 'actions' | 'share-history'
  >('about');
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [transferAlert, setTransferAlert] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const { token } = useAuth();

  const {
    myMembership,
    loading,
    actionLoading,
    message,
    loadMyMembership,
    handleJoinClub,
    handleLeaveClub,
    handleCancelRequest,
    handleDeleteClub,
    handleApproveMember,
    handleRejectMember,
    setMessage,
  } = useClubMembership(club, members, isOpen, onMembershipUpdate);

  const handleFeatureClick = (featureName: string) => {
    setFeatureMessage(`${featureName} feature would open here`);
    setFeatureAlert(true);
  };

  const handleMakeContribution = () => {
    setIsContributionModalOpen(true);
  };

  // Simple close handler - no payment verification
  const handleContributionClose = () => {
    setIsContributionModalOpen(false);
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderTabContent = () => {
    const commonProps = {
      club,
      members,
      myMembership,
      loading,
      actionLoading,
      message,
      onMembershipUpdate,
      onFeatureClick: handleFeatureClick,
    };

    switch (activeTab) {
      case 'about':
        return <AboutTab {...commonProps} />;
      case 'members':
        return (
          <MembersTab
            {...commonProps}
            onJoinClub={handleJoinClub}
            onApproveMember={handleApproveMember}
            onRejectMember={handleRejectMember}
          />
        );
      case 'actions':
        return (
          <ActionsTab
            {...commonProps}
            onTabChange={setActiveTab}
            onJoinClub={handleJoinClub}
            onLeaveClub={handleLeaveClub}
            onCancelRequest={handleCancelRequest}
            onDeleteClub={handleDeleteClub}
            onMakeContribution={handleMakeContribution}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnBackdropClick={false}
        size="xxxlarge"
        customStyles={{ padding: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ClubHeader club={club} myMembership={myMembership} />

          {message && (
            <div
              className={`mx-6 mt-4 p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <ClubTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
        </motion.div>
      </Modal>

      {/* Contribution Modal - Only opens modal, no payment handling */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={handleContributionClose}
        club={club}
        token={token}
        formatCurrency={formatCurrency}
        showSuccess={false} // Disable success display in this modal
      />

      {/* Transfer Ownership Alert */}
      <AlertPopup
        title="Transfer Ownership Required"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              As the club creator, you cannot leave the club without first
              transferring ownership to another admin member.
            </p>
            <p className="text-sm text-gray-700">
              Please transfer ownership to another member before leaving the
              club.
            </p>
          </div>
        }
        isOpen={transferAlert}
        setIsOpen={setTransferAlert}
        onConfirm={() => setTransferAlert(false)}
        confirmText="I Understand"
        confirmButtonClass="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
        showCancelButton={false}
      />

      {/* Feature Coming Soon Alert */}
      <AlertPopup
        title="Feature Coming Soon"
        message={featureMessage}
        isOpen={featureAlert}
        setIsOpen={setFeatureAlert}
        onConfirm={() => setFeatureAlert(false)}
        confirmText="Got it"
        confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
        showCancelButton={false}
      />
    </>
  );
};

export default ClubDetailsModal;
