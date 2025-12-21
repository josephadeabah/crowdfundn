// In ClubDetailsModal.tsx, update the handleSendMessage function:
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
import { ShareChangesSection } from '../components/ShareChanges/ShareChangesSection';
import MemberInvestmentProposalModal from '../components/VotingPanel/MemberInvestmentProposalModal';
import { MessageSquare } from 'lucide-react';
import { usePremium } from '@/app/context/premium/PremiumContext';
import { FaComments } from 'react-icons/fa'; // Add this import
import PremiumUpgradeModal from '@/app/components/premium/PremiumUpgradeModal';

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  club,
  portfolio,
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
  const [isInvestmentProposalModalOpen, setIsInvestmentProposalModalOpen] =
    useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showMessageAlert, setShowMessageAlert] = useState(false); // Add this state
  const { token } = useAuth();
  const { subscription } = usePremium();

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

  // Check if user has premium
  const hasPremium = subscription?.has_premium;

  const handleFeatureClick = (featureName: string) => {
    setFeatureMessage(`${featureName} feature would open here`);
    setFeatureAlert(true);
  };

  const handleMakeContribution = () => {
    setIsContributionModalOpen(true);
  };

  // Handler for propose investment
  const handleProposeInvestment = () => {
    setIsInvestmentProposalModalOpen(true);
  };

  // NEW: Handler for sending messages
  const handleSendMessage = () => {
    if (!hasPremium) {
      // Show premium upgrade modal
      setShowPremiumModal(true);
    } else {
      // User has premium, show confirmation alert
      setShowMessageAlert(true);
    }
  };

  // Handle message confirmation
  const handleMessageConfirm = () => {
    // Open messages page with club pre-selected in a new tab
    window.open(`/account/messages?club=${club.slug}`, '_blank');
    setShowMessageAlert(false);
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
      portfolio,
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
            onProposeInvestment={handleProposeInvestment}
          />
        );
      case 'share-history':
        return (
          <ShareChangesSection club={club} formatCurrency={formatCurrency} />
        );
      default:
        return null;
    }
  };

  // Get club icon for message alert
  const getClubIcon = () => {
    const focus = club.investment_focus?.toLowerCase();
    if (focus?.includes('tech') || focus?.includes('software')) {
      return '💻';
    } else if (focus?.includes('finance') || focus?.includes('banking')) {
      return '💰';
    } else if (focus?.includes('real estate') || focus?.includes('property')) {
      return '🏠';
    } else if (focus?.includes('health') || focus?.includes('medical')) {
      return '🏥';
    } else if (focus?.includes('education') || focus?.includes('learning')) {
      return '📚';
    } else {
      return '🏢';
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
          className="bg-white rounded-2xl shadow-sm w-full overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Add Message Button to Header Section */}
          <div className="relative">
            <ClubHeader club={club} myMembership={myMembership} />

            {/* Message Button - positioned in top-right corner */}
            <button
              onClick={handleSendMessage}
              className={`absolute top-4 right-4 p-3 rounded-full transition-colors shadow-md hover:shadow-lg ${
                hasPremium
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700'
              }`}
              title={
                hasPremium
                  ? `Send message to ${club.name}`
                  : 'Upgrade to premium to send messages'
              }
            >
              <MessageSquare size={20} />
            </button>
          </div>

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

      {/* Investment Proposal Modal */}
      <MemberInvestmentProposalModal
        isOpen={isInvestmentProposalModalOpen}
        onClose={() => setIsInvestmentProposalModalOpen(false)}
        club={club}
      />

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName="sending messages to investment clubs"
        onUpgrade={() => {
          // Redirect to pricing page
          window.open('/account/pricing', '_blank');
        }}
      />

      {/* Message Confirmation Alert Popup */}
      <AlertPopup
        title="Send Message"
        message={
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 text-2xl">
                {getClubIcon()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{club.name}</h4>
                <p className="text-sm text-gray-600">
                  {club.current_members_count} members • {club.club_type}
                </p>
              </div>
            </div>
            <p className="text-gray-700">
              You're about to send a message to{' '}
              <span className="font-semibold">{club.name}</span>. This will open
              your messages page in a new tab where you can communicate with
              club members.
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Premium Benefit:</span> As a
                premium user, you have unlimited messaging access to all
                investment clubs.
              </p>
            </div>
          </div>
        }
        isOpen={showMessageAlert}
        setIsOpen={setShowMessageAlert}
        onConfirm={handleMessageConfirm}
        onCancel={() => setShowMessageAlert(false)}
        icon={<FaComments className="w-6 h-6 text-gray-600" />}
        confirmText="Open Messages"
        cancelText="Cancel"
        confirmButtonClass="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
        cancelButtonClass="bg-white hover:bg-gray-50"
        showCancelButton={true}
        maxHeight="max-h-96"
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
