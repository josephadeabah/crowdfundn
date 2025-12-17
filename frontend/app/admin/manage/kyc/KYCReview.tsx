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
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  User,
  Building,
  FileText,
  RefreshCw,
  Mail,
  Calendar,
  MapPin,
  FileQuestion,
  Users,
  DollarSign,
  TrendingUp,
  Check,
  X,
  Shield,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import ToastComponent from '@/app/components/toast/Toast';
import Pagination from '@/app/components/pagination/Pagination';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';

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
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  // Toast states
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  useEffect(() => {
    fetchReviews({}, currentPage);
    fetchStats();
  }, [fetchReviews, fetchStats, currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof typeof filters];
      updateFilters(newFilters);
      setCurrentPage(1);
    } else {
      updateFilters({ ...filters, [key]: value });
      setCurrentPage(1);
    }
  };

  const handleSearch = () => {
    updateFilters({ ...filters, search: searchTerm });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const newFilters = { ...filters };
    delete newFilters.search;
    updateFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReviews(filters, page);
  };

  const handleAction = async () => {
    if (!selectedReview || !actionDialog.action) return;

    try {
      await updateReview(selectedReview.id, {
        action: actionDialog.action,
        rejection_reason:
          actionDialog.action === 'reject' ? rejectionReason : undefined,
        review_notes:
          actionDialog.action === 'verify' ? reviewNotes : undefined,
      });

      showToast(
        'Success',
        `KYC has been ${actionDialog.action}ed successfully`,
        'success',
      );

      setActionDialog({ open: false, action: null });
      setRejectionReason('');
      setReviewNotes('');
      fetchReviews(filters, currentPage);
      fetchStats();
    } catch (error: any) {
      showToast('Error', 'Failed to update KYC review', 'error');
    }
  };

  const handleRefresh = () => {
    fetchReviews(filters, currentPage);
    fetchStats();
    showToast('Refreshed', 'KYC list has been refreshed', 'success');
  };

  const toggleExpand = (reviewId: number) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
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

  // Helper function to display boolean declarations
  const renderDeclarationStatus = (value: boolean) => (
    <span
      className={`flex items-center ${value ? 'text-green-600' : 'text-red-600'}`}
    >
      {value ? (
        <Check className="h-4 w-4 mr-1" />
      ) : (
        <X className="h-4 w-4 mr-1" />
      )}
      {value ? 'Accepted' : 'Not Accepted'}
    </span>
  );

  // Component to show declarations section
  const DeclarationsSection = ({ review }: { review: any }) => {
    const declarations = [
      {
        label: 'Accredited Investor',
        value: review.accredited_investor,
        required: false,
        description: 'User declared as accredited investor',
      },
      {
        label: 'Nominee Agreement',
        value: review.nominee_agreement_accepted,
        required: false,
        description: 'Accepted nominee agreement terms',
      },
      {
        label: 'Risk Acknowledgment',
        value: review.risk_acknowledgment,
        required: true,
        description: 'Acknowledged investment risks',
      },
      {
        label: 'Terms & Conditions',
        value: review.terms_accepted,
        required: true,
        description: 'Accepted platform terms and conditions',
      },
      {
        label: 'Data Processing Consent',
        value: review.data_consent,
        required: true,
        description: 'Consented to data processing',
      },
    ];

    const requiredDeclarations = declarations.filter((d) => d.required);
    const optionalDeclarations = declarations.filter((d) => !d.required);
    const allRequiredAccepted = requiredDeclarations.every((d) => d.value);

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium flex items-center">
            <FileCheck className="h-4 w-4 mr-2 text-blue-600" />
            Declarations & Agreements
          </h4>
          <Badge
            variant={allRequiredAccepted ? 'default' : 'destructive'}
            className={
              allRequiredAccepted
                ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
                : ''
            }
          >
            {allRequiredAccepted ? 'All Required Accepted' : 'Missing Required'}
          </Badge>
        </div>

        {/* Required Declarations */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Shield className="h-3 w-3 mr-1 text-red-500" />
            Required Declarations
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requiredDeclarations.map((declaration, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div>
                  <div className="font-medium text-sm">{declaration.label}</div>
                  <div className="text-xs text-gray-500">
                    {declaration.description}
                  </div>
                </div>
                {renderDeclarationStatus(declaration.value)}
              </div>
            ))}
          </div>
        </div>

        {/* Optional Declarations */}
        {optionalDeclarations.some((d) => d.value) && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Optional Declarations
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {optionalDeclarations.map((declaration, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {declaration.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {declaration.description}
                    </div>
                  </div>
                  {renderDeclarationStatus(declaration.value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning for missing required declarations */}
        {!allRequiredAccepted && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-700 font-medium">
                User has not accepted all required declarations
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DocumentSection = ({ review }: { review: any }) => {
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-3">Verification Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {review.documents?.map((document: any) => (
            <div key={document.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">
                  {document.document_type.replace('_', ' ')}
                </span>
                <Badge variant="outline" className="text-xs">
                  {document.verification_status}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {document.file_name || 'No file uploaded'}
              </div>
              {document.file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.file_url, '_blank')}
                  className="w-full"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
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

      {/* Stats Cards - Enhanced with declarations stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending + stats.in_review}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.verified}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Investors</p>
                <p className="text-3xl font-bold text-blue-600">
                  {
                    reviews.filter(
                      (r: any) =>
                        r.kyc_type === 'investor' || r.kyc_type === 'both',
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* KYC Applications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>KYC Applications Pending Review</span>
            <span className="text-sm font-normal text-gray-500">
              {pagination.total_count} application(s)
              {loading && ' - Loading...'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                Loading KYC applications...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {Object.keys(filters).length > 0
                  ? 'No KYC applications match your filters'
                  : 'No KYC applications found'}
              </div>
            ) : (
              reviews.map((review) => {
                const isExpanded = expandedReview === review.id;
                const residentialAddress = review.addresses?.find(
                  (addr: any) => addr.address_type === 'residential',
                );

                return (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {review.user?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {review.user?.email || 'No email provided'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reference: {review.reference}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(review.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(review.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        {getKycTypeIcon(review.kyc_type)}
                        <span className="text-sm text-gray-600 capitalize">
                          {review.kyc_type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 capitalize">
                          {review.verification_type?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {review.created_at
                            ? format(
                                new Date(review.created_at),
                                'MMM dd, yyyy',
                              )
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {review.documents?.length || 0} Documents
                        </span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">
                              Personal Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">
                                  Date of Birth:
                                </span>{' '}
                                {review.date_of_birth
                                  ? format(
                                      new Date(review.date_of_birth),
                                      'MMM dd, yyyy',
                                    )
                                  : 'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Nationality:
                                </span>{' '}
                                {review.nationality || 'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Occupation:
                                </span>{' '}
                                {review.occupation || 'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Source of Funds:
                                </span>{' '}
                                {review.source_of_funds || 'Not provided'}
                              </div>
                            </div>
                          </div>

                          {/* Address Information */}
                          {residentialAddress && (
                            <div>
                              <h4 className="font-medium mb-2">Address</h4>
                              <div className="flex items-start space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <div>{residentialAddress.street}</div>
                                  <div>
                                    {residentialAddress.city},{' '}
                                    {residentialAddress.state}
                                  </div>
                                  <div>
                                    {residentialAddress.country}{' '}
                                    {residentialAddress.postal_code &&
                                      `- ${residentialAddress.postal_code}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* NEW: Declarations Section */}
                        {(review.kyc_type === 'investor' ||
                          review.kyc_type === 'both') && (
                          <DeclarationsSection review={review} />
                        )}

                        {/* Business Information (for issuers/both) */}
                        {review.kyc_type !== 'investor' && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Business Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">
                                  Business Name:
                                </span>{' '}
                                {review.business_name || 'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Registration Number:
                                </span>{' '}
                                {review.business_registration_number ||
                                  'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">Tax ID:</span>{' '}
                                {review.business_tax_id || 'Not provided'}
                              </div>
                              <div>
                                <span className="text-gray-600">Industry:</span>{' '}
                                {review.business_industry || 'Not provided'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Documents Section */}
                        <DocumentSection review={review} />

                        {/* Action Buttons */}
                        {(review.status === 'pending' ||
                          review.status === 'in_review') && (
                          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReview(review);
                                setActionDialog({
                                  open: true,
                                  action: 'request_info',
                                });
                              }}
                            >
                              <FileQuestion className="w-4 h-4 mr-2" />
                              Request Info
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedReview(review);
                                setActionDialog({
                                  open: true,
                                  action: 'reject',
                                });
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedReview(review);
                                setActionDialog({
                                  open: true,
                                  action: 'verify',
                                });
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verify
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <AlertPopup
        title={
          actionDialog.action === 'verify'
            ? 'Verify KYC Application'
            : actionDialog.action === 'reject'
              ? 'Reject KYC Application'
              : 'Request Additional Information'
        }
        message={
          <div className="space-y-4">
            <p>
              {actionDialog.action === 'verify' &&
                `Are you sure you want to verify ${selectedReview?.user?.full_name || 'this user'}'s KYC application?`}
              {actionDialog.action === 'reject' &&
                `Please provide a reason for rejecting ${selectedReview?.user?.full_name || 'this user'}'s KYC application.`}
              {actionDialog.action === 'request_info' &&
                `Request additional information from ${selectedReview?.user?.full_name || 'the user'}.`}
            </p>

            {actionDialog.action === 'verify' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add any notes about this verification..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {actionDialog.action === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Rejection *
                </label>
                <Textarea
                  placeholder="Provide a clear reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            )}
          </div>
        }
        isOpen={actionDialog.open}
        setIsOpen={(open) => {
          setActionDialog({ open, action: null });
          setRejectionReason('');
          setReviewNotes('');
        }}
        onConfirm={handleAction}
        onCancel={() => {
          setActionDialog({ open: false, action: null });
          setRejectionReason('');
          setReviewNotes('');
        }}
        confirmText={
          actionDialog.action === 'verify'
            ? 'Verify'
            : actionDialog.action === 'reject'
              ? 'Reject'
              : 'Request Info'
        }
        confirmDisabled={
          actionDialog.action === 'reject' && !rejectionReason.trim()
        }
        confirmButtonClass={
          actionDialog.action === 'verify'
            ? 'bg-green-600 hover:bg-green-700'
            : actionDialog.action === 'reject'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
        }
      />
    </div>
  );
};

export default KYCReview;
