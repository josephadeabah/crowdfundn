// app/components/deal-room/deal-detail-modal/TabsSection.tsx
'use client';

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
      {/* Responsive TabsList with horizontal scroll on mobile */}
      <div className="relative">
        <TabsList className="w-full bg-gray-100 flex lg:grid lg:grid-cols-5 overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap px-4 py-2 lg:px-0 lg:py-2 flex-shrink-0 lg:flex-shrink"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap px-4 py-2 lg:px-0 lg:py-2 flex-shrink-0 lg:flex-shrink"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="conversations"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap px-4 py-2 lg:px-0 lg:py-2 flex-shrink-0 lg:flex-shrink"
          >
            Conversations
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap px-4 py-2 lg:px-0 lg:py-2 flex-shrink-0 lg:flex-shrink"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="meetings"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white whitespace-nowrap px-4 py-2 lg:px-0 lg:py-2 flex-shrink-0 lg:flex-shrink"
          >
            Meetings
          </TabsTrigger>
        </TabsList>

        {/* Gradient fade effect on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none lg:hidden" />
      </div>

      <TabsContent value="overview" className="mt-4 space-y-6">
        <OverviewTab deal={deal} />
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <DocumentsTab isLoading={isLoading} documents={deal.documents} />
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
       <MeetingsTab dealRoomId={deal.campaign?.deal_room?.id?.toString() || dealRoomId.toString()} />
      </TabsContent>
    </Tabs>
  );
}
