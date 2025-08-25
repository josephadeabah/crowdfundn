// app/components/admin/kyc/KYCReview.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useKycReview } from '@/app/context/kyc/KycReviewContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  User,
  Building,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import Pagination from '@/app/components/pagination/Pagination';

const KYCReview = () => {
  const {
    reviews,
    loading,
    error,
    stats,
    filters,
    pagination,
    fetchReviews,
    updateReview,
    updateFilters,
    clearFilters,
    fetchStats,
  } = useKycReview();

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'verify' | 'reject' | 'request_info' | null;
  }>({ open: false, action: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Alert popup states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState<React.ReactNode>('');
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  useEffect(() => {
    fetchReviews({}, currentPage);
    fetchStats();
  }, [fetchReviews, fetchStats, currentPage]);

  const showAlert = (
    title: string,
    message: React.ReactNode,
    action: () => void,
    error?: string,
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertError(error || null);
    setAlertAction(() => action);
    setAlertOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      // Remove the filter when 'all' is selected
      const newFilters = { ...filters };
      delete newFilters[key as keyof typeof filters];
      updateFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    } else {
      updateFilters({ ...filters, [key]: value });
      setCurrentPage(1); // Reset to first page when filters change
    }
  };

  const handleSearch = () => {
    updateFilters({ ...filters, search: searchTerm });
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const newFilters = { ...filters };
    delete newFilters.search;
    updateFilters(newFilters);
    setCurrentPage(1); // Reset to first page when clearing search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReviews(filters, page);
  };

  const handleAction = async () => {
    if (!selectedReview || !actionDialog.action) return;

    try {
      setAlertLoading(true);
      await updateReview(selectedReview.id, {
        action: actionDialog.action,
        rejection_reason:
          actionDialog.action === 'reject' ? rejectionReason : undefined,
        review_notes:
          actionDialog.action === 'verify' ? reviewNotes : undefined,
      });

      showAlert(
        'Success',
        `KYC has been ${actionDialog.action}ed successfully`,
        () => {
          setActionDialog({ open: false, action: null });
          setRejectionReason('');
          setReviewNotes('');
          fetchReviews(filters, currentPage); // Refresh current page
          fetchStats();
        },
      );
    } catch (error: any) {
      showAlert(
        'Error',
        'Failed to update KYC review',
        () => setActionDialog({ open: false, action: null }),
        error.message,
      );
    } finally {
      setAlertLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchReviews(filters, currentPage);
    fetchStats();
    showAlert('Refreshed', 'KYC list has been refreshed', () => {});
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, color: 'text-amber-500' },
      in_review: { variant: 'default', icon: Eye, color: 'text-blue-500' },
      verified: {
        variant: 'success',
        icon: CheckCircle,
        color: 'text-green-500',
      },
      rejected: {
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-500',
      },
      expired: { variant: 'outline', icon: Clock, color: 'text-gray-500' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getKycTypeIcon = (kycType: string) => {
    const icons = {
      investor: User,
      issuer: Building,
      both: FileText,
    };

    const Icon = icons[kycType as keyof typeof icons] || User;
    return <Icon className="h-4 w-4" />;
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">{error}</div>
            <div className="text-center mt-4">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Alert Popup */}
      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={alertOpen}
        setIsOpen={setAlertOpen}
        onConfirm={alertAction}
        error={alertError}
        loading={alertLoading}
        confirmText="OK"
        confirmButtonClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KYC Review</h1>
          <p className="text-muted-foreground">
            Manage and review user verification requests
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { key: 'total', label: 'Total', value: stats.total },
          {
            key: 'pending',
            label: 'Pending',
            value: stats.pending,
            color: 'text-amber-500',
          },
          {
            key: 'in_review',
            label: 'In Review',
            value: stats.in_review,
            color: 'text-blue-500',
          },
          {
            key: 'verified',
            label: 'Verified',
            value: stats.verified,
            color: 'text-green-500',
          },
          {
            key: 'rejected',
            label: 'Rejected',
            value: stats.rejected,
            color: 'text-red-500',
          },
          {
            key: 'expired',
            label: 'Expired',
            value: stats.expired,
            color: 'text-gray-500',
          },
        ].map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <CardDescription
                className={`text-2xl font-bold ${stat.color || ''}`}
              >
                {stat.value}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" onClick={clearFilters} size="sm">
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
                {searchTerm && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">KYC Type</label>
              <Select
                value={filters.kyc_type || ''}
                onValueChange={(value) => handleFilterChange('kyc_type', value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="issuer">Issuer</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>KYC Applications</CardTitle>
            <CardDescription>
              {pagination.total_count} application(s) found
              {loading && ' - Loading...'}
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>ID Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3">
                          Loading KYC applications...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {Object.keys(filters).length > 0
                          ? 'No KYC applications match your filters'
                          : 'No KYC applications found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono text-sm">
                        {review.reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {review.user?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.user?.email || 'No email'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getKycTypeIcon(review.kyc_type)}
                          <span className="capitalize">{review.kyc_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">
                          {review.verification_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        {review.created_at
                          ? format(new Date(review.created_at), 'MMM dd, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                window.open(
                                  `/admin/manage/kyc/${review.id}`,
                                  '_blank',
                                );
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {(review.status === 'pending' ||
                              review.status === 'in_review') && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setActionDialog({
                                      open: true,
                                      action: 'verify',
                                    });
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setActionDialog({
                                      open: true,
                                      action: 'reject',
                                    });
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Documents
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="border-t">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => {
          setActionDialog({ open, action: null });
          setRejectionReason('');
          setReviewNotes('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'verify' && 'Verify KYC Application'}
              {actionDialog.action === 'reject' && 'Reject KYC Application'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'verify' &&
                'Are you sure you want to verify this KYC application?'}
              {actionDialog.action === 'reject' &&
                'Please provide a reason for rejecting this KYC application.'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === 'verify' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add review notes (optional)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {actionDialog.action === 'reject' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Reason for rejection *"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                This reason will be included in the rejection email sent to the
                user.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog({ open: false, action: null });
                setRejectionReason('');
                setReviewNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                actionDialog.action === 'reject' && !rejectionReason.trim()
              }
            >
              {actionDialog.action === 'verify' ? 'Verify' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCReview;
