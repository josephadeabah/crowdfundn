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
} from 'lucide-react';
import { format } from 'date-fns';
import ToastComponent from '@/app/components/toast/Toast';
import Pagination from '@/app/components/pagination/Pagination';

interface KYC {
  id: number;
  reference: string;
  kyc_type: string;
  status: string;
  verification_type: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
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
        ...filters
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
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3">Loading KYC records...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : kycs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {Object.keys(filters).length > 0
                          ? 'No KYC records match your filters'
                          : 'No KYC records found'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  kycs.map((kyc) => (
                    <TableRow key={kyc.id}>
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
                          {kyc.verification_type?.replace('_', ' ') || 'N/A'}
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
                              onClick={() => {
                                window.open(
                                  `/admin/manage/kyc/${kyc.id}`,
                                  '_blank',
                                );
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Open user profile
                                window.open(
                                  `/admin/users/${kyc.user?.id}`,
                                  '_blank',
                                );
                              }}
                            >
                              <User className="h-4 w-4 mr-2" />
                              View User Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Download documents
                                window.open(
                                  `/admin/kyc/${kyc.id}/documents`,
                                  '_blank',
                                );
                              }}
                            >
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
    </div>
  );
};

export default AllKYCs;
