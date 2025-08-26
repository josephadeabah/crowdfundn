// app/context/auth/AuthContext.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { LoginUserType } from '@/app/types/auth.login.types';
import { LoginUserResponseSuccess } from '@/app/types/auth.login.types';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ApiResponse } from '@/app/types/auth.register.types';

type AuthContextType = {
  user: LoginUserType | null;
  token: string | null;
  signupEmailConfirmationToken: string | null;
  login: (response: LoginUserResponseSuccess) => void;
  signup: (response: ApiResponse) => void;
  logout: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginUserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [signupEmailConfirmationToken, setSignupEmailConfirmationToken] =
    useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    if (user && user.status === 'blocked') {
      logout();
    }
  }, [user]);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = Cookies.get('user');
        const storedToken = Cookies.get('token') || null;

        // Check token expiration BEFORE setting state
        if (storedToken && isTokenExpired(storedToken)) {
          console.log('Token expired on initialization, logging out');
          logout();
          setIsInitialized(true);
          return;
        }

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        }

        setIsInitialized(true);
        resetLogoutTimer();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const handleUserActivity = () => resetLogoutTimer();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  const resetLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  };

  const login = (response: LoginUserResponseSuccess) => {
    if (response.user && response.user.status === 'blocked') {
      logout();
      alert('Your account is blocked. Please contact support.');
      return;
    }

    setUser(response.user);
    setToken(response.token);

    // Store in cookies with secure flags
    Cookies.set('user', JSON.stringify(response.user), {
      expires: 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    Cookies.set('token', response.token, {
      expires: 30,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    resetLogoutTimer();
  };

  const signup = (response: ApiResponse) => {
    setSignupEmailConfirmationToken(response.user.confirmation_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSignupEmailConfirmationToken(null);

    // Remove all auth-related cookies
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('roles');

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    router.push('/auth/login');
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const value = React.useMemo(
    () => ({
      user,
      token,
      signupEmailConfirmationToken,
      login,
      logout,
      signup,
      isInitialized,
    }),
    [user, token, signupEmailConfirmationToken, isInitialized],
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
