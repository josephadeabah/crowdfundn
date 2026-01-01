// app/components/investor-reporting/InvestorReportsModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Eye,
  Filter,
  Search,
  Bell,
  Share2,
  Bookmark,
  Clock,
  TrendingUp,
  Users,
  Building,
} from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '../ui/Skeleton';
import { formatDate } from '@/app/utils/helpers/formatters';
import { investorReportingService } from './services/investor-reporting.service';
import { useAuth } from '@/app/context/auth/AuthContext';

interface InvestorReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InvestorReport {
  id: number;
  title: string;
  report_type: string;
  report_date: string;
  period_start?: string;
  period_end?: string;
  period_description: string;
  executive_summary?: string;
  key_highlights?: string;
  challenges_risks?: string;
  forward_outlook?: string;
  status: string;
  notify_investors: boolean;
  published_at: string;
  published_by_name?: string;
  download_count: number;
  campaign: {
    id: number;
    name: string;
    company_name: string;
  };
  documents: Array<{
    id: number;
    document_type: string;
    title: string;
    file_url?: string;
    file_name?: string;
    file_size?: string;
  }>;
}

const InvestorReportsModal: React.FC<InvestorReportsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { token } = useAuth();
  const [reports, setReports] = useState<InvestorReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<InvestorReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportType, setReportType] = useState('all');
  const [timePeriod, setTimePeriod] = useState('all');
  const [selectedReport, setSelectedReport] = useState<InvestorReport | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    if (token) {
      investorReportingService.setToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery, reportType, timePeriod]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await investorReportingService.getInvestorReports();

      if (response?.success) {
        setReports(response?.reports ?? []);
        if (response?.reports?.length > 0) {
          setSelectedReport(response?.reports?.[0] ?? null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error?.message || 'Failed to load investor reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          report?.campaign?.company_name
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase()) ||
          report?.executive_summary
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase()),
      );
    }

    // Apply report type filter
    if (reportType !== 'all') {
      filtered = filtered.filter(
        (report) => report?.report_type === reportType,
      );
    }

    // Apply time period filter
    if (timePeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timePeriod) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (report) => new Date(report?.published_at) >= cutoffDate,
      );
    }

    setFilteredReports(filtered);
  };

  const handleDownloadReport = async (
    reportId: number,
    documentId?: number,
  ) => {
    try {
      const idToDownload = documentId || reportId;

      // First try to get document info
      const response =
        await investorReportingService.getDocumentInfo(idToDownload);

      if (response?.success && response?.document?.file_url) {
        // If we have a direct file URL, open it
        window.open(response.document.file_url, '_blank');
        toast.success('Opening document...');
      } else {
        // Otherwise use the download endpoint
        await investorReportingService.downloadDocument(idToDownload);
        toast.success('Download initiated');
      }
    } catch (error: any) {
      console.error('Error downloading report:', error);

      if (error?.message?.includes('Document not found')) {
        toast.error('Document not found');
      } else {
        toast.error(error?.message || 'Failed to download report');
      }
    }
  };

  const getReportTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      quarterly: 'text-blue-600 bg-blue-100',
      annual: 'text-green-600 bg-green-100',
      monthly: 'text-purple-600 bg-purple-100',
      valuation_update: 'text-orange-600 bg-orange-100',
      special: 'text-red-600 bg-red-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getReportTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      quarterly: <FileText className="h-4 w-4" />,
      annual: <FileText className="h-4 w-4" />,
      monthly: <Calendar className="h-4 w-4" />,
      valuation_update: <TrendingUp className="h-4 w-4" />,
      special: <Bell className="h-4 w-4" />,
    };
    return icons[type] || <FileText className="h-4 w-4" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxxlarge"
      closeOnBackdropClick={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Investor Reports</h2>
            <p className="text-muted-foreground">
              Access reports and updates from your portfolio companies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="valuation_update">
                      Valuation Updates
                    </SelectItem>
                    <SelectItem value="special">Special Reports</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div
            className={`${viewMode === 'grid' ? 'lg:col-span-3' : 'lg:col-span-2'}`}
          >
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredReports?.length > 0 ? (
              viewMode === 'list' ? (
                <div className="space-y-4">
                  {filteredReports?.map((report) => (
                    <Card
                      key={report?.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${selectedReport?.id === report?.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={getReportTypeColor(
                                      report?.report_type,
                                    )}
                                  >
                                    <span className="flex items-center gap-1">
                                      {getReportTypeIcon(report?.report_type)}
                                      {report?.report_type
                                        ?.replace('_', ' ')
                                        ?.charAt(0)
                                        ?.toUpperCase() +
                                        report?.report_type
                                          ?.replace('_', ' ')
                                          ?.slice(1)}
                                    </span>
                                  </Badge>
                                  <Badge variant="secondary">
                                    {report?.download_count} downloads
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                  {report?.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                  <Building className="h-3 w-3" />
                                  <span>{report?.campaign?.company_name}</span>
                                  <span>•</span>
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(report?.report_date)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {report?.executive_summary ||
                                    report?.key_highlights}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadReport(report?.id);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReport(report);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredReports?.map((report) => (
                    <Card
                      key={report?.id}
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={getReportTypeColor(
                                report?.report_type,
                              )}
                            >
                              <span className="flex items-center gap-1">
                                {getReportTypeIcon(report?.report_type)}
                                {report?.report_type?.charAt(0)?.toUpperCase()}
                              </span>
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {report?.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Building className="h-3 w-3" />
                              <span className="line-clamp-1">
                                {report?.campaign?.company_name}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {report?.executive_summary ||
                                report?.key_highlights}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {formatDate(report?.report_date, 'MMM dd')}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      No reports found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery ||
                      reportType !== 'all' ||
                      timePeriod !== 'all'
                        ? 'Try adjusting your filters'
                        : 'No reports have been published yet'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Report Details (only in list view) */}
          {viewMode === 'list' && (
            <div className="lg:col-span-1">
              {selectedReport ? (
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                    <CardDescription>
                      {selectedReport?.campaign?.company_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Overview</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedReport?.executive_summary ||
                            selectedReport?.key_highlights}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Report Type
                          </span>
                          <span className="font-medium capitalize">
                            {selectedReport?.report_type?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Period</span>
                          <span className="font-medium">
                            {selectedReport?.period_description}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Published
                          </span>
                          <span className="font-medium">
                            {formatDate(selectedReport?.published_at)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Published By
                          </span>
                          <span className="font-medium">
                            {selectedReport?.published_by_name || 'System'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Downloads
                          </span>
                          <span className="font-medium">
                            {selectedReport?.download_count}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedReport?.documents &&
                      selectedReport?.documents?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Available Documents</h4>
                          <div className="space-y-2">
                            {selectedReport?.documents?.map((doc) => (
                              <div
                                key={doc?.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                onClick={() =>
                                  handleDownloadReport(
                                    selectedReport?.id,
                                    doc?.id,
                                  )
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <div>
                                    <div className="text-sm font-medium">
                                      {doc?.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {doc?.file_size}
                                    </div>
                                  </div>
                                </div>
                                <Download className="h-4 w-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="space-y-3">
                      <h4 className="font-medium">Key Highlights</h4>
                      <div className="space-y-2">
                        {selectedReport?.key_highlights ? (
                          <div className="text-sm text-muted-foreground">
                            {selectedReport?.key_highlights}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            No highlights provided
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleDownloadReport(selectedReport?.id)}
                        variant="success"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">
                        Select a Report
                      </h3>
                      <p className="text-muted-foreground">
                        Choose a report from the list to view details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredReports?.length} of {reports?.length} reports
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvestorReportsModal;
