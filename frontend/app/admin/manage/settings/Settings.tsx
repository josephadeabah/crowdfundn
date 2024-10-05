import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { FaLock, FaUser, FaEnvelope, FaDatabase } from 'react-icons/fa';

// Define the type for permissions
type Permissions = {
  adminAccess: boolean;
  userManagement: boolean;
  emailNotifications: boolean;
  dataAccess: boolean;
};

// Define the type for permission data
type PermissionData = {
  name: string;
  key: keyof Permissions;
  description: string;
  icon: JSX.Element;
};

const PermissionSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<Permissions>({
    adminAccess: false,
    userManagement: false,
    emailNotifications: false,
    dataAccess: false,
  });

  const handlePermissionChange = (permission: keyof Permissions) => {
    setPermissions((prevState) => ({
      ...prevState,
      [permission]: !prevState[permission],
    }));
  };

  const permissionData: PermissionData[] = [
    {
      name: 'Admin Access',
      key: 'adminAccess',
      description: 'Full access to all system settings and configurations',
      icon: <FaLock size={24} className="text-yellow-500" />,
    },
    {
      name: 'User Management',
      key: 'userManagement',
      description: 'Ability to create, edit, and delete user accounts',
      icon: <FaUser size={24} className="text-blue-500" />,
    },
    {
      name: 'Email Notifications',
      key: 'emailNotifications',
      description: 'Send and manage email notifications to users',
      icon: <FaEnvelope size={24} className="text-pink-500" />,
    },
    {
      name: 'Data Access',
      key: 'dataAccess',
      description: 'View and modify sensitive data within the system',
      icon: <FaDatabase size={24} className="text-green-500" />,
    },
  ];

  return (
    <div className="mx-auto p-6 bg-gray-100 shadow mb-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Permission Settings
      </h2>
      {permissionData.map((permission, index) => (
        <div
          key={permission.key}
          className="mb-8 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
            {permission.icon}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {permission.name}
              </h3>
              <p className="text-sm text-gray-600">{permission.description}</p>
            </div>
            <Switch
              checked={permissions[permission.key]}
              onChange={() => handlePermissionChange(permission.key)}
              className={`${
                permissions[permission.key] ? 'bg-green-500' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className="sr-only">
                {permission.name} permission switch
              </span>
              <span
                className={`${
                  permissions[permission.key]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <Switch
              checked={permissions[permission.key]}
              onChange={() => handlePermissionChange(permission.key)}
              className={`${
                permissions[permission.key] ? 'bg-green-500' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            >
              <span className="sr-only">
                {permission.name} permission checkbox
              </span>
              <span
                className={`${
                  permissions[permission.key]
                    ? 'translate-x-6'
                    : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Allow {permission.name}
              </h3>
              <p className="text-sm text-gray-600">
                Enable or disable this permission
              </p>
            </div>
          </div>
          {index < permissionData.length - 1 && (
            <hr className="my-6 border-t border-gray-200" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PermissionSettings;
