'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Search, Filter, Mail, Phone, Calendar, Crown } from 'lucide-react';
import { useUserContext } from '@/app/context/users/UserContext';

interface PremiumUser {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
  premium_access: boolean;
  premium_plan_id: number | null;
  premium_expires_at: string | null;
  created_at: string;
  premium_subscriptions?: Array<{
    id: number;
    status: string;
    amount: number;
    currency: string;
    interval: string;
    start_date: string;
    expires_at: string;
    premium_plan: {
      id: number;
      name: string;
      price: number;
      currency: string;
      interval: string;
    } | null;
  }>;
  profile?: {
    name: string;
  };
}

const PremiumUsers = () => {
  const { fetchAllUsers } = useUserContext();
  const [users, setUsers] = useState<PremiumUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadPremiumUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const result = await fetchAllUsers(page, 20, search);

      if (result.users && result.meta) {
        // Since the API doesn't include premium_subscriptions, we'll work with what we have
        // Show users who have premium_access or premium_plan_id
        const premiumUsers = result.users.filter(
          (user: PremiumUser) =>
            user.premium_access === true || user.premium_plan_id !== null,
        );

        setUsers(premiumUsers);
        setTotalPages(result.meta.total_pages);
        setTotalCount(premiumUsers.length); // Use filtered count for display
      }
    } catch (error) {
      console.error('Error loading premium users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPremiumUsers();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadPremiumUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPremiumUsers(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadPremiumUsers(page, searchTerm);
  };

  const getSubscriptionStatus = (user: PremiumUser) => {
    // Check if user has premium access
    if (user.premium_access) {
      if (
        user.premium_expires_at &&
        new Date(user.premium_expires_at) > new Date()
      ) {
        return { status: 'active', expiresAt: user.premium_expires_at };
      } else if (
        user.premium_expires_at &&
        new Date(user.premium_expires_at) <= new Date()
      ) {
        return { status: 'expired', expiresAt: user.premium_expires_at };
      } else {
        return { status: 'active', expiresAt: null }; // No expiry date = permanent access
      }
    }

    // Check premium subscriptions if available
    if (user.premium_subscriptions && user.premium_subscriptions.length > 0) {
      const activeSubscription = user.premium_subscriptions.find(
        (sub) =>
          sub.status === 'active' && new Date(sub.expires_at) > new Date(),
      );

      if (activeSubscription) {
        return { status: 'active', expiresAt: activeSubscription.expires_at };
      }

      const expiredSubscription = user.premium_subscriptions.find(
        (sub) =>
          sub.status === 'active' && new Date(sub.expires_at) <= new Date(),
      );

      if (expiredSubscription) {
        return { status: 'expired', expiresAt: expiredSubscription.expires_at };
      }
    }

    return { status: 'none', expiresAt: null };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        variant: 'default' as const,
        label: 'Active',
        className: 'bg-green-100 text-green-800',
      },
      expired: {
        variant: 'secondary' as const,
        label: 'Expired',
        className: 'bg-yellow-100 text-yellow-800',
      },
      cancelled: {
        variant: 'outline' as const,
        label: 'Cancelled',
        className: 'bg-gray-100 text-gray-800',
      },
      none: {
        variant: 'outline' as const,
        label: 'No Active Sub',
        className: 'bg-gray-100 text-gray-800',
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.none;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPlanName = (user: PremiumUser) => {
    if (user.premium_subscriptions && user.premium_subscriptions.length > 0) {
      const activeSub = user.premium_subscriptions.find(
        (sub) => sub.status === 'active',
      );
      return activeSub?.premium_plan?.name || 'Unknown Plan';
    }

    // Fallback to premium_plan_id based logic
    if (user.premium_plan_id) {
      return `Plan ID: ${user.premium_plan_id}`;
    }

    return 'No plan info';
  };

  const filteredUsers = users.filter((user) => {
    const subscriptionInfo = getSubscriptionStatus(user);

    if (statusFilter !== 'all') {
      if (statusFilter !== subscriptionInfo.status) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Premium Users
          </h1>
          <p className="text-muted-foreground">
            Manage and support users with premium subscriptions
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="none">No Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Premium Subscriptions</CardTitle>
          <CardDescription>
            {filteredUsers.length} users with premium access (out of{' '}
            {totalCount} total users)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                No premium users found with the current filters.
              </div>
              <div className="text-sm text-gray-500">
                {users.length === 0
                  ? 'No users have premium access in the system.'
                  : 'Try changing your search or filter criteria.'}
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>User Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const subscriptionInfo = getSubscriptionStatus(user);

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {user.full_name}
                              {user.premium_access && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2" />
                              {user.email}
                            </div>
                            {user.phone_number && (
                              <div className="flex items-center text-sm">
                                <Phone className="h-3 w-3 mr-2" />
                                {user.phone_number}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPlanName(user)}</TableCell>
                        <TableCell>
                          {getStatusBadge(subscriptionInfo.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-2" />
                            {formatDate(subscriptionInfo.expiresAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'default'
                                : 'destructive'
                            }
                            className={
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Contact
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumUsers;
