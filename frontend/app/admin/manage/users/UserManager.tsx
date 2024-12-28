'use client';
import Pagination from '@/app/components/pagination/Pagination';
import { useUserContext } from '@/app/context/users/UserContext';
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
  const {
    fetchAllUsers,
    assignRoleToUser,
    blockUser,
    activateUser,
    makeUserAdmin,
    error,
    loading,
  } = useUserContext();
  const [users, setUsers] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [roles, setRoles] = useState(['Admin', 'User', 'Editor']);
  const [newRole, setNewRole] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Pagination items per page

  useEffect(() => {
    const fetchUsers = async () => {
      const { users, meta } = await fetchAllUsers(page, perPage); // Assuming `fetchAllUsers` returns `totalPages`
      setUsers(users);
      setMetadata(meta);
    };

    fetchUsers();
  }, [page, fetchAllUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (criteria: string) => {
    setSortCriteria(criteria);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        await assignRoleToUser(selectedUser.id, selectedUser.role);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? selectedUser : user,
          ),
        );
        setEditMode(false);
        setSelectedUser(null);
        toast.success('User updated successfully!');
      } catch (err) {
        toast.error('Failed to update user');
      }
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await blockUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: 'blocked' } : user,
        ),
      );
      toast.info('User blocked!');
    } catch (err) {
      toast.error('Failed to block user');
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await activateUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: 'active' } : user,
        ),
      );
      toast.info('User activated!');
    } catch (err) {
      toast.error('Failed to activate user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Call delete API here if needed (for now, removing from list)
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.error('User deleted!');
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleAddRole = () => {
    if (newRole && !roles.includes(newRole)) {
      setRoles([...roles, newRole]);
      setNewRole('');
      toast.success('New role added!');
    }
  };

  const filteredUsers = users.filter((user) => {
    const userName = user.full_name?.toLowerCase() || ''; // Safeguard for undefined
    const userEmail = user.email?.toLowerCase() || ''; // Safeguard for undefined
    return (
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase())
    );
  });  

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortCriteria] < b[sortCriteria]) return -1;
    if (a[sortCriteria] > b[sortCriteria]) return 1;
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
                    onClick={() =>
                      user.status === 'active'
                        ? handleBlockUser(user.id)
                        : handleActivateUser(user.id)
                    }
                    className={`${user.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
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
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
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
                    setSelectedUser({ ...selectedUser, role: e.target.value })
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
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={metadata.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <ToastContainer />
    </div>
  );
};

export default UserManagement;
