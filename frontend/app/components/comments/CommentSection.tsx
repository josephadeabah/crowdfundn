import React, { useState, useEffect } from 'react';
import { useCampaignCommentsContext } from '@/app/context/account/comments/CommentsContext';

interface CommentsSectionProps {
  campaignId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ campaignId }) => {
  const { comments, fetchComments, createComment, loading, error } =
    useCampaignCommentsContext();
  const [comment, setComment] = useState<string>('');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);

  // Fetch comments when the component is mounted
  useEffect(() => {
    fetchComments(campaignId);
  }, [campaignId, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return; // Don't submit empty comments

    try {
      await createComment(campaignId, comment); // Submit the comment
      setComment(''); // Clear the input after submitting
      fetchComments(campaignId); // Fetch the updated comments
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const toggleCommentsVisibility = () =>
    setAreCommentsVisible(!areCommentsVisible);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        <button onClick={toggleCommentsVisibility} className="text-red-500">
          {areCommentsVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      {areCommentsVisible && (
        <div className="max-h-96 overflow-y-auto">
          {loading && <div>Loading comments...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <p className="font-semibold">
                  {comment.full_name || 'Anonymous'}
                </p>
                <p className="text-gray-600">{comment.content}</p>
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
          className="mt-2 bg-gray-500 text-white rounded-md px-4 py-2"
          disabled={loading} // Disable the button when loading
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
