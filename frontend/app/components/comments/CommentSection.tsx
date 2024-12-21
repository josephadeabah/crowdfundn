import React, { useState, useEffect } from 'react';
import { useCampaignCommentsContext } from '@/app/context/account/comments/CommentsContext';
import Avatar from '../avatar/Avatar';
import ToastComponent from '../toast/Toast';
import moment from 'moment';
import CommentLoader from '@/app/loaders/CommentLoader';

interface CommentsSectionProps {
  campaignId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ campaignId }) => {
  const { comments, fetchComments, createComment, loading, error } =
    useCampaignCommentsContext();
  const [comment, setComment] = useState<string>('');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  // Show toast function
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

  // Fetch comments when the component is mounted
  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchComments(campaignId);
      } catch (err) {
        showToast('Error', 'Failed to load comments.', 'error');
      }
    };
    fetch();
  }, [campaignId, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return; // Don't submit empty comments

    try {
      await createComment(campaignId, comment); // Submit the comment
      setComment(''); // Clear the input after submitting
      await fetchComments(campaignId); // Fetch the updated comments
      showToast('Success', 'Comment added successfully!', 'success');
    } catch (err) {
      showToast(
        'Error',
        'You must have made a successful donation to comment.',
        'error',
      );
    }
  };

  const toggleCommentsVisibility = () =>
    setAreCommentsVisible(!areCommentsVisible);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        <button onClick={toggleCommentsVisibility} className="text-orange-500">
          {areCommentsVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      {areCommentsVisible && (
        <div className="max-h-96 overflow-y-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
          {loading ? (
            Array.from({ length: comments.length }).map((_, index) => (
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
                  {/* Full Name Section */}
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
                  {/* Comment Content */}
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
      )}

      <form onSubmit={handleCommentSubmit} className="mt-4">
        <textarea
          className="w-full border rounded-md p-2"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 bg-gray-500 text-white rounded-full p-2"
          disabled={loading} // Disable the button when loading
        >
          {loading ? 'Loading...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
