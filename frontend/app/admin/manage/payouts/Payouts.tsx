'use client';
import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
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
import {
  CampaignResponseDataType,
  FundraiserDetailsType,
} from '@/app/types/campaigns.types';

// Extended type definitions for admin functionality
interface AdminUser extends Omit<LoginUserType, 'transfer_lock_info'> {
  transfer_lock_info?: FormattedTransferLockInfo;
  total_transferred_amount: number;
  campaigns?: CampaignResponseDataType[];
  phone_code: string;
}

interface CompletedCampaign extends CampaignResponseDataType {
  // Override the fundraiser type to include AdminUser properties we need
  fundraiser: FundraiserDetailsType & {
    id: number;
    full_name?: string;
    email?: string;
    transfer_locked?: boolean;
    transfer_lock_info?: FormattedTransferLockInfo;
    total_transferred_amount?: number;
  };
}

interface LockedUsersResponse {
  locked_users: AdminUser[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

interface CompletedCampaignsResponse {
  campaigns: CompletedCampaign[];
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
  campaign?: CampaignResponseDataType;
  error?: string;
}

interface ActionDialogState {
  open: boolean;
  action:
    | 'lock'
    | 'unlock'
    | 'reset_transfers'
    | 'reset_campaign_transfers'
    | '';
  user: AdminUser | null;
  campaign?: CampaignResponseDataType | null;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
}

const PayoutsManager = () => {
  const { token } = useAuth();
  const [lockedUsers, setLockedUsers] = useState<AdminUser[]>([]);
  const [completedCampaigns, setCompletedCampaigns] = useState<CompletedCampaign[]>([]);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [campaignSearchTerm, setCampaignSearchTerm] = useState<string>('');
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [campaignsLoading, setCampaignsLoading] = useState<boolean>(false);
  
  // Pagination states
  const [lockedUsersPagination, setLockedUsersPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20
  });
  
  const [completedCampaignsPagination, setCompletedCampaignsPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20
  });

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCompletedCampaigns, setShowCompletedCampaigns] = useState<boolean>(false);
  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    open: false,
    action: '',
    user: null,
    campaign: null,
  });
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    fetchLockedUsers();
  }, []);

  // Fetch locked users with pagination and search
  const fetchLockedUsers = async (page: number = 1, search: string = ''): Promise<void> => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: lockedUsersPagination.perPage.toString(),
        ...(search && { search })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/transfer_locks?${queryParams}`,
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
        setLockedUsersPagination(prev => ({
          ...prev,
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.total_pages,
          totalCount: data.pagination.total_count
        }));
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

  // Fetch completed campaigns with pagination and search
  const fetchCompletedCampaigns = async (page: number = 1, search: string = ''): Promise<void> => {
    setCampaignsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: completedCampaignsPagination.perPage.toString(),
        ...(search && { search })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/transfer_locks/completed_campaigns?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data: CompletedCampaignsResponse = await response.json();
        setCompletedCampaigns(data.campaigns || []);
        setCompletedCampaignsPagination(prev => ({
          ...prev,
          currentPage: data.pagination.current_page,
          totalPages: data.pagination.total_pages,
          totalCount: data.pagination.total_count
        }));
        setShowCompletedCampaigns(true);
      } else {
        toast.error('Failed to fetch completed campaigns');
      }
    } catch (error) {
      console.error('Error fetching completed campaigns:', error);
      toast.error('Error fetching completed campaigns');
    } finally {
      setCampaignsLoading(false);
    }
  };

  // Search users
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

  // Handle locked users search
  const handleLockedUsersSearch = (): void => {
    fetchLockedUsers(1, searchTerm);
  };

  // Handle completed campaigns search
  const handleCompletedCampaignsSearch = (): void => {
    fetchCompletedCampaigns(1, campaignSearchTerm);
  };

  // Handle pagination for locked users
  const handleLockedUsersPageChange = (page: number): void => {
    fetchLockedUsers(page, searchTerm);
  };

  // Handle pagination for completed campaigns
  const handleCompletedCampaignsPageChange = (page: number): void => {
    fetchCompletedCampaigns(page, campaignSearchTerm);
  };

  // Perform user-level actions (lock/unlock)
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
        setActionDialog({
          open: false,
          action: '',
          user: null,
          campaign: null,
        });
        setReason('');
        fetchLockedUsers(lockedUsersPagination.currentPage, searchTerm);

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

  // Reset specific campaign transfers
  const resetCampaignTransfers = async (
    userId: number,
    campaignId: number,
    reason: string = '',
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admin/transfer_locks/${userId}/reset_campaign_transfers`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            reason: reason,
          }),
        },
      );

      if (response.ok) {
        const result: ActionResponse = await response.json();
        toast.success(result.message);
        setActionDialog({
          open: false,
          action: '',
          user: null,
          campaign: null,
        });
        setReason('');

        // Refresh all data
        fetchLockedUsers(lockedUsersPagination.currentPage, searchTerm);
        fetchCompletedCampaigns(completedCampaignsPagination.currentPage, campaignSearchTerm);

        // Clear selected user if it was the one we acted upon
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
      } else {
        const error: ActionResponse = await response.json();
        toast.error(error.error || 'Failed to reset campaign transfers');
      }
    } catch (error) {
      console.error('Error resetting campaign transfers:', error);
      toast.error('Error resetting campaign transfers');
    }
  };

  // Helper function to create AdminUser from FundraiserDetailsType
  const createAdminUserFromFundraiser = (
    fundraiser: FundraiserDetailsType,
  ): AdminUser => {
    return {
      id: fundraiser.id,
      full_name: fundraiser.name || 'Unknown',
      email: fundraiser.profile?.name || 'No email', // Using profile name as fallback
      transfer_locked: false,
      total_transferred_amount: 0,
      currency_symbol: fundraiser.currency_symbol,
      // Add other required properties from LoginUserType with defaults
      admin: false,
      status: 'active',
      phone_number: '',
      phone_code: '',
      country: '',
      payment_method: '',
      mobile_money_provider: '',
      currency: fundraiser.currency,
      birth_date: '',
      category: '',
      target_amount: '0',
      created_at: fundraiser.created_at,
      updated_at: fundraiser.updated_at,
      // Add missing required properties with default values
      password_digest: '',
      duration_in_days: 0,
      national_id: '',
    };
  };

  const openActionDialog = (
    action: 'lock' | 'unlock' | 'reset_transfers' | 'reset_campaign_transfers',
    user: AdminUser,
    campaign?: CampaignResponseDataType | null,
  ): void => {
    setActionDialog({ open: true, action, user, campaign });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type: 'user' | 'campaign'): void => {
    if (e.key === 'Enter') {
      if (type === 'user') {
        handleLockedUsersSearch();
      } else {
        handleCompletedCampaignsSearch();
      }
    }
  };

  // Reset search for locked users
  const resetLockedUsersSearch = (): void => {
    setSearchTerm('');
    fetchLockedUsers(1, '');
  };

  // Reset search for completed campaigns
  const resetCompletedCampaignsSearch = (): void => {
    setCampaignSearchTerm('');
    fetchCompletedCampaigns(1, '');
  };

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open) {
      setActionDialog({ open: false, action: '', user: null, campaign: null });
      setReason('');
    }
  };

  // Pagination Component
  const PaginationControls: React.FC<{
    pagination: PaginationState;
    onPageChange: (page: number) => void;
    loading: boolean;
  }> = ({ pagination, onPageChange, loading }) => {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-600">
          Showing page {pagination.currentPage} of {pagination.totalPages} 
          {pagination.totalCount > 0 && (
            <> ({pagination.totalCount.toLocaleString()} total records)</>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

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
              onKeyDown={(e) => handleKeyPress(e, 'user')}
              className="flex-1"
            />
            <Button onClick={searchUsers} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search User
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
                        Locked by: {selectedUser.transfer_lock_info.locked_by}
                      </p>
                      <p>
                        Reason:{' '}
                        {selectedUser.transfer_lock_info.reason ||
                          'No reason provided'}
                      </p>
                      <p>
                        Locked at:{' '}
                        {selectedUser.transfer_lock_info.locked_at
                          ? new Date(
                              selectedUser.transfer_lock_info.locked_at,
                            ).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  )}

                  {/* Show user's campaigns */}
                  {selectedUser.campaigns &&
                    selectedUser.campaigns.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm mb-2">Campaigns:</h4>
                        <div className="space-y-2">
                          {selectedUser.campaigns.map((campaign) => (
                            <div
                              key={campaign.id}
                              className="flex justify-between items-center text-sm border-b pb-1"
                            >
                              <span className="truncate flex-1 mr-2">
                                {campaign.title}
                              </span>
                              <span className="font-medium">
                                {campaign.currency_symbol}{' '}
                                {campaign.transferred_amount?.toLocaleString()}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  openActionDialog(
                                    'reset_campaign_transfers',
                                    selectedUser,
                                    campaign,
                                  )
                                }
                                className="ml-2"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
                    </>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
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

      {/* Completed Campaigns Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Completed Campaigns with Funds</CardTitle>
              <CardDescription>
                Campaigns that have ended but still have transferred amounts
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (!showCompletedCampaigns) {
                  fetchCompletedCampaigns();
                } else {
                  setShowCompletedCampaigns(false);
                }
              }}
              disabled={campaignsLoading}
            >
              {showCompletedCampaigns ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showCompletedCampaigns ? 'Hide' : 'Show'} Completed Campaigns
            </Button>
          </div>
        </CardHeader>
        {showCompletedCampaigns && (
          <CardContent>
            {/* Completed Campaigns Search */}
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search by fundraiser name or goal amount..."
                value={campaignSearchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCampaignSearchTerm(e.target.value)
                }
                onKeyDown={(e) => handleKeyPress(e, 'campaign')}
                className="flex-1"
              />
              <Button 
                onClick={handleCompletedCampaignsSearch} 
                disabled={campaignsLoading}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Campaigns
              </Button>
              {campaignSearchTerm && (
                <Button 
                  variant="outline" 
                  onClick={resetCompletedCampaignsSearch}
                  disabled={campaignsLoading}
                >
                  Clear
                </Button>
              )}
            </div>

            {campaignsLoading ? (
              <div className="text-center py-4">
                Loading completed campaigns...
              </div>
            ) : completedCampaigns.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {campaignSearchTerm 
                  ? 'No completed campaigns found matching your search'
                  : 'No completed campaigns with transferred amounts found'
                }
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Campaign</TableHead>
                      <TableHead className="w-[200px]">Fundraiser</TableHead>
                      <TableHead className="w-[150px]">Goal Amount</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[150px]">
                        Transferred Amount
                      </TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.title}</div>
                            <div className="text-sm text-gray-600">
                              Ended:{' '}
                              {new Date(campaign.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {campaign.fundraiser.name}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {campaign.currency_symbol}{' '}
                          {campaign.goal_amount?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              campaign.status === 'completed'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {campaign.currency_symbol}{' '}
                          {campaign.transferred_amount?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const adminUser = createAdminUserFromFundraiser(
                                campaign.fundraiser,
                              );
                              openActionDialog(
                                'reset_campaign_transfers',
                                adminUser,
                                campaign,
                              );
                            }}
                            className="whitespace-nowrap"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Completed Campaigns Pagination */}
                <PaginationControls
                  pagination={completedCampaignsPagination}
                  onPageChange={handleCompletedCampaignsPageChange}
                  loading={campaignsLoading}
                />
              </>
            )}
          </CardContent>
        )}
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
          {/* Locked Users Search */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              onKeyDown={(e) => handleKeyPress(e, 'user')}
              className="flex-1"
            />
            <Button 
              onClick={handleLockedUsersSearch} 
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Users
            </Button>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={resetLockedUsersSearch}
                disabled={loading}
              >
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : lockedUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchTerm 
                ? 'No locked users found matching your search'
                : 'No users with locked transfers'
              }
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead className="w-[120px]">Locked By</TableHead>
                    <TableHead className="min-w-[150px]">Reason</TableHead>
                    <TableHead className="w-[150px]">Locked At</TableHead>
                    <TableHead className="w-[140px]">Total Transferred</TableHead>
                    <TableHead className="w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lockedUsers.map((user: AdminUser) => (
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
                        {user.transfer_lock_info?.locked_by || 'System'}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">
                          {user.transfer_lock_info?.reason ||
                            'No reason provided'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.transfer_lock_info?.locked_at
                          ? new Date(
                              user.transfer_lock_info.locked_at,
                            ).toLocaleString()
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
                            className="whitespace-nowrap"
                          >
                            <Unlock className="w-3 h-3 mr-1" />
                            Unlock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Locked Users Pagination */}
              <PaginationControls
                pagination={lockedUsersPagination}
                onPageChange={handleLockedUsersPageChange}
                loading={loading}
              />
            </>
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
                'Reset All Transferred Amounts'}
              {actionDialog.action === 'reset_campaign_transfers' &&
                'Reset Campaign Transferred Amount'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'lock' &&
                `Are you sure you want to lock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'unlock' &&
                `Are you sure you want to unlock transfers for ${actionDialog.user?.full_name}?`}
              {actionDialog.action === 'reset_transfers' &&
                `This will reset ALL transferred amounts to zero for ${actionDialog.user?.full_name}. This action cannot be undone.`}
              {actionDialog.action === 'reset_campaign_transfers' &&
                `This will reset the transferred amount to zero for campaign "${actionDialog.campaign?.title}" by ${actionDialog.user?.full_name}. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {(actionDialog.action === 'lock' ||
            actionDialog.action === 'reset_campaign_transfers') && (
            <div className="space-y-4">
              <label htmlFor="reason" className="block text-sm font-medium">
                Reason{' '}
                {actionDialog.action === 'reset_campaign_transfers'
                  ? '(optional)'
                  : 'for locking transfers (optional)'}
              </label>
              <Input
                id="reason"
                placeholder={
                  actionDialog.action === 'reset_campaign_transfers'
                    ? 'Enter reason for resetting campaign transfers...'
                    : 'Enter reason for locking transfers...'
                }
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
                setActionDialog({
                  open: false,
                  action: '',
                  user: null,
                  campaign: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              className={
                actionDialog.action === 'lock'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : actionDialog.action === 'reset_transfers' ||
                      actionDialog.action === 'reset_campaign_transfers'
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
              onClick={() => {
                if (!actionDialog.user) return;

                if (
                  actionDialog.action === 'reset_campaign_transfers' &&
                  actionDialog.campaign
                ) {
                  resetCampaignTransfers(
                    actionDialog.user.id,
                    actionDialog.campaign.id,
                    reason,
                  );
                } else if (
                  ['lock', 'unlock', 'reset_transfers'].includes(
                    actionDialog.action,
                  )
                ) {
                  performAction(
                    actionDialog.action as
                      | 'lock'
                      | 'unlock'
                      | 'reset_transfers',
                    actionDialog.user.id,
                  );
                }
              }}
              disabled={
                !actionDialog.user ||
                (actionDialog.action === 'reset_campaign_transfers' &&
                  !actionDialog.campaign)
              }
            >
              {actionDialog.action === 'lock' && (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {actionDialog.action === 'unlock' && (
                <Unlock className="w-4 h-4 mr-2" />
              )}
              {(actionDialog.action === 'reset_transfers' ||
                actionDialog.action === 'reset_campaign_transfers') && (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}

              {actionDialog.action === 'lock' && 'Lock Transfers'}
              {actionDialog.action === 'unlock' && 'Unlock Transfers'}
              {actionDialog.action === 'reset_transfers' && 'Reset All Amounts'}
              {actionDialog.action === 'reset_campaign_transfers' &&
                'Reset Campaign Amount'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutsManager;