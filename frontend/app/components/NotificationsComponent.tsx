'use client';
import { Notification } from '@/app/types/navbar.types';

interface NotificationsComponentProps {
  notifications: Notification[];
}

export const NotificationsComponent: React.FC<NotificationsComponentProps> = ({
  notifications,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg ${
                notification.read
                  ? 'bg-gray-50'
                  : 'bg-white border border-orange-200'
              }`}
            >
              <p
                className={notification.read ? 'text-gray-500' : 'font-medium'}
              >
                {notification.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
