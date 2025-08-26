import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';

interface UpdateDataType {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

interface UpdatesState {
  updates: UpdateDataType[];
  loading: boolean;
  error: string | null;
  fetchUpdates: (campaignId: string) => Promise<void>;
  createUpdate: (campaignId: string, content: string) => Promise<void>;
  updateUpdate: (
    campaignId: string,
    updateId: string,
    content: string,
  ) => Promise<void>;
  deleteUpdate: (campaignId: string, updateId: string) => Promise<void>;
}

const CampaignUpdatesContext = createContext<UpdatesState | undefined>(
  undefined,
);

export const CampaignUpdatesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [updates, setUpdates] = useState<UpdateDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleApiError = (errorText: string) => {
    setError(`API Error: ${errorText}`);
  };

  const fetchUpdates = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/updates`,
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

        const fetchedUpdates = await response.json();
        setUpdates(fetchedUpdates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching updates');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const createUpdate = useCallback(
    async (campaignId: string, content: string): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/updates`,
          {
            method: 'POST',
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

        const newUpdate = await response.json();
        setUpdates((prevUpdates) => [...prevUpdates, newUpdate]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating update');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateUpdate = useCallback(
    async (
      campaignId: string,
      updateId: string,
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
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/updates/${updateId}`,
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

        const updatedUpdate = await response.json();
        setUpdates((prevUpdates) =>
          prevUpdates.map((update) =>
            update.id === Number(updateId) ? updatedUpdate : update,
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error updating update');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deleteUpdate = useCallback(
    async (campaignId: string, updateId: string): Promise<void> => {
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/updates/${updateId}/`,
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

        setUpdates((prevUpdates) =>
          prevUpdates.filter((update) => update.id !== Number(updateId)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting update');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue = useMemo(
    () => ({
      updates,
      loading,
      error,
      fetchUpdates,
      createUpdate,
      updateUpdate,
      deleteUpdate,
    }),
    [
      updates,
      loading,
      error,
      fetchUpdates,
      createUpdate,
      updateUpdate,
      deleteUpdate,
    ],
  );

  return (
    <CampaignUpdatesContext.Provider value={contextValue}>
      {children}
    </CampaignUpdatesContext.Provider>
  );
};

export const useCampaignUpdatesContext = () => {
  const context = useContext(CampaignUpdatesContext);
  if (!context) {
    throw new Error(
      'useCampaignUpdatesContext must be used within a CampaignUpdatesProvider',
    );
  }
  return context;
};
