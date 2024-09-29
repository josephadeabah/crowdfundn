import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaCog,
  FaBell,
  FaSearch,
  FaEllipsisV,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMetric, setActiveMetric] = useState('sales');
  const [error, setError] = useState<string | null>(null);
  interface Activity {
    id: number;
    user: string;
    action: string;
    timestamp: string;
  }

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      try {
        // Simulated API call
        const response = await new Promise<{
          activities: {
            id: number;
            user: string;
            action: string;
            timestamp: string;
          }[];
        }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                activities: [
                  {
                    id: 1,
                    user: 'John Doe',
                    action: 'Updated profile',
                    timestamp: '2 hours ago',
                  },
                  {
                    id: 2,
                    user: 'Jane Smith',
                    action: 'Added new product',
                    timestamp: '4 hours ago',
                  },
                  {
                    id: 3,
                    user: 'Mike Johnson',
                    action: 'Completed task',
                    timestamp: '1 day ago',
                  },
                ],
              }),
            1000,
          ),
        );
        setActivities(response.activities);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const navItems = [
    { icon: <FaHome />, label: 'Home' },
    { icon: <FaChartBar />, label: 'Analytics' },
    { icon: <FaUsers />, label: 'Customers' },
    { icon: <FaCog />, label: 'Settings' },
  ];

  const metrics = {
    sales: {
      label: 'Sales',
      value: '$15,000',
      change: '+12%',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    },
    users: {
      label: 'Users',
      value: '1,234',
      change: '+5%',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Users',
            data: [100, 120, 115, 134, 168, 180],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      },
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-theme-color-primary text-white transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'} lg:relative absolute z-10 h-full`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`font-bold ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            Dashboard
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none focus:text-theme-color-secondary"
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            <FaEllipsisV />
          </button>
        </div>
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center p-4 hover:bg-theme-color-primary-dark transition-colors duration-200"
                >
                  <span className="mr-4">{item.icon}</span>
                  <span className={sidebarCollapsed ? 'hidden' : 'block'}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md py-2 px-3 mr-4 focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
              />
              <button
                className="bg-theme-color-primary text-white p-2 rounded-full hover:bg-theme-color-primary-dark transition-colors duration-200"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>
            <div className="flex items-center">
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 mr-2"
                aria-label="Notifications"
              >
                <FaBell />
              </button>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Key Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(metrics).map(([key, metric]) => (
                  <div
                    key={key}
                    className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${activeMetric === key ? 'ring-2 ring-theme-color-primary' : ''}`}
                    onClick={() => setActiveMetric(key)}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {metric.label}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{metric.value}</span>
                      <span
                        className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                    <div className="mt-4 h-40">
                      <Line
                        data={metric.data}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`https://images.unsplash.com/photo-${1570295999919 + activity.id}-cbe6f7d5-9c0a-4313-bf4e-3578db30c9b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                            alt={activity.user}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.user}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.action}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
