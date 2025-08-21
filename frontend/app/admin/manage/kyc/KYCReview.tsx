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
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/app/components/ui/sonner';

const KYCReview = () => {
  const {
    reviews,
    loading,
    error,
    stats,
    filters,
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

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [fetchReviews, fetchStats]);

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    updateFilters({ ...filters, search: searchTerm });
  };

  const handleAction = async () => {
    if (!selectedReview || !actionDialog.action) return;

    try {
      // Use the correct function signature
      await updateReview(selectedReview.id, {
        action: actionDialog.action,
        rejection_reason:
          actionDialog.action === 'reject' ? rejectionReason : undefined,
        notes: actionDialog.action === 'verify' ? reviewNotes : undefined,
      });

      toast.success(`KYC ${actionDialog.action}ed successfully`);
      setActionDialog({ open: false, action: null });
      setRejectionReason('');
      setReviewNotes('');
    } catch (error) {
      toast.error('Failed to update KYC review');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock },
      in_review: { variant: 'default', icon: Eye },
      verified: { variant: 'success', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle },
      expired: { variant: 'outline', icon: Clock },
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KYC Review</h1>
          <p className="text-muted-foreground">
            Manage and review user verification requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <CardDescription className="text-2xl font-bold">
              {stats.total}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CardDescription className="text-2xl font-bold text-amber-500">
              {stats.pending}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-500">
              {stats.in_review}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CardDescription className="text-2xl font-bold text-green-500">
              {stats.verified}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <CardDescription className="text-2xl font-bold text-red-500">
              {stats.rejected}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-500">
              {stats.expired}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or ID number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.kyc_type || ''}
              onValueChange={(value) => handleFilterChange('kyc_type', value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="KYC Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="issuer">Issuer</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Applications</CardTitle>
          <CardDescription>
            {reviews.length} application(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>ID Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No KYC applications found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-mono">
                      {review.reference}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.user_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getKycTypeIcon(review.kyc_type)}
                        {review.kyc_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.verification_type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      {format(new Date(review.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              // View details logic
                              window.open(`/admin/kyc/${review.id}`, '_blank');
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {review.status === 'pending' ||
                          review.status === 'in_review' ? (
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedReview(review);
                                  setActionDialog({
                                    open: true,
                                    action: 'request_info',
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Request Info
                              </DropdownMenuItem>
                            </>
                          ) : null}
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
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ open, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'verify' && 'Verify KYC Application'}
              {actionDialog.action === 'reject' && 'Reject KYC Application'}
              {actionDialog.action === 'request_info' &&
                'Request Additional Information'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === 'verify' &&
                'Are you sure you want to verify this KYC application?'}
              {actionDialog.action === 'reject' &&
                'Please provide a reason for rejecting this KYC application.'}
              {actionDialog.action === 'request_info' &&
                'Request additional information from the user.'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === 'verify' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Add review notes (optional)"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
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
              />
            </div>
          )}

          {actionDialog.action === 'request_info' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                An email will be sent to the user requesting additional
                information.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                actionDialog.action === 'reject' && !rejectionReason.trim()
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCReview;
