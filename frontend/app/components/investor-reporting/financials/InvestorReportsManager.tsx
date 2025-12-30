// app/components/financials/InvestorReportsManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/button/Button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import {
  FiFileText,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiEye,
  FiDownload,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { Skeleton } from '../../ui/Skeleton';
import { financialManagementService } from '../services/financial-management.service';
import { toast } from '../../ui/sonner';
import Modal from '@/app/components/modal/Modal';

interface InvestorReportsManagerProps {
  campaignId: number;
}

const InvestorReportsManager: React.FC<InvestorReportsManagerProps> = ({
  campaignId,
}) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'quarterly',
    title: '',
    executive_summary: '',
    key_highlights: '',
    challenges_risks: '',
    forward_outlook: '',
    report_date: format(new Date(), 'yyyy-MM-dd'),
    period_start: '',
    period_end: '',
    status: 'draft',
    notify_investors: true,
  });

  useEffect(() => {
    fetchReports();
  }, [campaignId]);

  const resetForm = () => {
    setFormData({
      report_type: 'quarterly',
      title: '',
      executive_summary: '',
      key_highlights: '',
      challenges_risks: '',
      forward_outlook: '',
      report_date: format(new Date(), 'yyyy-MM-dd'),
      period_start: '',
      period_end: '',
      status: 'draft',
      notify_investors: true,
    });
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response =
        await financialManagementService.getInvestorReports(campaignId);
      if (response.success) {
        setReports(response.reports || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load investor reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const data = {
        report_type: formData.report_type,
        title: formData.title,
        executive_summary: formData.executive_summary,
        key_highlights: formData.key_highlights,
        challenges_risks: formData.challenges_risks,
        forward_outlook: formData.forward_outlook,
        report_date: formData.report_date,
        period_start: formData.period_start || undefined,
        period_end: formData.period_end || undefined,
        status: formData.status,
        notify_investors: formData.notify_investors,
      };

      const response = await financialManagementService.createInvestorReport(
        campaignId,
        data,
      );

      if (response.success) {
        toast.success('Investor report created successfully');
        setIsCreateModalOpen(false);
        resetForm();
        fetchReports();
      } else {
        toast.error(
          response.errors?.join(', ') || 'Failed to create investor report',
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating investor report');
    }
  };

  const handlePublish = async (reportId: number) => {
    try {
      const response = await financialManagementService.publishInvestorReport(
        campaignId,
        reportId,
      );

      if (response.success) {
        toast.success('Investor report published successfully');
        fetchReports();
      } else {
        toast.error('Failed to publish investor report');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error publishing investor report');
    }
  };

  const handleGenerateQuarterly = async () => {
    try {
      const response =
        await financialManagementService.generateQuarterlyReport(campaignId);

      if (response.success) {
        toast.success('Quarterly report generated successfully');
        fetchReports();
      } else {
        toast.error('Failed to generate quarterly report');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error generating quarterly report');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Archived
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'quarterly':
        return '📊';
      case 'monthly':
        return '📈';
      case 'annual':
        return '📅';
      case 'valuation_update':
        return '💰';
      case 'special':
        return '📢';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Investor Reports</h2>
          <p className="text-gray-600">
            Create and publish reports for your investors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateQuarterly}>
            <FiCalendar className="mr-2 h-4 w-4" />
            Generate Quarterly
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <FiPlus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Investor Reports
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first investor report to keep your investors informed
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <FiPlus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
              <Button variant="outline" onClick={handleGenerateQuarterly}>
                <FiCalendar className="mr-2 h-4 w-4" />
                Generate Quarterly Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {getReportTypeIcon(report.report_type)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      {getStatusBadge(report.status)}
                    </div>

                    <p className="text-gray-600 mb-3">
                      {report.period_description}
                    </p>

                    {report.executive_summary && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {report.executive_summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>
                          {format(new Date(report.report_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers className="h-4 w-4" />
                        <span>{report.download_count || 0} downloads</span>
                      </div>
                      {report.published_by_name && (
                        <div className="text-gray-500">
                          Published by: {report.published_by_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {report.documents?.map((doc: any) => (
                      <Button
                        key={doc.id}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        <FiEye className="mr-2 h-4 w-4" />
                        {doc.document_type}
                      </Button>
                    ))}

                    {report.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(report.id)}
                      >
                        <FiUpload className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Handle view/download
                      }}
                    >
                      <FiDownload className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Report Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create Investor Report"
        size="xlarge"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report_type">Report Type</Label>
              <Select
                value={formData.report_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, report_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Update</SelectItem>
                  <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  <SelectItem value="annual">Annual Report</SelectItem>
                  <SelectItem value="valuation_update">
                    Valuation Update
                  </SelectItem>
                  <SelectItem value="special">Special Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Q3 2024 Financial Results"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report_date">Report Date</Label>
              <Input
                id="report_date"
                type="date"
                value={formData.report_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    report_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period_start">Period Start (Optional)</Label>
              <Input
                id="period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    period_start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period_end">Period End (Optional)</Label>
              <Input
                id="period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) =>
                  setFormData({ ...formData, period_end: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="executive_summary">Executive Summary</Label>
            <Textarea
              id="executive_summary"
              value={formData.executive_summary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  executive_summary: e.target.value,
                })
              }
              placeholder="Provide a high-level overview of the report..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key_highlights">Key Highlights</Label>
            <Textarea
              id="key_highlights"
              value={formData.key_highlights}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  key_highlights: e.target.value,
                })
              }
              placeholder="List key achievements, milestones, and important updates..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges_risks">Challenges & Risks</Label>
            <Textarea
              id="challenges_risks"
              value={formData.challenges_risks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  challenges_risks: e.target.value,
                })
              }
              placeholder="Discuss any challenges, risks, or obstacles..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="forward_outlook">Forward Outlook</Label>
            <Textarea
              id="forward_outlook"
              value={formData.forward_outlook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  forward_outlook: e.target.value,
                })
              }
              placeholder="Share future plans, projections, and next steps..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notify_investors"
              checked={formData.notify_investors}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notify_investors: e.target.checked,
                })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="notify_investors" className="text-sm">
              Notify investors when published
            </Label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Report</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvestorReportsManager;
