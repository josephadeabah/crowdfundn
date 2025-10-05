// app/javascript/components/admin/TransferLockManager.jsx
import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  LoginUserType,
  FormattedTransferLockInfo,
} from '@/app/types/auth.login.types';
import { CampaignResponseDataType } from '@/app/types/campaigns.types';

// Extended type definitions for admin functionality

interface AdminUser extends Omit<LoginUserType, 'transfer_lock_info'> {
  transfer_lock_info?: FormattedTransferLockInfo;
  total_transferred_amount: number;
  campaigns?: CampaignResponseDataType[];
}

interface LockedUsersResponse {
  locked_users: AdminUser[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

interface UsersSearchResponse {
  users: AdminUser[];
}

interface ActionResponse {
  success: boolean;
  message: string;
  user?: AdminUser;
  error?: string;
}

interface ActionDialogState {
  open: boolean;
  action: 'lock' | 'unlock' | 'reset_transfers' | '';
  user: AdminUser | null;
}

const PayoutsManager = () => {
  const { token } = useAuth();
  const [lockedUsers, setLockedUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    open: false,
    action: '',
    user: null,
  });
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  const fetchLockedUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/transfer_locks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data: LockedUsersResponse = await response.json();
        setLockedUsers(data.locked_users || []);
      } else {
        toast.error('Failed to fetch locked users');
      }
    } catch (error) {
      console.error('Error fetching locked users:', error);
      toast.error('Error fetching locked users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (): Promise<void> => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/users?search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data: UsersSearchResponse = await response.json();
        setSelectedUser(data.users?.[0] || null);
      } else {
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      toast.error('Error searching for user');
    } finally {
      setLoading(false);
    }
  };

  async function performAction(
    action: 'lock' | 'unlock' | 'reset_transfers',
    userId: number,
  ): Promise<void> {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/transfer_locks/${userId}/${action}`;
      const options: RequestInit = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (action === 'lock') {
        options.body = JSON.stringify({ reason });
      }

      const response = await fetch(endpoint, options);

      if (response.ok) {
        const result: ActionResponse = await response.json();
        toast.success(result.message);
        setActionDialog({ open: false, action: '', user: null });
        setReason('');
        fetchLockedUsers();

        // Clear selected user if it was the one we acted upon
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
      } else {
        const error: ActionResponse = await response.json();
        toast.error(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Action failed:', error);
      toast.error('Action failed');
    }
  }

  const openActionDialog = (
    action: 'lock' | 'unlock' | 'reset_transfers',
    user: AdminUser,
  ): void => {
    setActionDialog({ open: true, action, user });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  const handleDialogOpenChange = (open: boolean): void => {
    setActionDialog((prev) => ({ ...prev, open }));
  };

  const filteredUsers = lockedUsers.filter(
    (user: AdminUser) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Payouts Management</h1>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search User</CardTitle>
          <CardDescription>
            Search for a user to manage their transfer permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={searchUsers} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {selectedUser && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedUser.full_name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm">
                    Status:
                    <Badge
                      variant={
                        selectedUser.transfer_locked ? 'destructive' : 'default'
                      }
                      className="ml-2"
                    >
                      {selectedUser.transfer_locked
                        ? 'Transfers Locked'
                        : 'Transfers Allowed'}
                    </Badge>
                  </p>
                  {selectedUser.transfer_lock_info && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        Locked by: {selectedUser.transfer_lock_info.lockedBy}
                      </p>
                      <p>
                        Reason:{' '}
                        {selectedUser.transfer_lock_info.reason ||
                          'No reason provided'}
                      </p>
                      <p>
                        Locked at:{' '}
                        {selectedUser.transfer_lock_info.lockedAt
                          ? selectedUser.transfer_lock_info.lockedAt.toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedUser.transfer_locked ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openActionDialog('unlock', selectedUser)}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock Transfers
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          openActionDialog('reset_transfers', selectedUser)
                        }
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Amounts
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => openActionDialog('lock', selectedUser)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Lock Transfers
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Currently Locked Users */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Locked Users</CardTitle>
          <CardDescription>
            Users with transfers currently locked
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No users with locked transfers
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Locked By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Locked At</TableHead>
                  <TableHead>Total Transferred</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: AdminUser) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.transfer_lock_info?.lockedBy || 'System'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {user.transfer_lock_info?.reason || 'No reason provided'}
                    </TableCell>
                    <TableCell>
                      {user.transfer_lock_info?.lockedAt
                        ? user.transfer_lock_info.lockedAt.toLocaleString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.currency_symbol}{' '}
                      {user.total_transferred_amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openActionDialog('unlock', user)}
                        >
                          <Unlock className="w-3 h-3 mr-1" />
                          Unlock
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openActionDialog('reset_transfers', user)
                          }
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'lock' && 'Lock Transfers'}
              {actionDialog.action === 'unlock' && 'Unlock Transfers'}
              {actionDialog.action === 'reset_transfers' &&
                'Reset Transferred Amounts'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'lock' &&
                `Are you sure you want to lock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'unlock' &&
                `Are you sure you want to unlock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'reset_transfers' &&
                `This will reset all transferred amounts to zero for ${actionDialog.user?.full_name}. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === 'lock' && (
            <div className="space-y-4">
              <label htmlFor="reason" className="block text-sm font-medium">
                Reason for locking transfers (optional)
              </label>
              <Input
                id="reason"
                placeholder="Enter reason for locking transfers..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReason(e.target.value)
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({ open: false, action: '', user: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant={
                actionDialog.action === 'lock'
                  ? 'destructive'
                  : actionDialog.action === 'reset_transfers'
                    ? 'destructive'
                    : 'default'
              }
              onClick={() =>
                actionDialog.user &&
                ['lock', 'unlock', 'reset_transfers'].includes(
                  actionDialog.action,
                ) &&
                performAction(
                  actionDialog.action as 'lock' | 'unlock' | 'reset_transfers',
                  actionDialog.user.id,
                )
              }
              disabled={!actionDialog.user}
            >
              {actionDialog.action === 'lock' && (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {actionDialog.action === 'unlock' && (
                <Unlock className="w-4 h-4 mr-2" />
              )}
              {actionDialog.action === 'reset_transfers' && (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}

              {actionDialog.action === 'lock' && 'Lock Transfers'}
              {actionDialog.action === 'unlock' && 'Unlock Transfers'}
              {actionDialog.action === 'reset_transfers' && 'Reset Amounts'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutsManager;
