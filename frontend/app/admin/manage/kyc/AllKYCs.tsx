// app/components/admin/kyc/AllKYCs.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
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
  FileDown,
  Shield,
  Mail,
  Calendar,
  MapPin,
  FileQuestion,
  Check,
  X,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileUp,
} from 'lucide-react';
import { format } from 'date-fns';
import ToastComponent from '@/app/components/toast/Toast';
import Pagination from '@/app/components/pagination/Pagination';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

interface KYC {
  id: number;
  reference: string;
  kyc_type: string;
  status: string;
  verification_type: string;
  id_number: string;
  date_of_birth: string;
  nationality: string;
  occupation: string;
  source_of_funds: string;
  business_name: string;
  business_registration_number: string;
  business_tax_id: string;
  business_industry: string;
  business_established_date: string;
  accredited_investor: boolean;
  nominee_agreement_accepted: boolean;
  risk_acknowledgment: boolean;
  terms_accepted: boolean;
  data_consent: boolean;
  created_at: string;
  updated_at: string;
  verified_at: string;
  rejection_reason: string;
  addresses: Array<{
    id: number;
    address_type: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_primary: boolean;
  }>;
  documents: Array<{
    id: number;
    document_type: string;
    file_name: string;
    file_url: string;
    verification_status: string;
  }>;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: null;
  total_pages: number;
  total_count: number;
  per_page: number;
}

