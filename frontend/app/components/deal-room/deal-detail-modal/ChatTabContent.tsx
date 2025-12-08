import { AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { DealRoomChat } from '../DealRoomChat';

interface ChatTabProps {
  dealRoomId: string | number;
  isMember: boolean;
  token: string | null;
  selectedConversationId?: string | null;
  onJoinDealRoom: () => void;
  onShowAlertMessage: (
    title: string,
    message: string,
    type?: 'success' | 'error' | 'info',
  ) => void;
}

export function ChatTab({
  dealRoomId,
  isMember,
  token,
  selectedConversationId,
  onJoinDealRoom,
  onShowAlertMessage,
}: ChatTabProps) {
  if (dealRoomId && (isMember || token)) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <DealRoomChat
          dealRoomId={String(dealRoomId)}
          initialConversationId={selectedConversationId || undefined}
        />
      </div>
    );
  }

  return (
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
            onShowAlertMessage('Info', 'Please sign in first', 'info');
          }}
        >
          Sign In
        </Button>
      ) : (
        <Button onClick={onJoinDealRoom}>Join Deal Room</Button>
      )}
    </div>
  );
}
