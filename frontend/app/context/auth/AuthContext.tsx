import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginUserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [signupEmailConfirmationToken, setSignupEmailConfirmationToken] = useState<string | null>(null);
  const router = useRouter();

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  let logoutTimer: NodeJS.Timeout;

  useEffect(() => {
    const storedUser = Cookies.get('user')
      ? JSON.parse(Cookies.get('user')!)
      : null;
    const storedToken = Cookies.get('token') || null;

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    resetLogoutTimer();

    if (storedToken && isTokenExpired(storedToken)) {
      logout(); // Log out if token is expired
    }

    const handleUserActivity = () => resetLogoutTimer();
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    return () => {
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

    // Store in cookies
    Cookies.set('user', JSON.stringify(response.user), { expires: 30 }); // Expires in 30 days
    Cookies.set('token', response.token, { expires: 30 });

    resetLogoutTimer(); // Reset timer on login
  };

  const signup = (response: ApiResponse) => {
    setSignupEmailConfirmationToken(response.user.confirmation_token);
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    // Remove cookies
    Cookies.remove('user');
    Cookies.remove('token');

    router.push('/auth/login'); // Redirect to login page
  };

  const isTokenExpired = (token: string) => {
    const decoded: { exp: number } = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime; // Check if token is expired
  };

  const value = React.useMemo(
    () => ({ user, token, signupEmailConfirmationToken, login, logout, signup }),
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
