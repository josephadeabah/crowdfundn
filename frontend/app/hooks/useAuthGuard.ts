// hooks/useAuthGuard.ts
import { useAuth } from '@/app/context/auth/AuthContext';

export const useAuthGuard = () => {
  const { token, isInitialized } = useAuth();

  const ensureAuthReady = (): boolean => {
    if (!isInitialized) {
      console.log('Authentication not initialized yet');
      return false;
    }

    if (!token) {
      console.log('No authentication token available');
      return false;
    }

    return true;
  };

  return { ensureAuthReady, token, isInitialized };
};
