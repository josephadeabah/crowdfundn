// CommentsSection.tsx
import React, { useState } from 'react';

interface Comment {
  id: number;
  user: string;
  content: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  const [comment, setComment] = useState<string>('');
  const [areCommentsVisible, setAreCommentsVisible] = useState<boolean>(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment('');
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
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <p className="font-semibold">{comment.user}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))
          ) : (
            <div>No comment yet.</div>
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
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
