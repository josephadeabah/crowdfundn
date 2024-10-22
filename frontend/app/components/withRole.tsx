import { useAuth } from '@/app/context/auth/AuthContext';
import React from 'react';
import { useUserContext } from '@/app/context/users/UserContext';

type AccessOptions = {
  requiredRoles?: string[]; // List of roles the user must have
  requireAdmin?: boolean; // If true, the user must be an admin
};

const withRole = (Component: React.ComponentType, options: AccessOptions) => {
  return (props: any) => {
    const { user } = useAuth();
    const { hasRole } = useUserContext();

    // Check if admin is required and the user is not an admin
    if (options.requireAdmin && !user?.admin) {
      return <p>Access Denied</p>;
    }

    // Check if specific roles are required
    if (options.requiredRoles && options.requiredRoles.length > 0) {
      const hasRequiredRoles = options.requiredRoles.every((role) =>
        hasRole(role),
      );

      if (!hasRequiredRoles) {
        return <p>Access Denied</p>;
      }
    }

    // If the checks pass, render the component
    return <Component {...props} />;
  };
};

export default withRole;
