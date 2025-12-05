'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { Progress } from '@/app/components/ui/progress';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/seperator';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Search,
  Eye,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Crown,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3,
  Filter,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/app/context/auth/AuthContext';
import ToastComponent from '@/app/components/toast/Toast';

interface PremiumUser {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  premium_access: boolean;
  premium_expires_at: string | null;
  premium_plan: {
    id: number;
    name: string;
    price: number;
    currency: string;
    interval: string;
  } | null;
  active_subscription: {
    id: number;
    status: string;
    auto_renew: boolean;
    expires_at: string;
    start_date: string;
    transaction_reference: string;
  } | null;
  all_subscriptions: Array<{
    id: number;
    status: string;
    amount: number;
    currency: string;
    interval: string;
    transaction_reference: string;
    start_date: string;
    expires_at: string;
    created_at: string;
  }>;
  created_at: string;
  days_remaining: number | null;
  status: 'active' | 'expired';
}

interface PremiumPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  interval: string;
}

interface FilterStats {
  active_count: number;
  expired_count: number;
  total_premium: number;
}

interface StatsData {
  overview: {
    total_users: number;
    premium_users: number;
    active_premium: number;
    expired_premium: number;
    premium_percentage: number;
  };
  plan_distribution: Array<{
    plan_id: number;
    plan_name: string;
    count: number;
  }>;
  monthly_growth: Array<{
    month: string;
    count: number;
  }>;
  recent_subscriptions: Array<{
    id: number;
    user_name: string;
    user_email: string;
    plan_name: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
}

const PremiumUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<PremiumUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [premiumPlans, setPremiumPlans] = useState<PremiumPlan[]>([]);
  const [filterStats, setFilterStats] = useState<FilterStats>({
    active_count: 0,
    expired_count: 0,
    total_premium: 0,
  });
  const [stats, setStats] = useState<StatsData | null>(null);
  const [selectedUser, setSelectedUser] = useState<PremiumUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [extendDays, setExtendDays] = useState('30');
  const [activeTab, setActiveTab] = useState('users');

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    title?: string;
    description: string;
    type: 'success' | 'error' | 'warning';
  }>({
    isOpen: false,
    description: '',
    type: 'success',
  });

  const showToast = (
    description: string,
    type: 'success' | 'error' | 'warning',
    title?: string,
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchPremiumUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '20',
        status: statusFilter,
        ...(planFilter && { plan_id: planFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_users?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch premium users');
      }

      const data = await response.json();
      setUsers(data.premium_users);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
      setPremiumPlans(data.premium_plans || []);
      setFilterStats(
        data.filters || {
          active_count: 0,
          expired_count: 0,
          total_premium: 0,
        },
      );
    } catch (error) {
      console.error('Error fetching premium users:', error);
      showToast('Failed to load premium users', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, statusFilter, planFilter, searchTerm]);

  const fetchStats = useCallback(async () => {
    if (!token) return;

    setStatsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_users/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('Failed to load statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchPremiumUsers();
    } else {
      fetchStats();
    }
  }, [activeTab, fetchPremiumUsers, fetchStats]);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchPremiumUsers();
  }, [fetchPremiumUsers]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPlanFilter('');
    setCurrentPage(1);
  };

  const handleViewUser = async (user: PremiumUser) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleExtendPremium = async () => {
    if (!selectedUser || !extendDays || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_users/${selectedUser.id}/manually_extend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ days: parseInt(extendDays) }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extend premium');
      }

      showToast('Premium access extended successfully', 'success');
      setExtendDialogOpen(false);
      fetchPremiumUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Failed to extend premium', 'error');
    }
  };

  const handleRevokePremium = async () => {
    if (!selectedUser || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/members/premium_users/${selectedUser.id}/revoke_premium`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to revoke premium');
      }

      showToast('Premium access revoked successfully', 'success');
      setRevokeDialogOpen(false);
      fetchPremiumUsers();
      fetchStats();
    } catch (error: any) {
      showToast(error.message || 'Failed to revoke premium', 'error');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'GHS',
    }).format(amount);
  };

  const getStatusBadge = (status: string, daysRemaining: number | null) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            {daysRemaining ? `${daysRemaining} days left` : 'Active'}
          </Badge>
        );
      case 'expired':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Expired
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {status}
          </Badge>
        );
    }
  };

  if (loading && activeTab === 'users') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Premium Users Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all premium subscription users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Total: {filterStats.total_premium}
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
          >
            Active: {filterStats.active_count}
          </Badge>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
          >
            Expired: {filterStats.expired_count}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-64">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Premium Users
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Users Tab Content */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Plans</SelectItem>
                      {premiumPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">
                  Showing {users.length} of {totalCount} premium users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Users</CardTitle>
              <CardDescription>
                List of all users with premium subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Users className="h-12 w-12 mb-2" />
                          <h3 className="text-lg font-semibold">
                            No premium users found
                          </h3>
                          <p className="text-sm">
                            {searchTerm || statusFilter !== 'all' || planFilter
                              ? 'Try changing your filters'
                              : 'No users have premium subscriptions yet'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.full_name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.user_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.premium_plan ? (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.premium_plan.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {formatCurrency(
                                  user.premium_plan.price,
                                  user.premium_plan.currency,
                                )}{' '}
                                / {user.premium_plan.interval}
                              </span>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                            >
                              No Plan
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.active_subscription ? (
                            <div className="flex flex-col">
                              <span className="text-sm">
                                Ref:{' '}
                                {user.active_subscription.transaction_reference.substring(
                                  0,
                                  8,
                                )}
                                ...
                              </span>
                              <span className="text-xs text-gray-600">
                                {user.active_subscription.auto_renew
                                  ? 'Auto-renew'
                                  : 'Manual'}
                              </span>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              No Active Sub
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {formatDate(user.premium_expires_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status, user.days_remaining)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewUser(user)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setExtendDialogOpen(true);
                                    }}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Extend Premium</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setRevokeDialogOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Revoke Premium</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>

            {/* Pagination */}
            {totalPages > 1 && (
              <CardFooter className="flex items-center justify-between border-t pt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Statistics Tab Content */}
        <TabsContent value="stats">
          {statsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            stats && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Users
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {stats.overview.total_users.toLocaleString()}
                          </h3>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Premium Users
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {stats.overview.premium_users.toLocaleString()}
                          </h3>
                          <p className="text-sm text-green-600 mt-1">
                            {stats.overview.premium_percentage}% of total
                          </p>
                        </div>
                        <Crown className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Active Premium
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {stats.overview.active_premium.toLocaleString()}
                          </h3>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Expired Premium
                          </p>
                          <h3 className="text-2xl font-bold mt-2">
                            {stats.overview.expired_premium.toLocaleString()}
                          </h3>
                        </div>
                        <XCircle className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plan Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.plan_distribution.map((plan) => (
                        <div key={plan.plan_id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {plan.plan_name}
                            </span>
                            <span className="text-sm text-gray-600">
                              {plan.count} users
                            </span>
                          </div>
                          <Progress
                            value={
                              (plan.count / stats.overview.premium_users) * 100
                            }
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Subscriptions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.recent_subscriptions.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {sub.user_name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {sub.user_email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{sub.plan_name}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {formatCurrency(sub.amount, sub.currency)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  sub.status === 'active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                }
                              >
                                {sub.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {formatDate(sub.created_at)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </TabsContent>
      </Tabs>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              {selectedUser?.full_name}'s Premium Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">User Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Full Name:
                        </span>
                        <span className="font-medium">
                          {selectedUser.full_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span>{selectedUser.phone_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          User Type:
                        </span>
                        <Badge variant="outline">
                          {selectedUser.user_type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Current Plan */}
                  <div>
                    <h4 className="font-semibold mb-3">Current Plan</h4>
                    {selectedUser.premium_plan ? (
                      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <h5 className="text-lg font-bold text-yellow-800">
                              {selectedUser.premium_plan.name}
                            </h5>
                            <p className="text-yellow-700">
                              {formatCurrency(
                                selectedUser.premium_plan.price,
                                selectedUser.premium_plan.currency,
                              )}{' '}
                              / {selectedUser.premium_plan.interval}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <p className="text-gray-500">No active plan</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Active Subscription */}
                {selectedUser.active_subscription && (
                  <div>
                    <h4 className="font-semibold mb-3">Active Subscription</h4>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <Badge
                              variant="outline"
                              className={
                                selectedUser.active_subscription.status ===
                                'active'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }
                            >
                              {selectedUser.active_subscription.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Auto Renew</p>
                            <p className="font-medium">
                              {selectedUser.active_subscription.auto_renew
                                ? 'Yes'
                                : 'No'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Start Date</p>
                            <p className="font-medium">
                              {formatDate(
                                selectedUser.active_subscription.start_date,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Expires</p>
                            <p className="font-medium">
                              {formatDate(
                                selectedUser.active_subscription.expires_at,
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Transaction Reference
                          </p>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {
                              selectedUser.active_subscription
                                .transaction_reference
                            }
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* All Subscriptions */}
                {selectedUser.all_subscriptions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">All Subscriptions</h4>
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Interval</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Reference</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedUser.all_subscriptions.map((sub) => (
                              <TableRow key={sub.id}>
                                <TableCell>
                                  {formatDate(sub.created_at)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(sub.amount, sub.currency)}
                                </TableCell>
                                <TableCell>{sub.interval}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      sub.status === 'active'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }
                                  >
                                    {sub.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs font-mono">
                                    {sub.transaction_reference.substring(0, 10)}
                                    ...
                                  </code>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedUser(selectedUser);
                setRevokeDialogOpen(true);
                setViewDialogOpen(false);
              }}
            >
              Revoke Premium
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setSelectedUser(selectedUser);
                setExtendDialogOpen(true);
                setViewDialogOpen(false);
              }}
            >
              Extend Premium
            </Button>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Premium Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Premium Access</DialogTitle>
            <DialogDescription>
              Extend premium access for{' '}
              <strong>{selectedUser?.full_name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Expiry</Label>
              <p className="text-sm font-semibold">
                {selectedUser?.premium_expires_at
                  ? formatDate(selectedUser.premium_expires_at)
                  : 'No expiry date'}
              </p>
            </div>
            <div>
              <Label htmlFor="extendDays">Days to Extend</Label>
              <Input
                id="extendDays"
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                min="1"
                max="365"
                placeholder="Number of days"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleExtendPremium}>Extend Premium</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Premium Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke Premium Access</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <p>Are you sure you want to revoke premium access from</p>
            <h4 className="font-bold text-lg">{selectedUser?.full_name}</h4>
            <p className="text-sm text-red-600">
              This action cannot be undone. The user will lose all premium
              features immediately.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokePremium}>
              Revoke Premium
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumUsers;
