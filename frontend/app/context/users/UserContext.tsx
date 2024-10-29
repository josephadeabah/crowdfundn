'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { UserProfile, UserProfileState } from '@/app/types/user_profiles.types';
import { Role } from '@/app/types/user.types';
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling

const UserContext = createContext<UserProfileState | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to store roles in cookies
  const storeRolesInCookies = (roles: Role[]) => {
    const roleNames = roles.map((role) => role.name);
    Cookies.set('roles', JSON.stringify(roleNames), { expires: 30 }); // Expires in 30 days
  };

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data: UserProfile = await response.json();
      setUserProfile(data);

      // Store roles in cookies after fetching user data
      storeRolesInCookies(data.roles);
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

  const hasRole = (role: string) => {
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')!) : [];
    return roles.includes(role);
  };

  const contextValue = React.useMemo(
    () => ({ userProfile, loading, error, fetchUserProfile, hasRole }),
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
