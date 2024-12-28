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

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await assignRoleToUser(userId, role);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role } : user,
        ),
      );
      toast.success('Role updated successfully!');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      await makeUserAdmin(userId, isAdmin);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin } : user,
        ),
      );
      toast.success(`User ${isAdmin ? 'made' : 'removed'} admin!`);
    } catch (err) {
      toast.error('Failed to update admin status');
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
                <td className="p-2 truncate">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Editor">Editor</option>
                  </select>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.status === 'active'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-2 flex items-center gap-4 space-x-2">
                  <button
                    onClick={() => handleToggleAdmin(user.id, !user.isAdmin)}
                    className={`text-sm px-3 py-1 rounded ${user.isAdmin ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-black'}`}
                  >
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
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
