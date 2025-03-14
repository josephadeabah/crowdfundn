import React, { useState, useEffect, useCallback } from 'react';
import { useCampaignCommentsContext } from '@/app/context/account/comments/CommentsContext';
import Avatar from '../avatar/Avatar';
import ToastComponent from '../toast/Toast';
import moment from 'moment';
import CommentLoader from '@/app/loaders/CommentLoader';

interface CommentsSectionProps {
  campaignId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ campaignId }) => {
  const [fetchLoading, setFetchLoading] = useState(false); // for fetch comments loading
  const [submitLoading, setSubmitLoading] = useState(false); // for submit comment loading
  const [comment, setComment] = useState<string>(''); // Comment text

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
      await createComment(campaignId, comment); // Just send comment for the logged-in user
      setComment('');
      await fetchComments(campaignId);
      showToast('Success', 'Comment added successfully!', 'success');
    } catch (err) {
      showToast(
        'Error',
        'You must be a registered backer to comment.',
        'error',
      );
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
          <div>No comments yet.</div>
        )}
      </div>

      <form onSubmit={handleCommentSubmit} className="mt-4">
        {/* Removed email input, as it's no longer required */}
        <textarea
          className="w-full border rounded-md p-2"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 bg-green-500 hover:bg-green-700 dark:bg-green-600 text-white text-sm rounded-full p-2"
          disabled={submitLoading || fetchLoading}
        >
          {submitLoading ? 'Loading...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
