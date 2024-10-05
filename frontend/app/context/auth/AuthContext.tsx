import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User } from '@/app/types/user.types';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  token: string | null; // Store the token in the context
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Function to handle user login
  const login = (token: string) => {
    try {
      const decodedUser = jwtDecode<User>(token);
      setUser(decodedUser);
      setToken(token); // Store the token in state
      resetLogoutTimer(); // Reset the inactivity timer on login
    } catch (error) {
      console.error('Invalid token', error);
      // handle error (e.g., redirect to login)
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    setToken(null);
    clearTimeout(logoutTimer!); // Clear the logout timer if any
    router.push('/login');
  };

  // Function to reset the inactivity timer
  const resetLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer); // Clear any existing timer
    }
    const timer = setTimeout(() => {
      logout(); // Automatically log the user out after timeout
    }, INACTIVITY_TIMEOUT);
    setLogoutTimer(timer);
  };

  // UseEffect to detect user activity and reset the timer
  useEffect(() => {
    const handleUserActivity = () => resetLogoutTimer();

    // List of events that will reset the timer
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, []);

  const hasRole = (role: string) => {
    return user?.roles.some((r) => r.name === role) || false;
  };

  const value = React.useMemo(
    () => ({ user, token, login, logout, hasRole }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
