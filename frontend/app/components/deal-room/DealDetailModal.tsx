import { useState, useEffect } from 'react';
import Modal from '@/app/components/modal/Modal';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Deal } from './services/dealRoomApi';
import { useDealRoomApi } from './hooks/useDealRoom';
import { formatCurrency, formatNumber } from './utils/formatters';
import { DealHeader } from './deal-detail-modal/DealHeader';
import { FundingProgress } from './deal-detail-modal/FundingProgress';
import { TabsSection } from './deal-detail-modal/TabsSection';
import { Sidebar } from './deal-detail-modal/Sidebar';
import { ConversationModal } from './deal-detail-modal/ConversationModal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface DealDetailModalProps {
  deal: Deal | null;
  onClose: () => void;
  onDealUpdate?: () => void;
}

export function DealDetailModal({
  deal,
  onClose,
  onDealUpdate,
}: DealDetailModalProps) {
  const { token } = useAuth();
  const {
    getDealDocuments,
    getDealConversations,
    getDealMeetings,
    showInterest,
    joinDealRoom,
    createConversation,
  } = useDealRoomApi();

  const [documents, setDocuments] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInterested, setIsInterested] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  // Alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>(
    'info',
  );
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null);

  // Conversation title input state
  const [showConversationInput, setShowConversationInput] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (deal) {
      loadAdditionalData();
      setIsInterested(deal.interested > 0);
      setIsMember(deal.campaign?.deal_room?.is_member || false);
    }
  }, [deal]);

  const showAlertMessage = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    action?: () => void,
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertAction(() => action);
    setShowAlert(true);
  };

  const loadAdditionalData = async () => {
    if (!deal) return;

    setIsLoading(true);
    try {
      const [docs, convs, meets] = await Promise.all([
        getDealDocuments(deal.id),
        getDealConversations(deal.id),
        getDealMeetings(deal.id),
      ]);

      setDocuments(docs);
      setConversations(convs);
      // setMeetings(meets);
    } catch (error) {
      console.error('Failed to load additional data:', error);
      showAlertMessage('Error', 'Failed to load deal details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInterest = async () => {
    if (!deal || !token) {
      showAlertMessage(
        'Login Required',
        'Please login to show interest',
        'error',
      );
      return;
    }

    try {
      setIsLoading(true);
      await showInterest(deal.id);
      setIsInterested(true);
      showAlertMessage('Success', 'Interest shown successfully!', 'success');
      if (onDealUpdate) onDealUpdate();
    } catch (error) {
      console.error('Failed to show interest:', error);
      showAlertMessage(
        'Error',
        error instanceof Error ? error.message : 'Failed to show interest',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinDealRoom = async () => {
    if (!deal || !token) {
      showAlertMessage(
        'Login Required',
        'Please login to join deal room',
        'error',
      );
      return;
    }

    try {
      setIsLoading(true);
      await joinDealRoom(deal.id);
      setIsMember(true);
      showAlertMessage('Success', 'Successfully joined deal room!', 'success');
      if (onDealUpdate) onDealUpdate();
    } catch (error) {
      console.error('Failed to join deal room:', error);
      showAlertMessage(
        'Error',
        error instanceof Error ? error.message : 'Failed to join deal room',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = () => {
    if (!deal || !token) {
      showAlertMessage(
        'Login Required',
        'Please login to start a conversation',
        'error',
      );
      return;
    }
    setShowConversationInput(true);
    setConversationTitle('');
  };

  const confirmStartConversation = async () => {
    if (!conversationTitle.trim()) {
      showAlertMessage('Error', 'Please enter a conversation title', 'error');
      return;
    }

    try {
      setIsCreatingConversation(true);
      const result = await createConversation(
        deal!.id,
        conversationTitle.trim(),
      );

      if (result?.conversation?.id) {
        showAlertMessage(
          'Success',
          'Conversation created successfully!',
          'success',
          () => {
            setSelectedConversationId(result.conversation.id);
            setActiveTab('chat');
            loadAdditionalData();
          },
        );
      } else {
        showAlertMessage(
          'Success',
          'Conversation created successfully!',
          'success',
        );
        loadAdditionalData();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      showAlertMessage(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to create conversation',
        'error',
      );
    } finally {
      setIsCreatingConversation(false);
      setShowConversationInput(false);
      setConversationTitle('');
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setActiveTab('chat');
  };

  const handleShareDeal = () => {
    if (navigator.share) {
      navigator.share({
        title: deal?.companyName,
        text: `Check out ${deal?.companyName} on our deal room!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showAlertMessage('Success', 'Link copied to clipboard!', 'success');
    }
  };

  const handleSendMessageToFounder = () => {
    if (!deal || !token) {
      showAlertMessage(
        'Login Required',
        'Please login to send a message',
        'error',
      );
      return;
    }
    setConversationTitle(`Direct message with ${deal.founderName}`);
    setShowConversationInput(true);
  };

  const handleScheduleMeeting = () => {
    showAlertMessage(
      'Coming Soon',
      'Meeting scheduling feature coming soon!',
      'info',
    );
  };

  if (!deal) return null;

  const progressPercent = Math.min(
    (deal.currentRaise / deal.targetRaise) * 100,
    100,
  );

  const canJoin = deal.campaign?.deal_room?.can_join;
  const dealRoomMemberCount = deal.campaign?.deal_room?.member_count || 0;
  const dealRoomId = deal.campaign?.deal_room?.id || deal.id;

  return (
    <>
      <Modal
        isOpen={!!deal}
        onClose={onClose}
        size="huge"
        closeOnBackdropClick={true}
      >
        <DealHeader
          deal={deal}
          canJoin={canJoin}
          isMember={isMember}
          isLoading={isLoading}
          onJoinDealRoom={handleJoinDealRoom}
        />

        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <FundingProgress deal={deal} progressPercent={progressPercent} />

              <TabsSection
                activeTab={activeTab}
                onTabChange={setActiveTab}
                deal={deal}
                dealRoomId={dealRoomId}
                isMember={isMember}
                token={token}
                isLoading={isLoading}
                documents={documents}
                conversations={conversations}
                meetings={meetings}
                selectedConversationId={selectedConversationId}
                onStartConversation={handleStartConversation}
                onSelectConversation={handleSelectConversation}
                onJoinDealRoom={handleJoinDealRoom}
                onScheduleMeeting={handleScheduleMeeting}
                onShowAlertMessage={showAlertMessage}
              />
            </div>

            <Sidebar
              deal={deal}
              dealRoomMemberCount={dealRoomMemberCount}
              conversations={conversations}
              token={token}
              isMember={isMember}
              isLoading={isLoading}
              isInterested={isInterested}
              onShowInterest={handleShowInterest}
              onJoinDealRoom={handleJoinDealRoom}
              onSendMessageToFounder={handleSendMessageToFounder}
              onScheduleMeeting={handleScheduleMeeting}
              onShareDeal={handleShareDeal}
            />
          </div>
        </div>
      </Modal>

      <ConversationModal
        isOpen={showConversationInput}
        onClose={() => {
          setShowConversationInput(false);
          setConversationTitle('');
        }}
        title={conversationTitle}
        onTitleChange={setConversationTitle}
        isCreating={isCreatingConversation}
        onCreate={confirmStartConversation}
      />

      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={showAlert}
        setIsOpen={setShowAlert}
        onConfirm={() => {
          setShowAlert(false);
          if (alertAction) alertAction();
        }}
        onCancel={() => setShowAlert(false)}
        confirmText="OK"
        cancelText="Cancel"
        showCancelButton={false}
        confirmButtonClass={
          alertType === 'success'
            ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
            : alertType === 'error'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
        icon={
          alertType === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : alertType === 'error' ? (
            <AlertCircle className="w-6 h-6 text-red-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-blue-600" />
          )
        }
      />
    </>
  );
}
