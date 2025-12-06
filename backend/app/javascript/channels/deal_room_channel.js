// app/javascript/channels/deal_room_channel.js
import consumer from "./consumer"

consumer.subscriptions.create("DealRoomChannel", {
  connected() {
    console.log("Connected to DealRoomChannel")
  },

  disconnected() {
    console.log("Disconnected from DealRoomChannel")
  },

  received(data) {
    console.log("Received:", data)
    
    switch(data.type) {
      case 'new_message':
        this.handleNewMessage(data.message)
        break
      case 'user_typing':
        this.handleUserTyping(data)
        break
      case 'user_status':
        this.handleUserStatus(data)
        break
      case 'document_updated':
        this.handleDocumentUpdate(data)
        break
      case 'meeting_update':
        this.handleMeetingUpdate(data)
        break
    }
  },

  handleNewMessage(message) {
    // Dispatch event or update UI
    const event = new CustomEvent('new-deal-room-message', { detail: message })
    window.dispatchEvent(event)
  },

  handleUserTyping(data) {
    const event = new CustomEvent('user-typing-deal-room', { 
      detail: {
        userId: data.user_id,
        userName: data.user_name,
        conversationId: data.conversation_id
      }
    })
    window.dispatchEvent(event)
  },

  handleUserStatus(data) {
    const event = new CustomEvent('user-status-change', {
      detail: {
        userId: data.user_id,
        userName: data.user_name,
        status: data.status
      }
    })
    window.dispatchEvent(event)
  },

  handleDocumentUpdate(data) {
    const event = new CustomEvent('deal-room-document-updated', {
      detail: {
        documentId: data.document_id,
        updates: data.updates
      }
    })
    window.dispatchEvent(event)
  },

  handleMeetingUpdate(data) {
    const event = new CustomEvent('deal-room-meeting-updated', {
      detail: {
        meetingId: data.meeting_id,
        action: data.action,
        userId: data.user_id
      }
    })
    window.dispatchEvent(event)
  }
})