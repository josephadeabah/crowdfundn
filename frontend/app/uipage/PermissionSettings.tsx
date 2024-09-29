import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { Switch } from '@headlessui/react';

const PermissionSetting = () => {
  const [permissions, setPermissions] = useState({
    admin: false,
    editor: false,
    viewer: false,
  });

  const [checkboxes, setCheckboxes] = useState({
    admin: { create: false, delete: false, modify: false },
    editor: { edit: false, publish: false },
    viewer: { read: false, download: false },
  });

  const handleSwitchChange = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleCheckboxChange = <T extends keyof typeof checkboxes>(
    permission: T,
    option: keyof (typeof checkboxes)[T],
  ) => {
    setCheckboxes((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [option]: !prev[permission][option],
      },
    }));
  };

  const renderPermissionSection = <T extends keyof typeof checkboxes>(
    permission: T,
    options: (typeof checkboxes)[T],
  ) => (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {permission}
        </h3>
        <Switch
          checked={permissions[permission]}
          onChange={() => handleSwitchChange(permission)}
          className={`${
            permissions[permission] ? 'bg-theme-color-primary' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-offset-2`}
        >
          <span
            className={`${
              permissions[permission] ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
      <div className="mt-2 space-y-2">
        {Object.entries(options).map(([option, checked]) => (
          <label key={option} className="flex items-center space-x-3 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                handleCheckboxChange(
                  permission,
                  option as keyof (typeof checkboxes)[T],
                )
              }
              disabled={!permissions[permission]}
              className="form-checkbox h-5 w-5 text-theme-color-primary rounded focus:ring-theme-color-primary disabled:opacity-50"
            />
            <span className={`${!permissions[permission] && 'text-gray-400'}`}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Permission Settings
      </h2>
      {renderPermissionSection('admin', checkboxes.admin)}
      {renderPermissionSection('editor', checkboxes.editor)}
      {renderPermissionSection('viewer', checkboxes.viewer)}
      <div className="mt-8 flex justify-end">
        <button
          className="px-4 py-2 bg-theme-color-primary text-gray-800 rounded-md hover:bg-theme-color-primary-dark focus:outline-none focus:ring-2 focus:ring-theme-color-primary focus:ring-offset-2 transition-colors duration-300"
          onClick={() => {
            // Handle save permissions logic here
            console.log('Permissions saved:', { permissions, checkboxes });
          }}
        >
          Save Permissions
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600 flex items-center">
        <FiInfo className="mr-2" />
        <span>Changes will take effect immediately after saving.</span>
      </div>
    </div>
  );
};

export default PermissionSetting;
