import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

interface CommentDataType {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number | null; // Handle null for anonymous users
  full_name: string | null;
  email: string | null;
}

interface CommentsState {
  comments: CommentDataType[];
  loading: boolean;
  error: string | null;
  fetchComments: (campaignId: string) => Promise<void>;
  createComment: (
    campaignId: string,
    content: string,
    email?: string,
  ) => Promise<void>;
  updateComment: (
    campaignId: string,
    commentId: string,
    content: string,
  ) => Promise<void>;
  deleteComment: (campaignId: string, commentId: string) => Promise<void>;
}

const CampaignCommentsContext = createContext<CommentsState | undefined>(
  undefined,
);

export const CampaignCommentsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [comments, setComments] = useState<CommentDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`API Error: ${errorText}`);
  };

  // Fetch comments for a campaign
  const fetchComments = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/comments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        const fetchedComments = await response.json();
        setComments(fetchedComments);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching comments',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Create a new comment
  const createComment = useCallback(
    async (
      campaignId: string,
      content: string,
      email?: string, // Optional email parameter
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (user) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/comments`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ content, email }), // Include email if provided
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          throw new Error(errorText); // Throw an error to signal failure
        }

        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating comment');
        throw err; // Re-throw the error for the component to catch
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Update an existing comment
  const updateComment = useCallback(
    async (
      campaignId: string,
      commentId: string,
      content: string,
    ): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/comments/${commentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === Number(commentId) ? updatedComment : comment,
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating comment');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Delete a comment
  const deleteComment = useCallback(
    async (campaignId: string, commentId: string): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/comments/${commentId}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          handleApiError(errorText);
          return;
        }

        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== Number(commentId)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting comment');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      comments,
      loading,
      error,
      fetchComments,
      createComment,
      updateComment,
      deleteComment,
    }),
    [
      comments,
      loading,
      error,
      fetchComments,
      createComment,
      updateComment,
      deleteComment,
    ],
  );

  return (
    <CampaignCommentsContext.Provider value={contextValue}>
      {children}
    </CampaignCommentsContext.Provider>
  );
};

export const useCampaignCommentsContext = () => {
  const context = useContext(CampaignCommentsContext);
  if (!context) {
    throw new Error(
      'useCampaignCommentsContext must be used within a CampaignCommentsProvider',
    );
  }
  return context;
};
