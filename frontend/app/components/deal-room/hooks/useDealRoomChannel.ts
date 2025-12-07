import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';

interface DealRoomChannelOptions {
  onMessage?: (message: any) => void;
  onUserTyping?: (data: any) => void;
  onUserStatus?: (data: any) => void;
  onMessageUpdated?: (data: any) => void;
  onMessageDeleted?: (data: any) => void;
  onConversationCreated?: (data: any) => void;
  onSystemMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export const useDealRoomChannel = (
  dealRoomId: string | null,
  options: DealRoomChannelOptions = {},
) => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const getWebSocketURL = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    // Use environment variable or fallback
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
      const railsPort = process.env.NEXT_PUBLIC_RAILS_PORT || '3000';
      return `${protocol}//${window.location.hostname}:${railsPort}/cable`;
    }

    const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
    return `${protocol}//${host}/cable`;
  }, []);

  const connect = useCallback(() => {
    if (!dealRoomId || !token) {
      console.warn('Cannot connect: missing dealRoomId or token');
      return;
    }

    // Close existing connection if any
    if (socket) {
      socket.close();
    }

    const wsUrl = `${getWebSocketURL()}?token=${encodeURIComponent(token)}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected to DealRoomChannel');
      setIsConnected(true);

      // Subscribe to deal room channel
      const subscriptionMsg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'DealRoomChannel',
          id: dealRoomId,
        }),
      };

      newSocket.send(JSON.stringify(subscriptionMsg));

      // Start ping interval
      pingIntervalRef.current = setInterval(() => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);

      options.onConnected?.();
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle subscription confirmation
        if (data.type === 'confirm_subscription') {
          console.log('Subscribed to DealRoomChannel');
          return;
        }

        // Handle pings
        if (data.type === 'ping' || data.type === 'welcome') {
          return;
        }

        // Handle actual messages - ActionCable format
        if (data.message) {
          switch (data.message.type) {
            case 'new_message':
              options.onMessage?.(data.message);
              break;
            case 'user_typing':
              options.onUserTyping?.(data.message);
              break;
            case 'user_status':
              options.onUserStatus?.(data.message);
              break;
            case 'message_updated':
              options.onMessageUpdated?.(data.message);
              break;
            case 'message_deleted':
              options.onMessageDeleted?.(data.message);
              break;
            case 'conversation_created':
              options.onConversationCreated?.(data.message);
              break;
            case 'system_message':
              options.onSystemMessage?.(data.message);
              break;
            case 'error':
              options.onError?.(data.message);
              break;
            default:
              console.log('Unhandled message type:', data.message.type);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      clearInterval(pingIntervalRef.current);
      options.onDisconnected?.();

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (dealRoomId && token) {
          console.log('Attempting to reconnect...');
          connect();
        }
      }, 5000);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      options.onError?.(error);
    };

    setSocket(newSocket);
  }, [dealRoomId, token, getWebSocketURL, options]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    clearInterval(pingIntervalRef.current);
    clearTimeout(reconnectTimeoutRef.current);
    setIsConnected(false);
  }, [socket]);

  const sendMessage = useCallback(
    (conversationId: string, content: string, messageType: string = 'text') => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        return false;
      }

      const message = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'DealRoomChannel',
          id: dealRoomId,
        }),
        data: JSON.stringify({
          action: 'send_message',
          conversation_id: conversationId,
          content: content,
          message_type: messageType,
        }),
      };

      socket.send(JSON.stringify(message));
      return true;
    },
    [socket, dealRoomId],
  );

  const startTyping = useCallback(
    (conversationId: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return false;

      const message = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'DealRoomChannel',
          id: dealRoomId,
        }),
        data: JSON.stringify({
          action: 'typing',
          conversation_id: conversationId,
        }),
      };

      socket.send(JSON.stringify(message));
      return true;
    },
    [socket, dealRoomId],
  );

  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return false;

      const message = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'DealRoomChannel',
          id: dealRoomId,
        }),
        data: JSON.stringify({
          action: 'update_message',
          message_id: messageId,
          content: content,
        }),
      };

      socket.send(JSON.stringify(message));
      return true;
    },
    [socket, dealRoomId],
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return false;

      const message = {
        command: 'message',
        identifier: JSON.stringify({
          channel: 'DealRoomChannel',
          id: dealRoomId,
        }),
        data: JSON.stringify({
          action: 'delete_message',
          message_id: messageId,
        }),
      };

      socket.send(JSON.stringify(message));
      return true;
    },
    [socket, dealRoomId],
  );

  // Connect on mount and when dependencies change
  useEffect(() => {
    if (dealRoomId && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [dealRoomId, token, connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    startTyping,
    updateMessage,
    deleteMessage,
    disconnect,
    reconnect: connect,
  };
};
