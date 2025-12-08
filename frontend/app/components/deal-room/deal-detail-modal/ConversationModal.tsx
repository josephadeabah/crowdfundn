import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  isCreating: boolean;
  onCreate: () => void;
}

export function ConversationModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  isCreating,
  onCreate,
}: ConversationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      closeOnBackdropClick={true}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Start New Conversation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter a title for your conversation
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Due Diligence Questions, Investment Details..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-6"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              onCreate();
            }
          }}
        />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={onCreate}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Conversation'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
