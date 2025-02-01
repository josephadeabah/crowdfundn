'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Profile,
  UserProfile,
  UserProfileState,
} from '@/app/types/user_profiles.types';
import { Role } from '@/app/types/user.types';
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling

const UserContext = createContext<UserProfileState | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [userAccountData, setUserAccountData] = useState<UserProfile | null>(
    null,
  );
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to store roles in cookies
  const storeRolesInCookies = useCallback((roles: Role[]) => {
    const roleNames = roles.map((role) => role.name);
    Cookies.set('roles', JSON.stringify(roleNames), { expires: 30 }); // Expires in 30 days
  }, []);

  // Function to fetch all users
  const fetchAllUsers = useCallback(
    async (page = 1, perPage = 10) => {
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
          meta: data.meta, // Pagination metadata
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return { users: [], meta: null };
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Function to delete a user
  const deleteUser = useCallback(
    async (userId: number) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        // Optionally, you can trigger any necessary state updates or notifications
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Function to fetch user profile data
  const fetchUserProfile = useCallback(async () => {
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
      setUserAccountData(data);

      // Store roles in cookies after fetching user data
      storeRolesInCookies(data.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token, storeRolesInCookies]);

  // Function to update user profile
  const updateProfileData = useCallback(
    async (updatedProfile: Partial<Profile>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/profiles/${profileData?.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              profile: updatedProfile,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await response.json();
        setProfileData(data.profile); // Update the local state with the new profile

        return data.profile; // Return the updated profile
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token, profileData?.id],
  );

  // Function to update user profile
  const updateUserAccountData = useCallback(
    async (updatedProfile: Partial<UserProfile>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/me`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              profile: updatedProfile,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedData: UserProfile = await response.json();
        setUserAccountData(updatedData); // Update local state with new profile data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Function to assign a role to a user
  const assignRoleToUser = useCallback(
    async (userId: number, roleName: string) => {
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
    },
    [token],
  );

  // Function to remove a role from a user
  const removeRoleFromUser = useCallback(
    async (userId: number, roleName: string) => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users/${userId}/remove_role`,
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
          throw new Error('Failed to remove role from user');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Function to make a user Super Admin
  const makeUserAdmin = useCallback(
    async (userId: number, isAdmin: boolean) => {
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
    },
    [token],
  );

  // Function to block a user
  const blockUser = useCallback(
    async (userId: number) => {
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
    },
    [token],
  );

  // Function to activate a user
  const activateUser = useCallback(
    async (userId: number) => {
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
    },
    [token],
  );

  // Automatically fetch user data when token changes (e.g., after login)
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  const hasRole = useCallback((role: string) => {
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')!) : [];
    return roles.includes(role);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      userAccountData,
      profileData,
      loading,
      error,
      fetchUserProfile,
      updateProfileData,
      updateUserAccountData,
      hasRole,
      assignRoleToUser,
      removeRoleFromUser,
      makeUserAdmin,
      blockUser,
      activateUser,
      fetchAllUsers,
      deleteUser,
    }),
    [
      userAccountData,
      profileData,
      loading,
      error,
      token,
      hasRole,
      assignRoleToUser,
      removeRoleFromUser,
      makeUserAdmin,
      blockUser,
      activateUser,
      fetchAllUsers,
      updateProfileData,
      updateUserAccountData,
      deleteUser,
    ],
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
