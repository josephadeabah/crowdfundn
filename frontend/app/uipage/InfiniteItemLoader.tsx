import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { FiBell, FiSettings, FiCheck, FiX } from 'react-icons/fi';
import { Switch } from '@headlessui/react';
import axios from 'axios';

const InfiniteLoader = ({
  color = '#4f46e5',
  size = '40px',
  itemsPerLoad = 10,
  initialItems = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [progress, setProgress] = useState(0);

  const loader = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && !loading && !paused && !stopped && hasMore) {
      loadMoreItems();
    }
  };

  const loadMoreItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newItems = Array.from(
        { length: itemsPerLoad },
        (_, index) => `Item ${items.length + index + 1}`,
      );
      setItems((prevItems) => [...prevItems, ...newItems]);
      setHasMore(items.length + newItems.length < 100); // Assume 100 is the total number of items
      setProgress(((items.length + newItems.length) / 100) * 100);
    } catch (err) {
      setError('An error occurred while loading more items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = () => {
    setPaused(!paused);
  };

  const handleStop = () => {
    setStopped(true);
    setPaused(false);
  };

  const handleRetry = () => {
    setError(null);
    setStopped(false);
    loadMoreItems();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white shadow rounded p-4">
            {item}
          </div>
        ))}
      </div>

      <div
        ref={loader}
        className="flex justify-center items-center mt-8"
        aria-live="polite"
      >
        {loading && !error && (
          <div className="text-center">
            <FaSpinner
              className="animate-spin mx-auto"
              style={{ color, width: size, height: size }}
              role="status"
              aria-label="Loading"
            />
            <p className="mt-2 text-gray-600">Loading more items...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {!loading && !error && hasMore && (
          <button
            onClick={handlePauseResume}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            aria-label={paused ? 'Resume loading' : 'Pause loading'}
          >
            {paused ? <FaPlay /> : <FaPause />}
          </button>
        )}

        {!hasMore && <p className="text-gray-600">No more items to load.</p>}

        {error && (
          <div className="text-center">
            <MdError
              className="text-red-500 mx-auto"
              style={{ width: size, height: size }}
            />
            <p className="mt-2 text-red-500">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {!stopped && (
          <button
            onClick={handleStop}
            className="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            aria-label="Stop loading"
          >
            <FaStop />
          </button>
        )}
      </div>
    </div>
  );
};

export default InfiniteLoader;

export const NotificationSettings = () => {
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationTime, setNotificationTime] = useState('anytime');
  const [frequency, setFrequency] = useState('daily');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulating real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `New notification at ${new Date().toLocaleTimeString()}`,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNotificationTime(event.target.value);
    setError('');
  };

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFrequency(event.target.value);
    setError('');
  };

  const handleSaveSettings = async () => {
    if (!enableNotifications) {
      setError(
        'Notifications are currently disabled. Enable them to save settings.',
      );
      return;
    }
    if (notificationTime === 'custom' && frequency === 'daily') {
      setError('Custom time cannot be set with daily frequency.');
      return;
    }
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      // Test API call
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          notificationTime,
          frequency,
          enableNotifications,
        },
      );

      if (response.status === 201) {
        setSuccess(true);
        console.log('Settings saved:', response.data);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center mb-8 bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Notification Center</h1>
        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="View notifications"
          >
            <FiBell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Open settings"
          >
            <FiSettings className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {notifications.length > 0 && (
        <div className="mb-8 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-lg font-semibold p-4 bg-gray-50">
            Latest Notification
          </h2>
          <div className="p-4 border-t border-gray-200">
            <p>{notifications[0].message}</p>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>

          <div className="mb-6">
            <label
              htmlFor="enable-notifications"
              className="flex items-center cursor-pointer"
            >
              <Switch
                checked={enableNotifications}
                onChange={setEnableNotifications}
                className={`${
                  enableNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span
                  className={`${
                    enableNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Enable Notifications
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label
              htmlFor="notification-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notification Time
            </label>
            <select
              id="notification-time"
              value={notificationTime}
              onChange={handleNotificationTimeChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={!enableNotifications}
            >
              <option value="anytime">Anytime</option>
              <option value="morning">Morning (8 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 9 PM)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={handleFrequencyChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={!enableNotifications}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {error && (
            <div
              className="mb-4 p-4 text-red-700 bg-red-100 rounded-md"
              role="alert"
            >
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div
              className="mb-4 p-4 text-green-700 bg-green-100 rounded-md"
              role="alert"
            >
              <p className="font-medium">Success:</p>
              <p>Settings saved successfully!</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={!enableNotifications || loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 bg-gray-50">
          All Notifications
        </h2>
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              {notification.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
