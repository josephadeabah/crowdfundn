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

  // Add this inside the UserProfileProvider component
  const fetchAllUsers = async (page = 1, perPage = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users?page=${page}&per_page=${perPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return {
        users: data.users, // Array of users
        meta: data.meta, // Pagination details
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { users: [], meta: null };
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  // Function to assign a role to a user
  const assignRoleToUser = async (userId: string, roleName: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}/assign_role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role_name: roleName }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to assign role to user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Function to make a user Super Admin
  const makeUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}/make_admin`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ admin: isAdmin }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update user admin status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Function to block a user
  const blockUser = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}/block`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to block user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Function to activate a user
  const activateUser = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}/activate`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to activate user');
      }
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
    () => ({
      userProfile,
      loading,
      error,
      fetchUserProfile,
      hasRole,
      assignRoleToUser,
      makeUserAdmin,
      blockUser,
      activateUser,
      fetchAllUsers,
    }),
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
