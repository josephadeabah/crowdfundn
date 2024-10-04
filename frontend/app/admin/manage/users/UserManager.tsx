import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUpload,
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      profilePicture:
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      profilePicture:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Editor',
      status: 'blocked',
      profilePicture:
        'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    profilePicture: string;
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [roles, setRoles] = useState(['Admin', 'User', 'Editor']);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    // Simulating API call to fetch users
    // In a real application, you would fetch users from an API here
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (criteria: string) => {
    setSortCriteria(criteria);
  };

  const handleEditUser = (user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    profilePicture: string;
  }) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? selectedUser : user,
      );
      setUsers(updatedUsers);
      setEditMode(false);
      setSelectedUser(null);
      toast.success('User updated successfully!');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value } as User);
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedUser({
        ...selectedUser,
        profilePicture: reader.result as string,
      } as User);
    };
    reader.readAsDataURL(file);
  };

  const handleBlockUser = (userId: number) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
        : user,
    );
    setUsers(updatedUsers);
    toast.info('User status updated!');
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      toast.error('User deleted!');
    }
  };

  const handleAddRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
      toast.success('New role added!');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isUserKey = (key: string): key is keyof User => {
    return ['id', 'name', 'email', 'role', 'status', 'profilePicture'].includes(
      key,
    );
  };

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (isUserKey(sortCriteria)) {
      if (a[sortCriteria] < b[sortCriteria]) return -1;
      if (a[sortCriteria] > b[sortCriteria]) return 1;
    }
    return 0;
  });

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="mb-4 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 pl-8 rounded border focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-2 top-3 text-gray-400" />
        </div>
        <select
          className="ml-4 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-300"
          onChange={(e) => handleSort(e.target.value)}
          value={sortCriteria}
        >
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 w-1/5 text-left">Name</th>
              <th className="p-2 w-1/5 text-left">Email</th>
              <th className="p-2 w-1/5 text-left">Role</th>
              <th className="p-2 w-1/5 text-left">Status</th>
              <th className="p-2 w-1/5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="p-2 truncate">{user.name}</td>
                <td className="p-2 truncate">{user.email}</td>
                <td className="p-2 truncate">{user.role}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-2 flex items-center gap-4 space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit user"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleBlockUser(user.id)}
                    className={`${
                      user.status === 'active'
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-green-500 hover:text-green-700'
                    }`}
                    aria-label={`${user.status === 'active' ? 'Block' : 'Unblock'} user`}
                  >
                    {user.status === 'active' ? <FaLock /> : <FaUnlock />}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete user"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editMode && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    } as User)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="profilePicture"
                >
                  Profile Picture
                </label>
                <div className="flex items-center">
                  <img
                    src={selectedUser.profilePicture}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <FaUpload className="inline-block mr-2" />
                    Upload New
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Roles</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New role name"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleAddRole}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Role
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Current Roles:</h3>
          <ul className="list-disc list-inside">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default UserManagement;
