// app/javascript/components/admin/TransferLockManager.jsx (Enhanced with visual styling)
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Lock, 
  Unlock, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';
// import { toast } from 'react-toast';

const PayoutsManager = () => {
  const [lockedUsers, setLockedUsers] = useState([
    {
      id: 1,
      full_name: "John Smith",
      email: "john.smith@example.com",
      transfer_locked: true,
      transfer_lock_info: {
        locked_by: "Admin User",
        reason: "Suspicious activity detected",
        locked_at: "2024-01-15T10:30:00Z"
      },
      total_transferred_amount: 12500.50,
      currency_symbol: "₵",
      campaigns: [
        { id: 1, title: "Education Fund", transferred_amount: 8500.00, goal_amount: 10000.00 },
        { id: 2, title: "Community Project", transferred_amount: 4000.50, goal_amount: 5000.00 }
      ]
    },
    {
      id: 2,
      full_name: "Sarah Johnson",
      email: "sarah.j@example.com",
      transfer_locked: true,
      transfer_lock_info: {
        locked_by: "System Admin",
        reason: "KYC verification pending",
        locked_at: "2024-01-14T14:20:00Z"
      },
      total_transferred_amount: 7800.00,
      currency_symbol: "₵",
      campaigns: [
        { id: 3, title: "Medical Expenses", transferred_amount: 7800.00, goal_amount: 15000.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  type Campaign = {
    id: number;
    title: string;
    transferred_amount: number;
    goal_amount: number;
  };
  
  type TransferLockInfo = {
    locked_by: string;
    reason: string;
    locked_at: string;
  };
  
  type User = {
    id: number;
    full_name: string;
    email: string;
    transfer_locked: boolean;
    transfer_lock_info?: TransferLockInfo;
    total_transferred_amount: number;
    currency_symbol: string;
    campaigns: Campaign[];
  };
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: string; user: User | null }>({ open: false, action: '', user: null });
  const [reason, setReason] = useState('');
  const [stats, setStats] = useState({
    totalLocked: 2,
    totalAmountLocked: 20300.50,
    recentLocks: 1
  });

  // Mock search function
  const searchUsers = async () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedUser({
        id: 3,
        full_name: "Michael Brown",
        email: "michael.b@example.com",
        transfer_locked: false,
        total_transferred_amount: 4500.00,
        currency_symbol: "₵",
        campaigns: [
          { id: 4, title: "Business Startup", transferred_amount: 4500.00, goal_amount: 20000.00 }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const performAction = async (action: string, userId: number) => {
    // Mock action performance
    setTimeout(() => {
      // toast.success(`Action ${action} completed successfully`);
      setActionDialog({ open: false, action: '', user: null });
      setReason('');
    }, 1000);
  };

  const openActionDialog = (action: string, user: any) => {
    setActionDialog({ open: true, action, user });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfer Lock Manager</h1>
            <p className="text-gray-600 mt-2">
              Manage user transfer permissions and monitor locked accounts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locked Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount Locked</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalAmountLocked.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Locks (7d)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentLocks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Search & User Actions */}
        <div className="space-y-6">
          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Search User</h2>
              <p className="text-sm text-gray-600 mt-1">
                Find a user to manage their transfer permissions
              </p>
            </div>
            <div className="p-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={searchUsers}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </button>
              </div>

              {/* Selected User Card */}
              {selectedUser && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedUser.full_name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedUser.email}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedUser.transfer_locked 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedUser.transfer_locked ? (
                              <>
                                <Lock className="w-3 h-3 mr-1" />
                                Transfers Locked
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Transfers Allowed
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {selectedUser.transfer_locked ? (
                        <>
                          <button
                            onClick={() => openActionDialog('unlock', selectedUser)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            Unlock
                          </button>
                          <button
                            onClick={() => openActionDialog('reset_transfers', selectedUser)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openActionDialog('lock', selectedUser)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Lock
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Campaign Details */}
                  {selectedUser.campaigns && selectedUser.campaigns.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Campaigns</h4>
                      <div className="space-y-2">
                        {selectedUser.campaigns.map(campaign => (
                          <div key={campaign.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{campaign.title}</span>
                            <span className="font-medium">
                              {selectedUser.currency_symbol}{campaign.transferred_amount?.toLocaleString()} 
                              <span className="text-gray-400"> / {selectedUser.currency_symbol}{campaign.goal_amount?.toLocaleString()}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Locked Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Currently Locked Users</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Users with transfers currently locked
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lock Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lockedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{user.transfer_lock_info?.locked_by}</div>
                        <div className="text-gray-500 mt-1">{user.transfer_lock_info?.reason}</div>
                        <div className="text-gray-400 text-xs mt-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(user.transfer_lock_info?.locked_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.currency_symbol}{user.total_transferred_amount?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.campaigns?.length || 0} campaign(s)
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openActionDialog('unlock', user)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unlock
                        </button>
                        <button
                          onClick={() => openActionDialog('reset_transfers', user)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lockedUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-sm font-medium text-gray-900">No locked users</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All users currently have transfer access enabled.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Dialogs */}
      {actionDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${
                actionDialog.action === 'lock' ? 'bg-red-100' :
                actionDialog.action === 'reset_transfers' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {actionDialog.action === 'lock' && <Lock className="w-5 h-5 text-red-600" />}
                {actionDialog.action === 'unlock' && <Unlock className="w-5 h-5 text-green-600" />}
                {actionDialog.action === 'reset_transfers' && <RotateCcw className="w-5 h-5 text-orange-600" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {actionDialog.action === 'lock' && 'Lock Transfers'}
                {actionDialog.action === 'unlock' && 'Unlock Transfers'}
                {actionDialog.action === 'reset_transfers' && 'Reset Transferred Amounts'}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              {actionDialog.action === 'lock' && 
                `Are you sure you want to lock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'unlock' && 
                `Are you sure you want to unlock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'reset_transfers' && 
                `This will reset all transferred amounts to zero for ${actionDialog.user?.full_name}. This action cannot be undone.`}
            </p>

            {actionDialog.action === 'lock' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for locking transfers (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for locking transfers..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setActionDialog({ open: false, action: '', user: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (actionDialog.user && typeof actionDialog.user.id === 'number') {
                    performAction(actionDialog.action, actionDialog.user.id);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  actionDialog.action === 'lock' ? 'bg-red-600 hover:bg-red-700' :
                  actionDialog.action === 'reset_transfers' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionDialog.action === 'lock' && 'Lock Transfers'}
                {actionDialog.action === 'unlock' && 'Unlock Transfers'}
                {actionDialog.action === 'reset_transfers' && 'Reset Amounts'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsManager;