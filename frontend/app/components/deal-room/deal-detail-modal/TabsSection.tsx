import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Deal } from '../services/dealRoomApi';
import { OverviewTab } from './OverviewTab';
import { DocumentsTab } from './DocumentsTab';
import { ConversationsTab } from './ConversationsTab';
import { ChatTab } from './ChatTabContent';
import { MeetingsTab } from './MeetingsTab';

interface TabsSectionProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  deal: Deal;
  dealRoomId: string | number;
  isMember: boolean;
  token: string | null;
  isLoading: boolean;
  documents: any[];
  conversations: any[];
  meetings: any[];
  selectedConversationId: string | null;
  onStartConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  onJoinDealRoom: () => void;
  onScheduleMeeting: () => void;
  onShowAlertMessage: (
    title: string,
    message: string,
    type?: 'success' | 'error' | 'info',
  ) => void;
}

export function TabsSection({
  activeTab,
  onTabChange,
  deal,
  dealRoomId,
  isMember,
  token,
  isLoading,
  documents,
  conversations,
  meetings,
  selectedConversationId,
  onStartConversation,
  onSelectConversation,
  onJoinDealRoom,
  onScheduleMeeting,
  onShowAlertMessage,
}: TabsSectionProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
        <OverviewTab deal={deal} />
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <DocumentsTab
          isLoading={isLoading}
          documents={documents || deal.documents}
        />
      </TabsContent>

      <TabsContent value="conversations" className="mt-4">
        <ConversationsTab
          isLoading={isLoading}
          conversations={conversations}
          isMember={isMember}
          token={token}
          onStartConversation={onStartConversation}
          onSelectConversation={onSelectConversation}
        />
      </TabsContent>

      <TabsContent value="chat" className="mt-4">
        <ChatTab
          dealRoomId={dealRoomId}
          isMember={isMember}
          token={token}
          selectedConversationId={selectedConversationId}
          onJoinDealRoom={onJoinDealRoom}
          onShowAlertMessage={onShowAlertMessage}
        />
      </TabsContent>

      <TabsContent value="meetings" className="mt-4">
        <MeetingsTab
          isLoading={isLoading}
          meetings={meetings}
          isMember={isMember}
          token={token}
          onScheduleMeeting={onScheduleMeeting}
        />
      </TabsContent>
    </Tabs>
  );
}
