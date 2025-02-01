'use client';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import Pagination from '@/app/components/pagination/Pagination';
import {
  UserProfileProvider,
  useUserContext,
} from '@/app/context/users/UserContext';
import { exportUsersToCSV } from '@/app/utils/helpers/exportCSV';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const {
    fetchAllUsers,
    deleteUser,
    assignRoleToUser,
    blockUser,
    activateUser,
    makeUserAdmin,
    removeRoleFromUser, // Added this function to the context
    userProfile,
    error,
    loading,
  } = useUserContext();

  const [users, setUsers] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Pagination items per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { users, meta } = await fetchAllUsers(page, perPage); // Assuming `fetchAllUsers` returns `meta` with pagination info
      setUsers(users);
      setMetadata(meta); // Store pagination metadata here
    };

    fetchUsers();
  }, [page, fetchAllUsers, perPage]);

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

  const handleRemoveRole = async (userId: number, roleName: string) => {
    try {
      await removeRoleFromUser(userId, roleName); // Assuming `removeRoleFromUser` is available in the context
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                roles: user.roles.filter((role: any) => role.name !== roleName),
              }
            : user,
        ),
      );
      toast.success('Role removed successfully!');
    } catch (err) {
      toast.error('Failed to remove role');
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

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
    setIsDeletePopupOpen(true); // Show the custom confirmation popup
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <button
          onClick={() => exportUsersToCSV(fetchAllUsers)}
          className="p-2 bg-green-500 text-white rounded"
        >
          Export CSV
        </button>
      </div>
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

      <div className="overflow-x-auto [&::-moz-scrollbar-thumb]:rounded-full [&::-moz-scrollbar-thumb]:bg-gray-200 [&::-moz-scrollbar-track]:m-1 [&::-moz-scrollbar]:w-1 [&::-ms-scrollbar-thumb]:rounded-full [&::-ms-scrollbar-thumb]:bg-gray-200 [&::-ms-scrollbar-track]:m-1 [&::-ms-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:m-1 [&::-webkit-scrollbar]:w-2">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Access Level</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="p-2 truncate">{user.full_name}</td>
                <td className="p-2 truncate">{user.email}</td>
                <td className="p-2 truncate">{user.country}</td>
                <td className="p-2 truncate">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Assign Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                  </select>
                </td>
                <td className="p-2 truncate">
                  {user.roles.map((role: any) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center px-2 py-1 text-sm rounded bg-gray-50 text-orange-600 mr-1"
                    >
                      {role.name}
                      <button
                        onClick={() => handleRemoveRole(user.id, role.name)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        aria-label={`Remove ${role.name}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
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
                  {userProfile && userProfile.admin && (
                    <button
                      onClick={() => handleToggleAdmin(user.id, !user.admin)}
                      className={`text-sm px-3 py-1 rounded w-24 ${
                        user.admin
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {user.admin ? 'Remove' : 'Admin'}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      user.status === 'active'
                        ? handleBlockUser(user.id)
                        : handleActivateUser(user.id)
                    }
                    className={`w-24 ${
                      user.status === 'active'
                        ? 'text-red-500 hover:text-red-700'
                        : 'text-green-500 hover:text-green-700'
                    }`}
                    aria-label={`${
                      user.status === 'active' ? 'Block' : 'Unblock'
                    } user`}
                  >
                    {user.status === 'active' ? <FaLock /> : <FaUnlock />}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="w-24 text-red-500 hover:text-red-700"
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
        currentPage={metadata.current_page || page}
        totalPages={metadata.total_pages || 1}
        onPageChange={(newPage) => setPage(newPage)}
      />
      <AlertPopup
        title="Delete User"
        message="Are you sure you want to delete this user?"
        isOpen={isDeletePopupOpen}
        setIsOpen={setIsDeletePopupOpen}
        onConfirm={async () => {
          if (userToDelete !== null) {
            try {
              await deleteUser(userToDelete);
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToDelete),
              );
              toast.error('User deleted!');
            } catch (err) {
              toast.error('Failed to delete user');
            }
            setIsDeletePopupOpen(false);
            setUserToDelete(null);
          }
        }}
        onCancel={() => {
          setIsDeletePopupOpen(false);
          setUserToDelete(null);
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
