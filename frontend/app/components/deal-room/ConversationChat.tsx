import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Paperclip, Smile, MoreVertical, Edit2, Trash2, Check, X, MessageSquare } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/app/context/auth/AuthContext'
import { toast } from 'sonner'
import { useDealRoomChannel } from './hooks/useDealRoomChannel'

interface Message {
  id: string
  content: string
  message_type: 'text' | 'file' | 'system'
  created_at: string
  user?: {
    id: string
    full_name: string
    avatar?: string
    is_current_user: boolean
  }
  attachment?: {
    url: string
    filename: string
    content_type: string
    size: number
  }
  can_edit: boolean
  can_delete: boolean
  read_by: number
}

interface ConversationChatProps {
  dealRoomId: string
  conversationId: string
  conversationTitle: string
  onClose: () => void
}

export function ConversationChat({
  dealRoomId,
  conversationId,
  conversationTitle,
  onClose
}: ConversationChatProps) {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [usersOnline, setUsersOnline] = useState<Set<string>>(new Set())
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Use the WebSocket hook
  const { 
    isConnected, 
    sendMessage: sendWebSocketMessage,
    startTyping,
    updateMessage: updateWebSocketMessage,
    deleteMessage: deleteWebSocketMessage 
  } = useDealRoomChannel(dealRoomId, {
    onMessage: (data) => {
      if (data.message?.deal_room_conversation_id === conversationId) {
        setMessages(prev => [...prev, data.message])
      }
    },
    onUserTyping: (data) => {
      if (data.conversation_id === conversationId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.add(data.user_name)
          return newSet
        })
        
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(data.user_name)
            return newSet
          })
        }, 3000)
      }
    },
    onMessageUpdated: (data) => {
      if (data.conversation_id === conversationId) {
        setMessages(prev => prev.map(msg => 
          msg.id === data.message.id ? data.message : msg
        ))
      }
    },
    onMessageDeleted: (data) => {
      if (data.conversation_id === conversationId) {
        setMessages(prev => prev.filter(msg => msg.id !== data.message_id))
      }
    },
    onUserStatus: (data) => {
      if (data.status === 'online') {
        setUsersOnline(prev => new Set(prev.add(data.user_id)))
      } else {
        setUsersOnline(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.user_id)
          return newSet
        })
      }
    }
  })

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_room_conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        throw new Error('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, token])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (isConnected) {
      startTyping(conversationId)
    }

    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 1000)
  }, [isConnected, conversationId, startTyping])

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !token || isSending) return

    try {
      setIsSending(true)
      
      if (isConnected) {
        // Use WebSocket if available
        const success = sendWebSocketMessage(conversationId, newMessage.trim())
        
        if (success) {
          setNewMessage('')
        } else {
          // Fallback to HTTP
          await sendMessageViaHTTP()
        }
      } else {
        // Fallback to HTTP
        await sendMessageViaHTTP()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  // HTTP fallback for sending messages
  const sendMessageViaHTTP = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_room_conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: newMessage.trim(),
        message_type: 'text'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      setMessages(prev => [...prev, data.message_data])
      setNewMessage('')
    } else {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0] || 'Failed to send message')
    }
  }

  // Update message
  const updateMessage = async (messageId: string) => {
    if (!editContent.trim() || !token) return

    try {
      if (isConnected) {
        updateWebSocketMessage(messageId, editContent.trim())
      } else {
        // Fallback to HTTP
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_room_conversations/${conversationId}/messages/${messageId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: editContent.trim()
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? data.message_data : msg
          ))
        }
      }
      
      setEditingMessageId(null)
      setEditContent('')
    } catch (error) {
      console.error('Failed to update message:', error)
      toast.error('Failed to update message')
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!token || !confirm('Are you sure you want to delete this message?')) return

    try {
      if (isConnected) {
        deleteWebSocketMessage(messageId)
      } else {
        // Fallback to HTTP
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_room_conversations/${conversationId}/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message')
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    try {
      setIsSending(true)
      const formData = new FormData()
      formData.append('attachment', file)
      formData.append('message_type', 'file')
      formData.append('content', `Uploaded ${file.name}`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_room_conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message_data])
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsSending(false)
      if (e.target) e.target.value = ''
    }
  }

  // Format message time
  const formatMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fetch messages on mount
  useEffect(() => {
    if (conversationId && token) {
      fetchMessages()
    }
  }, [conversationId, token, fetchMessages])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            ←
          </Button>
          <div>
            <h3 className="font-semibold text-gray-900">{conversationTitle}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              {typingUsers.size > 0 && (
                <span className="text-emerald-600">
                  • {[...typingUsers].join(', ')} typing...
                </span>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={fetchMessages}>
              Refresh Messages
            </DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Leave Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-3" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.user?.is_current_user ? 'justify-end' : ''}`}
              >
                {/* Other user's message */}
                {!message.user?.is_current_user && (
                  <>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.user?.avatar} />
                      <AvatarFallback>
                        {getUserInitials(message.user?.full_name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {message.user?.full_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                      {editingMessageId === message.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => updateMessage(message.id)}
                            disabled={!editContent.trim()}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingMessageId(null)
                              setEditContent('')
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="bg-gray-100 rounded-lg rounded-tl-none px-4 py-2 max-w-[70%] inline-block">
                            {message.attachment ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Paperclip className="w-4 h-4" />
                                  <a
                                    href={message.attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:underline"
                                  >
                                    {message.attachment.filename}
                                  </a>
                                </div>
                                <p className="text-gray-700">{message.content}</p>
                              </div>
                            ) : (
                              <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          {(message.can_edit || message.can_delete) && (
                            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              {message.can_edit && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => {
                                    setEditingMessageId(message.id)
                                    setEditContent(message.content)
                                  }}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              )}
                              {message.can_delete && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Current user's message */}
                {message.user?.is_current_user && (
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-[70%]">
                      {editingMessageId === message.id ? (
                        <div className="flex gap-2 justify-end">
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => updateMessage(message.id)}
                            disabled={!editContent.trim()}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingMessageId(null)
                              setEditContent('')
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="bg-emerald-600 text-white rounded-lg rounded-tr-none px-4 py-2">
                            {message.attachment ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Paperclip className="w-4 h-4" />
                                  <a
                                    href={message.attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-100 hover:underline"
                                  >
                                    {message.attachment.filename}
                                  </a>
                                </div>
                                <p>{message.content}</p>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          <div className="text-right mt-1">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.created_at)}
                              {message.read_by > 0 && ' • Read'}
                            </span>
                          </div>
                          {(message.can_edit || message.can_delete) && (
                            <div className="absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 -translate-x-full">
                              {message.can_edit && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => {
                                    setEditingMessageId(message.id)
                                    setEditContent(message.content)
                                  }}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              )}
                              {message.can_delete && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </Button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-10"
              disabled={isSending}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}