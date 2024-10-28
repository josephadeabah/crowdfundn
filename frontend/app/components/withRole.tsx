import React, { useEffect } from 'react';
import { useUserContext } from '@/app/context/users/UserContext';
import FullscreenLoader from '../loaders/FullscreenLoader';
import { useRouter } from 'next/navigation';

type AccessOptions = {
  requiredRoles?: string[]; // List of roles the user must have
  requireAdmin?: boolean; // If true, the user must be an admin
};

// Utility function to get stored roles safely
const getStoredRoles = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('userRoles');
    return JSON.parse(stored || '[]');
  }
  return [];
};

const withRole = (Component: React.ComponentType, options: AccessOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { userProfile, loading } = useUserContext();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // Role checks
        if (options.requireAdmin && !userProfile?.admin) {
          router.push('/'); // Immediate redirect
          return;
        }

        if (options.requiredRoles && options.requiredRoles.length > 0) {
          const storedRoles = getStoredRoles();
          const hasRequiredRole = storedRoles.some((storedRole: string) =>
            options?.requiredRoles?.includes(storedRole),
          );

          // If the user does not have any of the required roles, redirect
          if (!hasRequiredRole) {
            router.push('/'); // Immediate redirect
          }
        }
      }
    }, [userProfile, loading, options, router]);

    // Show a loading state while fetching user data
    if (loading) {
      return <FullscreenLoader />;
    }

    // Render the component if there is no redirection
    return <Component {...props} />;
  };
};

export default withRole;
