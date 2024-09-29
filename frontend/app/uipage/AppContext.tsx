import React, { createContext, useContext, useState, useEffect } from 'react';
import { FaSun, FaMoon, FaUser, FaCog } from 'react-icons/fa';

// Create the context
const AppContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isAuthenticated: false,
  toggleAuth: () => {},
  settings: {
    notifications: true,
    language: 'en',
  },
  updateSettings: (newSettings: {
    notifications: boolean;
    language: string;
  }) => {},
});

// Context Provider component
import { ReactNode } from 'react';

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleAuth = () => {
    setIsAuthenticated((prevAuth) => !prevAuth);
  };

  const updateSettings = (newSettings: {
    notifications: boolean;
    language: string;
  }) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const contextValue = {
    theme,
    toggleTheme,
    isAuthenticated,
    toggleAuth,
    settings,
    updateSettings,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ErrorBoundary>
        <div
          className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
        >
          {children}
        </div>
      </ErrorBoundary>
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

// Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-8 bg-red-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Oops! Something went wrong.
            </h2>
            <p className="text-red-600">
              We're sorry for the inconvenience. Please try refreshing the page
              or contact support if the issue persists.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Example child components
const Header = () => {
  const { theme, toggleTheme, isAuthenticated, toggleAuth } = useAppContext();

  return (
    <header
      className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My App</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <button
            onClick={toggleAuth}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </header>
  );
};

const Main = () => {
  const { isAuthenticated, settings, updateSettings } = useAppContext();

  const handleNotificationToggle = () => {
    updateSettings({
      notifications: !settings.notifications,
      language: settings.language,
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      notifications: settings.notifications,
      language: e.target.value,
    });
  };

  return (
    <main className="container mx-auto p-4">
      {isAuthenticated ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-4">Welcome, User!</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="notifications" className="font-medium">
                  Notifications
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="notifications"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={settings.notifications}
                    onChange={handleNotificationToggle}
                  />
                  <label
                    htmlFor="notifications"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="language" className="font-medium">
                  Language
                </label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={handleLanguageChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Please log in to access the content
          </h2>
          <p className="text-xl">
            Use the login button in the header to authenticate.
          </p>
        </div>
      )}
    </main>
  );
};

const Footer = () => {
  const { theme } = useAppContext();

  return (
    <footer
      className={`mt-8 p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
    >
      <div className="container mx-auto text-center">
        <p>&copy; 2023 My App. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Main App component
const AppContextUsage = () => {
  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Main />
        <Footer />
      </div>
    </AppContextProvider>
  );
};
