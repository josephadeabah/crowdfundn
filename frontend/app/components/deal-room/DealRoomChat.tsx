import React, { useState } from 'react'
import { ConversationsList } from './ConversationsList'
import { ConversationChat } from './ConversationChat'
import { CreateConversationModal } from './CreateConversationModal'
import { Button } from '../ui/button'
import { MessageSquare } from 'lucide-react'

interface Conversation {
  id: string
  title: string
  private: boolean
  created_at: string
  updated_at: string
  message_count: number
  unread_count: number
  user: {
    id: string
    full_name: string
  }
}

interface DealRoomChatProps {
  dealRoomId: string
  initialConversationId?: string
}

export function DealRoomChat({
  dealRoomId,
  initialConversationId
}: DealRoomChatProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsMobileView(true)
  }

  // Handle new conversation creation
  const handleConversationCreated = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setIsCreateModalOpen(false)
    setIsMobileView(true)
  }

  // Handle back to list on mobile
  const handleBackToList = () => {
    setIsMobileView(false)
  }

  return (
    <div className="h-[600px] flex bg-white border rounded-lg overflow-hidden">
      {/* Desktop: Sidebar + Chat */}
      <div className="hidden md:flex flex-1">
        {/* Conversations List */}
        <div className="w-80 border-r">
          <ConversationsList
            dealRoomId={dealRoomId}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedConversation ? (
            <ConversationChat
              dealRoomId={dealRoomId}
              conversationId={selectedConversation.id}
              conversationTitle={selectedConversation.title}
              onClose={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Conversation
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a conversation from the list or start a new one
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Start New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-1">
        {!isMobileView || !selectedConversation ? (
          <ConversationsList
            dealRoomId={dealRoomId}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <ConversationChat
            dealRoomId={dealRoomId}
            conversationId={selectedConversation.id}
            conversationTitle={selectedConversation.title}
            onClose={handleBackToList}
          />
        )}
      </div>

      {/* Create Conversation Modal */}
      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        dealRoomId={dealRoomId}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  )
}