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
import Cookies from 'js-cookie';

const UserContext = createContext<UserProfileState | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth();
  const [userAccountData, setUserAccountData] = useState<UserProfile | null>(
    null,
  );
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const storeRolesInCookies = useCallback((roles: Role[]) => {
    const roleNames = roles.map((role) => role.name);
    Cookies.set('roles', JSON.stringify(roleNames), { expires: 30 });
  }, []);

  // Updated fetchAllUsers to support search
  const fetchAllUsers = useCallback(
    async (page = 1, perPage = 10, search = '') => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          per_page: perPage.toString(),
        });

        // Add search parameter if provided
        if (search) {
          queryParams.append('search', search);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users?${queryParams}`,
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
          users: data.users,
          meta: data.meta,
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

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
      storeRolesInCookies(data.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token, storeRolesInCookies]);

  const updateProfileData = useCallback(
    async (updatedProfile: Partial<Profile> | FormData) => {
      setLoading(true);
      setError(null);

      try {
        const isFormData = updatedProfile instanceof FormData;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/profiles/${user?.id}`,
          {
            method: 'PUT',
            headers: isFormData
              ? { Authorization: `Bearer ${token}` }
              : {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
            body: isFormData
              ? updatedProfile
              : JSON.stringify({ profile: updatedProfile }),
          },
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || 'Failed to update profile');
        }

        const data = await response.json();
        setProfileData(data.profile);
        return data.profile;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Profile update error:', err);
      } finally {
        setLoading(false);
      }
    },
    [token, user],
  );

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
              user: updatedProfile,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedData: UserProfile = await response.json();
        setUserAccountData(updatedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

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
