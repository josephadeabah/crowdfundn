import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { LoginUserType } from '@/app/types/auth.login.types';
import { useRouter } from 'next/navigation';
import { LoginUserResponseSuccess } from '@/app/types/auth.login.types';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  user: LoginUserType | null;
  token: string | null;
  login: (response: LoginUserResponseSuccess) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginUserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  let logoutTimer: NodeJS.Timeout;

  // Load user and token from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // Start inactivity timer
    resetLogoutTimer();

    // Check if token is expired on mount
    if (storedToken && isTokenExpired(storedToken)) {
      logout(); // Log out if token is expired
    }

    // Listen for user activity
    const handleUserActivity = () => resetLogoutTimer();

    // List of events that will reset the timer
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
      // Cleanup event listeners and timer on component unmount
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearTimeout(logoutTimer);
    };
  }, []);

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
  };

  const login = (response: LoginUserResponseSuccess) => {
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    resetLogoutTimer(); // Reset timer on login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/auth/login'; // Redirect to login page
  };

  const isTokenExpired = (token: string) => {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime; // Check if token is expired
  };

  const value = React.useMemo(
    () => ({ user, token, login, logout }),
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
