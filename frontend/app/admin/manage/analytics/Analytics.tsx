import React, { useState, useEffect } from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AnalyticsComponent = () => {
  const [dashboardLayout, setDashboardLayout] = useState([
    { id: 'lineChart', type: 'line', order: 1 },
    { id: 'barChart', type: 'bar', order: 2 },
    { id: 'pieChart', type: 'pie', order: 3 },
  ]);

  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    timeRange: '7days',
    category: 'all',
    fundingSource: 'all',
  });

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      checkForNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkForNotifications = () => {
    // Logic to check for new notifications
    const newNotification = {
      id: Date.now(),
      message: 'New milestone reached!',
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({ ...prev, [name]: value }));
  };

  const DraggableChart: React.FC<{
    id: string;
    type: string;
    children: React.ReactNode;
  }> = ({ id, type, children }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'chart',
      item: { id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    interface DraggableItem {
      id: string;
    }

    const [, drop] = useDrop<DraggableItem>(() => ({
      accept: 'chart',
      hover(item: DraggableItem) {
        if (item.id !== id) {
          const draggedItem = dashboardLayout.find((c) => c.id === item.id);
          const targetItem = dashboardLayout.find((c) => c.id === id);
          const newLayout = dashboardLayout.map((c) => {
            if (c.id === item.id && targetItem)
              return { ...c, order: targetItem.order };
            if (c.id === id && draggedItem)
              return { ...c, order: draggedItem.order };
            return c;
          });
          setDashboardLayout(newLayout.sort((a, b) => a.order - b.order));
        }
      },
    }));

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`p-4 bg-white rounded-lg shadow-md ${isDragging ? 'opacity-50' : ''}`}
        style={{ cursor: 'move' }}
      >
        <h3 className="text-lg font-semibold mb-2">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </h3>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto px-2 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="flex space-x-4">
            <select
              name="timeRange"
              value={filterOptions.timeRange}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <select
              name="category"
              value={filterOptions.category}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            >
              <option value="all">All Categories</option>
              <option value="tech">Technology</option>
              <option value="arts">Arts</option>
              <option value="social">Social Causes</option>
            </select>
            <select
              name="fundingSource"
              value={filterOptions.fundingSource}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            >
              <option value="all">All Sources</option>
              <option value="individual">Individual Donors</option>
              <option value="corporate">Corporate Sponsors</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardLayout.map((chart) => (
            <DraggableChart key={chart.id} id={chart.id} type={chart.type}>
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p>No chart data available</p>
                {/* You can add placeholder or any content here */}
              </div>
            </DraggableChart>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li key={notification.id} className="flex items-center mb-2">
                    <FaBell className="text-blue-500 mr-2" />
                    <span>{notification.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            <FaCog className="inline-block mr-2" /> Customize Dashboard
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default AnalyticsComponent;
