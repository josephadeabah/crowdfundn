import { MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ConversationsTabProps {
  isLoading: boolean;
  conversations: any[];
  isMember: boolean;
  token: string | null;
  onStartConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationsTab({
  isLoading,
  conversations,
  isMember,
  token,
  onStartConversation,
  onSelectConversation,
}: ConversationsTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading conversations...</p>
      </div>
    );
  }

  return (
    <>
      {conversations.length > 0 ? (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-lg"
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{conv.title}</p>
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
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-100"
            variant="outline"
            onClick={onStartConversation}
            disabled={isLoading}
          >
            Start New Conversation
          </Button>
        </div>
      )}
    </>
  );
}
