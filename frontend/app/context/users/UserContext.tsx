import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { UserProfile, UserProfileState } from '@/app/types/user_profiles.types';

const UserContext = createContext<UserProfileState | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/v1/members/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data: UserProfile = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch user data when token changes (e.g., after login)
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const contextValue = React.useMemo(
    () => ({ userProfile, loading, error, fetchUserProfile }),
    [userProfile, loading, error],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProfileProvider');
  }
  return context;
};