const AllKYCs = () => {
  const { token } = useAuth();
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 0,
    per_page: 25,
  });
  const [filters, setFilters] = useState<{
    status?: string;
    kyc_type?: string;
    search?: string;
  }>({
    status: '',
    kyc_type: '',
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedKyc, setExpandedKyc] = useState<number | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KYC | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'verify' | 'reject' | 'request_info' | null;
  }>({ open: false, action: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

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

  const fetchKYCs = async (page: number = 1, filterParams: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '25',
        ...filterParams,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch KYCs');
      }

      const data = await response.json();
      setKycs(data.kycs);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      showToast('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportKYCs = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/export?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to export KYCs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kycs-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Success', 'KYC data exported successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      showToast('Error', errorMessage, 'error');
    }
  };

  // Updated function to export individual KYC using the bulk export endpoint with filtering
  const exportIndividualKYC = async (kyc: KYC) => {
    try {
      // Use the bulk export endpoint but filter for this specific KYC
      const params = new URLSearchParams({
        search: kyc.reference, // Use reference to filter to just this one
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/export?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to export individual KYC');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kyc-${kyc.reference}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast(
        'Success',
        `KYC ${kyc.reference} exported successfully`,
        'success',
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      showToast('Error', errorMessage, 'error');
    }
  };

  const updateKYCStatus = async (kycId: number, action: string, data?: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${kycId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update KYC status');
      }

      showToast('Success', `KYC has been ${action}ed successfully`, 'success');
      fetchKYCs(currentPage, filters);
      setActionDialog({ open: false, action: null });
      setRejectionReason('');
      setReviewNotes('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      showToast('Error', errorMessage, 'error');
    }
  };

  useEffect(() => {
    fetchKYCs(currentPage, filters);
  }, [currentPage, filters]);

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof typeof filters];
      setFilters(newFilters);
      setCurrentPage(1);
    } else {
      setFilters({ ...filters, [key]: value });
      setCurrentPage(1);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const newFilters = { ...filters };
    delete newFilters.search;
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchKYCs(currentPage, filters);
    showToast('Refreshed', 'KYC list has been refreshed', 'success');
  };

  const toggleExpand = (kycId: number) => {
    setExpandedKyc(expandedKyc === kycId ? null : kycId);
  };

  const handleAction = async () => {
    if (!selectedKyc || !actionDialog.action) return;

    await updateKYCStatus(selectedKyc.id, actionDialog.action, {
      rejection_reason:
        actionDialog.action === 'reject' ? rejectionReason : undefined,
      review_notes: actionDialog.action === 'verify' ? reviewNotes : undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, color: 'text-amber-500' },
      in_review: { variant: 'default', icon: Eye, color: 'text-blue-500' },
      verified: {
        variant: 'default',
        icon: CheckCircle,
        color: 'text-green-500',
      },
      rejected: {
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-500',
      },
      expired: { variant: 'outline', icon: Clock, color: 'text-gray-500' },
      superseded: { variant: 'outline', icon: Clock, color: 'text-gray-400' },
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
      mentor: Shield,
    };

    const Icon = icons[kycType as keyof typeof icons] || User;
    return <Icon className="h-4 w-4" />;
  };

  const getKycTypeLabel = (kycType: string) => {
    const labels = {
      investor: 'Investor',
      issuer: 'Issuer',
      both: 'Full Platform',
      mentor: 'Mentor',
    };

    return labels[kycType as keyof typeof labels] || kycType;
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
  const DeclarationsSection = ({ kyc }: { kyc: KYC }) => {
    const declarations = [
      {
        label: 'Accredited Investor',
        value: kyc.accredited_investor,
        required: false,
        description: 'User declared as accredited investor',
      },
      {
        label: 'Nominee Agreement',
        value: kyc.nominee_agreement_accepted,
        required: false,
        description: 'Accepted nominee agreement terms',
      },
      {
        label: 'Risk Acknowledgment',
        value: kyc.risk_acknowledgment,
        required: true,
        description: 'Acknowledged investment risks',
      },
      {
        label: 'Terms & Conditions',
        value: kyc.terms_accepted,
        required: true,
        description: 'Accepted platform terms and conditions',
      },
      {
        label: 'Data Processing Consent',
        value: kyc.data_consent,
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

  const DocumentSection = ({ kyc }: { kyc: KYC }) => {
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-3">Verification Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kyc.documents?.map((document) => (
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
          <h1 className="text-3xl font-bold">All KYC Records</h1>
          <p className="text-muted-foreground">
            Complete database of all user verification records
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportKYCs} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Filters</CardTitle>
          <Button
            variant="ghost"
            onClick={() => {
              setFilters({});
              setSearchTerm('');
              setCurrentPage(1);
            }}
            size="sm"
          >
            Clear All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name, email, reference, or ID number..."
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
                  <SelectItem value="superseded">Superseded</SelectItem>
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
                  <SelectItem value="both">Full Platform</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Records Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>KYC Records</CardTitle>
            <CardDescription>
              {pagination.total_count} record(s) found
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>ID Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3">Loading KYC records...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : kycs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {Object.keys(filters).length > 0
                          ? 'No KYC records match your filters'
                          : 'No KYC records found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  kycs.map((kyc) => {
                    const isExpanded = expandedKyc === kyc.id;
                    const residentialAddress = kyc.addresses?.find(
                      (addr) => addr.address_type === 'residential',
                    );

                    return (
                      <React.Fragment key={kyc.id}>
                        {/* Main Table Row */}
                        <TableRow className="cursor-pointer hover:bg-gray-50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleExpand(kyc.id)}
                              className="h-8 w-8"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {kyc.reference}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {kyc.user?.full_name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {kyc.user?.email || 'No email'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {kyc.user?.id}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getKycTypeIcon(kyc.kyc_type)}
                              <span>{getKycTypeLabel(kyc.kyc_type)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {kyc.verification_type?.replace('_', ' ') ||
                                'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(kyc.status)}</TableCell>
                          <TableCell>
                            {kyc.created_at
                              ? format(new Date(kyc.created_at), 'MMM dd, yyyy')
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {kyc.updated_at
                              ? format(new Date(kyc.updated_at), 'MMM dd, yyyy')
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
                                  onClick={() => toggleExpand(kyc.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  {isExpanded ? 'Hide Details' : 'View Details'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => exportIndividualKYC(kyc)}
                                >
                                  <FileUp className="h-4 w-4 mr-2" />
                                  Export KYC File
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Details Row */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={9} className="p-0">
                              <div className="bg-gray-50 p-6 border-t">
                                <div className="space-y-6">
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
                                          {kyc.date_of_birth
                                            ? format(
                                                new Date(kyc.date_of_birth),
                                                'MMM dd, yyyy',
                                              )
                                            : 'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Nationality:
                                          </span>{' '}
                                          {kyc.nationality || 'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Occupation:
                                          </span>{' '}
                                          {kyc.occupation || 'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Source of Funds:
                                          </span>{' '}
                                          {kyc.source_of_funds ||
                                            'Not provided'}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Address Information */}
                                    {residentialAddress && (
                                      <div>
                                        <h4 className="font-medium mb-2">
                                          Address
                                        </h4>
                                        <div className="flex items-start space-x-2 text-sm">
                                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                          <div>
                                            <div>
                                              {residentialAddress.street}
                                            </div>
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

                                  {/* Declarations Section */}
                                  {(kyc.kyc_type === 'investor' ||
                                    kyc.kyc_type === 'both') && (
                                    <DeclarationsSection kyc={kyc} />
                                  )}

                                  {/* Business Information (for issuers/both) */}
                                  {kyc.kyc_type !== 'investor' && (
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Business Information
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-gray-600">
                                            Business Name:
                                          </span>{' '}
                                          {kyc.business_name || 'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Registration Number:
                                          </span>{' '}
                                          {kyc.business_registration_number ||
                                            'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Tax ID:
                                          </span>{' '}
                                          {kyc.business_tax_id ||
                                            'Not provided'}
                                        </div>
                                        <div>
                                          <span className="text-gray-600">
                                            Industry:
                                          </span>{' '}
                                          {kyc.business_industry ||
                                            'Not provided'}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Documents Section */}
                                  <DocumentSection kyc={kyc} />

                                  {/* Action Buttons for pending reviews */}
                                  {(kyc.status === 'pending' ||
                                    kyc.status === 'in_review') && (
                                    <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedKyc(kyc);
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
                                          setSelectedKyc(kyc);
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
                                          setSelectedKyc(kyc);
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
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
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
                `Are you sure you want to verify ${selectedKyc?.user?.full_name || 'this user'}'s KYC application?`}
              {actionDialog.action === 'reject' &&
                `Please provide a reason for rejecting ${selectedKyc?.user?.full_name || 'this user'}'s KYC application.`}
              {actionDialog.action === 'request_info' &&
                `Request additional information from ${selectedKyc?.user?.full_name || 'the user'}.`}
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

export default AllKYCs;
