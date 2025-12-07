import {
  Users,
  Clock,
  FileText,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/seperator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import Modal from '@/app/components/modal/Modal';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Deal } from './services/dealRoomApi';
import { DealRoomChat } from './DealRoomChat';
import { useDealRoomApi } from './hooks/useDealRoom';

interface DealDetailModalProps {
  deal: Deal | null;
  onClose: () => void;
  onDealUpdate?: () => void;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

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
  >(null); // ADDED

  useEffect(() => {
    if (deal) {
      loadAdditionalData();
      setIsInterested(deal.interested > 0);
      setIsMember(deal.campaign?.deal_room?.is_member || false);
    }
  }, [deal]);

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
      setMeetings(meets);
    } catch (error) {
      console.error('Failed to load additional data:', error);
      toast.error('Failed to load deal details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowInterest = async () => {
    if (!deal || !token) {
      toast.error('Please login to show interest');
      return;
    }

    try {
      setIsLoading(true);
      await showInterest(deal.id);
      setIsInterested(true);
      toast.success('Interest shown successfully!');
      if (onDealUpdate) onDealUpdate();
    } catch (error) {
      console.error('Failed to show interest:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to show interest',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinDealRoom = async () => {
    if (!deal || !token) {
      toast.error('Please login to join deal room');
      return;
    }

    try {
      setIsLoading(true);
      await joinDealRoom(deal.id);
      setIsMember(true);
      toast.success('Successfully joined deal room!');
      if (onDealUpdate) onDealUpdate();
    } catch (error) {
      console.error('Failed to join deal room:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to join deal room',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!deal || !token) {
      toast.error('Please login to start a conversation');
      return;
    }

    try {
      const title = prompt('Enter conversation title:');
      if (!title) return;

      setIsLoading(true);
      const result = await createConversation(deal.id, title);
      toast.success('Conversation created successfully!');

      // Select the newly created conversation
      if (result?.conversation?.id) {
        setSelectedConversationId(result.conversation.id);
        setActiveTab('chat'); // Switch to chat tab
      }

      loadAdditionalData(); // Refresh conversations list
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create conversation',
      );
    } finally {
      setIsLoading(false);
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
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSendMessageToFounder = () => {
    // Create a direct conversation with the founder
    if (!deal || !token) {
      toast.error('Please login to send a message');
      return;
    }

    const conversationTitle = `Direct message with ${deal.founderName}`;
    handleStartConversation();
  };

  const handleScheduleMeeting = () => {
    // This would open a meeting scheduling modal
    toast.info('Meeting scheduling feature coming soon!');
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
    <Modal
      isOpen={!!deal}
      onClose={onClose}
      size="huge"
      closeOnBackdropClick={true}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-6 py-4 -mx-6 -mt-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center text-3xl rounded-lg">
              {deal.logo || deal.companyName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {deal.companyName}
                </h2>
                <Badge
                  variant={
                    deal.status === 'Funded'
                      ? 'secondary'
                      : deal.status === 'Closing Soon'
                        ? 'destructive'
                        : 'default'
                  }
                >
                  {deal.status}
                </Badge>
              </div>
              <p className="text-gray-600">{deal.tagline}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {canJoin && !isMember && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleJoinDealRoom}
                disabled={isLoading}
              >
                Join Deal Room
              </Button>
            )}
            {isMember && (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700"
              >
                Member
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Funding Progress Card */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-600">Amount Raised</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(deal.currentRaise)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(deal.targetRaise)}
                  </p>
                </div>
              </div>
              <Progress
                value={progressPercent}
                className="h-3 mb-3 bg-gray-200"
              >
                <div
                  className="h-full bg-emerald-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </Progress>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-medium">
                  {progressPercent.toFixed(0)}% funded
                </span>
                <span className="text-gray-600">
                  {deal.investors} investors
                </span>
              </div>
            </div>

            {/* Tabs - UPDATED with Chat tab */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-5 bg-gray-100">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="conversations"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Conversations
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  value="meetings"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Meetings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    About {deal.companyName}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {deal.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Investment Highlights
                  </h3>
                  <ul className="space-y-2">
                    {deal.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Metrics */}
                {deal.metrics && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {deal.metrics.revenue !== undefined && (
                        <div className="bg-gray-50 p-3 text-center rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.metrics.revenue)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Annual Revenue
                          </p>
                        </div>
                      )}
                      {deal.metrics.growth !== undefined && (
                        <div className="bg-gray-50 p-3 text-center rounded-lg">
                          <p className="text-lg font-bold text-emerald-600">
                            +{deal.metrics.growth}%
                          </p>
                          <p className="text-xs text-gray-600">YoY Growth</p>
                        </div>
                      )}
                      {deal.metrics.users !== undefined && (
                        <div className="bg-gray-50 p-3 text-center rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {formatNumber(deal.metrics.users)}
                          </p>
                          <p className="text-xs text-gray-600">Active Users</p>
                        </div>
                      )}
                      {deal.metrics.mrr !== undefined && (
                        <div className="bg-gray-50 p-3 text-center rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.metrics.mrr)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Monthly Revenue
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading documents...</p>
                  </div>
                ) : deal.documents && deal.documents.length > 0 ? (
                  <div className="space-y-3">
                    {deal.documents.map(
                      (doc, index) =>
                        doc.files &&
                        doc.files.map((file, fileIndex) => (
                          <div
                            key={`${index}-${fileIndex}`}
                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center rounded-lg">
                                <FileText className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {file.filename} • {file.human_size}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-white hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No documents available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="conversations" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">
                      Loading conversations...
                    </p>
                  </div>
                ) : (
                  <>
                    {conversations.length > 0 ? (
                      <div className="space-y-3">
                        {conversations.map((conv, index) => (
                          <div
                            key={conv.id}
                            className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg"
                            onClick={() => handleSelectConversation(conv.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {conv.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {conv.message_count} messages •{' '}
                                  {conv.private ? 'Private' : 'Public'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {conv.last_message && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      conv.last_message.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No conversations yet</p>
                      </div>
                    )}

                    {(isMember || token) && (
                      <div className="mt-4">
                        <Button
                          className="w-full"
                          onClick={handleStartConversation}
                          disabled={isLoading}
                        >
                          Start New Conversation
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* NEW CHAT TAB */}
              <TabsContent value="chat" className="mt-4">
                {dealRoomId && (isMember || token) ? (
                  <div className="border rounded-lg overflow-hidden">
                    <DealRoomChat
                      dealRoomId={dealRoomId}
                      initialConversationId={
                        selectedConversationId || undefined
                      }
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="mb-4">
                      {!token
                        ? 'Please sign in to access the chat'
                        : 'Join the deal room to access conversations'}
                    </p>
                    {!token ? (
                      <Button
                        onClick={() => {
                          // This would redirect to login
                          toast.info('Please sign in first');
                        }}
                      >
                        Sign In
                      </Button>
                    ) : (
                      <Button onClick={handleJoinDealRoom}>
                        Join Deal Room
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="meetings" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading meetings...</p>
                  </div>
                ) : meetings.length > 0 ? (
                  <div className="space-y-3">
                    {meetings.map((meeting, index) => (
                      <div
                        key={meeting.id}
                        className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {meeting.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {meeting.meeting_type} • {meeting.status}
                            </p>
                          </div>
                          <Badge
                            variant={meeting.upcoming ? 'default' : 'secondary'}
                          >
                            {meeting.upcoming ? 'Upcoming' : 'Past'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{new Date(meeting.start_time).toLocaleString()}</p>
                          <p>Duration: {meeting.duration_minutes} minutes</p>
                          <p>Organizer: {meeting.organizer?.name}</p>
                          {meeting.meeting_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() =>
                                window.open(meeting.meeting_link, '_blank')
                              }
                            >
                              Join Meeting
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No scheduled meetings</p>
                    {(isMember || token) && (
                      <Button className="mt-4" onClick={handleScheduleMeeting}>
                        Schedule a Meeting
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deal Terms */}
            <div className="bg-gray-50 p-5 space-y-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">Deal Terms</h3>
              <Separator className="bg-gray-300" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium text-gray-900">
                    {deal.stage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuation</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(deal.valuation)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Investment</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(deal.minInvestment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium text-gray-900">
                    {deal.industry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Left</span>
                  <span className="font-medium text-gray-900">
                    {deal.daysLeft > 0 ? deal.daysLeft : 'Closed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investors</span>
                  <span className="font-medium text-gray-900">
                    {deal.investors}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interested</span>
                  <span className="font-medium text-gray-900">
                    {deal.interested}
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Info */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">
                Meet the Founder
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-600 rounded-lg">
                  {deal.founderImage ||
                    deal.founderName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {deal.founderName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {deal.founderTitle || 'Founder'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                  onClick={handleSendMessageToFounder}
                  disabled={!token || isLoading}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                  onClick={handleScheduleMeeting}
                  disabled={!token || isLoading}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>

            {/* Deal Room Info */}
            {dealRoomMemberCount > 0 && (
              <div className="bg-emerald-50 p-5 border border-emerald-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Deal Room</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">
                      {dealRoomMemberCount} members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">
                      {conversations.length} conversations
                    </span>
                  </div>
                  {!isMember && token && (
                    <div className="mt-3">
                      <Button
                        className="w-full"
                        onClick={handleJoinDealRoom}
                        disabled={isLoading}
                      >
                        Join Deal Room
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auth Required Warning */}
            {!token && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">
                    Sign in required
                  </h4>
                </div>
                <p className="text-sm text-amber-800">
                  Please sign in to show interest, join deal rooms, or contact
                  founders.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
                disabled={
                  deal.status === 'Funded' ||
                  !token ||
                  isLoading ||
                  isInterested
                }
                onClick={handleShowInterest}
              >
                {isInterested ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Interest Shown
                  </>
                ) : deal.status === 'Funded' ? (
                  'Fully Funded'
                ) : (
                  'Show Interest'
                )}
              </Button>

              <Button
                className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                onClick={handleShareDeal}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
