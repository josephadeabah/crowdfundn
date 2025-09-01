import React, { useState, useEffect, useCallback } from 'react';
import { useCampaignCommentsContext } from '@/app/context/account/comments/CommentsContext';
import Avatar from '../avatar/Avatar';
import ToastComponent from '../toast/Toast';
import moment from 'moment';
import CommentLoader from '@/app/loaders/CommentLoader';
import { useAuth } from '@/app/context/auth/AuthContext';

interface CommentsSectionProps {
  campaignId: string;
  campaignType?: 'Campaign' | 'EquityCampaign'; // Add campaign type prop
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  campaignId,
  campaignType = 'Campaign',
}) => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [comment, setComment] = useState<string>('');
  const { user } = useAuth(); // Get user from auth context

  const {
    comments,
    fetchComments: fetchCommentsFromContext,
    createComment,
    loading,
    error,
  } = useCampaignCommentsContext();

  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const fetchComments = useCallback(
    async (campaignId: string) => {
      setFetchLoading(true);
      try {
        await fetchCommentsFromContext(campaignId);
      } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to load comments.', 'error');
      } finally {
        setFetchLoading(false);
      }
    },
    [fetchCommentsFromContext],
  );

  useEffect(() => {
    fetchComments(campaignId);
  }, [campaignId, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitLoading(true);
    try {
      await createComment(campaignId, comment);
      setComment('');
      await fetchComments(campaignId);
      showToast('Success', 'Comment added successfully!', 'success');
    } catch (err) {
      // Updated error message to be more generic
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add comment';

      if (
        errorMessage.includes('successful donation') ||
        errorMessage.includes('successful investment')
      ) {
        showToast(
          'Comment Restricted',
          `You must have made a successful ${campaignType === 'EquityCampaign' ? 'investment' : 'donation'} to comment.`,
          'error',
        );
      } else {
        showToast('Error', errorMessage, 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Comments</h2>
      </div>

      <div className="h-full">
        {fetchLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <CommentLoader key={index} />
          ))
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-800 rounded-sm shadow p-4 mb-4 flex items-start"
            >
              <div className="flex-shrink-0">
                <Avatar
                  name={String(comment?.full_name) || 'Anonymous'}
                  size="sm"
                />
              </div>
              <div className="ml-3 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-800 dark:text-gray-100 font-semibold text-sm">
                    {comment?.full_name || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {moment(comment.created_at).format(
                      'MMM DD, YYYY, hh:mm:ss A',
                    )}
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="mt-6">
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          required
          disabled={submitLoading}
        />
        <button
          type="submit"
          className="mt-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors"
          disabled={submitLoading || fetchLoading || !comment.trim()}
        >
          {submitLoading ? 'Posting...' : 'Post Comment'}
        </button>

        {!user && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: Anonymous comments require a donation and will be associated
            with your donation token.
          </p>
        )}
      </form>
    </div>
  );
};

export default CommentsSection;
