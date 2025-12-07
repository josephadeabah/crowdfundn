import React, { useState, useEffect } from 'react'
import { Search, MessageSquare, Users, Lock, Plus, Calendar, FileText } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/app/context/auth/AuthContext'

interface Conversation {
  id: string
  title: string
  private: boolean
  created_at: string
  updated_at: string
  message_count: number
  unread_count: number
  last_message?: {
    content: string
    created_at: string
    user: {
      full_name: string
    }
  }
  user: {
    id: string
    full_name: string
  }
}

interface ConversationsListProps {
  dealRoomId: string
  onSelectConversation: (conversation: Conversation) => void
  onCreateConversation: () => void
}

export function ConversationsList({
  dealRoomId,
  onSelectConversation,
  onCreateConversation
}: ConversationsListProps) {
  const { token } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [dealRoomId, token])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_rooms/${dealRoomId}/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Conversations</h3>
          <Button
            size="sm"
            onClick={onCreateConversation}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No conversations yet</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={onCreateConversation}
            >
              Start a conversation
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {conversation.title}
                      </span>
                      {conversation.private && (
                        <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    {conversation.last_message ? (
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">
                          {conversation.last_message.user.full_name}:
                        </span>{' '}
                        {conversation.last_message.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No messages yet
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(conversation.updated_at)}
                    </span>
                    {conversation.unread_count > 0 && (
                      <Badge className="bg-emerald-600 text-white">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{conversation.message_count}</span>
                  </div>
                  {conversation.private && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Private</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
            onClick={onCreateConversation}
          >
            <MessageSquare className="w-4 h-4 mb-1" />
            <span className="text-xs">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
          >
            <Calendar className="w-4 h-4 mb-1" />
            <span className="text-xs">Schedule</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col h-auto py-2"
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-xs">Documents</span>
          </Button>
        </div>
      </div>
    </div>
  )
}