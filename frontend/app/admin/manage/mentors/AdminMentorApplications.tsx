// app/components/admin/AdminMentorApplications.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useToast } from '@/app/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface MentorApplication {
  id: number;
  user_id: number;
  user: {
    id: number;
    full_name: string;
    email: string;
    profile?: {
      avatar_url?: string;
    };
  };
  tracking_id: string;
  professional_title: string;
  years_of_experience: number;
  industry_expertise: string[];
  previous_mentoring: string;
  linkedin_profile: string;
  resume_url?: string;
  mentorship_approach: string;
  availability: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  review_notes?: string;
  mentor?: {
    id: number;
    status: string;
  };
}

const AdminMentorApplications: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    MentorApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<MentorApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [maxAssignments, setMaxAssignments] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    if (token) {
      fetchApplications();
      fetchStats();
    }
  }, [token]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin/mentor_applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor applications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/mentor_applications/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app?.user?.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app?.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app?.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app?.professional_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case 'under_review':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <FileText className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            {status}
          </Badge>
        );
    }
  };

  const approveApplication = async () => {
    if (!selectedApplication) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/mentor_applications/${selectedApplication.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review_notes: reviewNotes,
            max_assignments: maxAssignments,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Mentor application approved successfully',
        });

        // Refresh data
        fetchApplications();
        fetchStats();

        // Close dialog
        setSelectedApplication(null);
        setReviewNotes('');
        setMaxAssignments(5);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to approve application',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve application',
        variant: 'destructive',
      });
    }
  };

  const rejectApplication = async () => {
    if (!selectedApplication) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/mentor_applications/${selectedApplication.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review_notes: reviewNotes,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Mentor application rejected',
        });

        // Refresh data
        fetchApplications();
        fetchStats();

        // Close dialog
        setSelectedApplication(null);
        setReviewNotes('');
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to reject application',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application',
        variant: 'destructive',
      });
    }
  };

  const requestAdditionalInfo = async () => {
    if (!selectedApplication) return;

    const requestedInfo = prompt('What additional information do you need?');
    if (!requestedInfo) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/mentor_applications/${selectedApplication.id}/request_additional_info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requested_info: requestedInfo,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Information request sent to applicant',
        });
        setSelectedApplication(null);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to send request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting info:', error);
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive',
      });
    }
  };

  const viewApplicationDetails = (application: MentorApplication) => {
    setSelectedApplication(application);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mentor Applications</h2>
          <p className="text-gray-600">Review and manage mentor applications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {applications.length} Total Applications
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Review
                  </p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stats.totals?.pending || 0}
                  </h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stats.totals?.approved || 0}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stats.totals?.rejected || 0}
                  </h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Approval Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stats.totals?.approval_rate || 0}%
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline" onClick={fetchApplications}>
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} applications found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Professional Title</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application?.id}>
                  <TableCell>
                    <div className="font-medium">
                      {application?.user?.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application?.user?.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {application?.tracking_id}
                    </div>
                  </TableCell>
                  <TableCell>{application?.professional_title}</TableCell>
                  <TableCell>
                    {application?.years_of_experience} years
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {application?.industry_expertise
                        .slice(0, 2)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      {application?.industry_expertise?.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{application?.industry_expertise?.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application?.submitted_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(application?.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewApplicationDetails(application)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'No mentor applications at this time'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      {selectedApplication && (
        <Dialog
          open={!!selectedApplication}
          onOpenChange={() => setSelectedApplication(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Mentor Application</DialogTitle>
              <DialogDescription>
                Application ID: {selectedApplication?.tracking_id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Applicant Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Applicant Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Name
                      </h4>
                      <p>{selectedApplication?.user?.full_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Email
                      </h4>
                      <p>{selectedApplication?.user?.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Professional Title
                      </h4>
                      <p>{selectedApplication?.professional_title}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">
                        Years of Experience
                      </h4>
                      <p>{selectedApplication?.years_of_experience} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication?.industry_expertise.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Previous Mentoring Experience
                    </h4>
                    <p className="capitalize">
                      {selectedApplication?.previous_mentoring}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Availability
                    </h4>
                    <p className="capitalize">
                      {selectedApplication?.availability}
                    </p>
                  </div>

                  {selectedApplication?.linkedin_profile && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">
                        LinkedIn Profile
                      </h4>
                      <a
                        href={selectedApplication?.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApplication?.linkedin_profile}
                      </a>
                    </div>
                  )}

                  {selectedApplication?.resume_url && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">
                        Resume
                      </h4>
                      <a
                        href={selectedApplication?.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mentorship Approach */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentorship Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedApplication?.mentorship_approach}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Review Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review & Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">
                      Review Notes
                    </h4>
                    <Textarea
                      placeholder="Add review notes for internal reference..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {selectedApplication.status !== 'approved' && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">
                        Maximum Assignments (if approved)
                      </h4>
                      <select
                        value={maxAssignments}
                        onChange={(e) =>
                          setMaxAssignments(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value={3}>3 concurrent assignments</option>
                        <option value={5}>5 concurrent assignments</option>
                        <option value={8}>8 concurrent assignments</option>
                        <option value={10}>10 concurrent assignments</option>
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={requestAdditionalInfo}
                  disabled={selectedApplication.status === 'approved'}
                >
                  Request More Info
                </Button>
                <Button
                  variant="destructive"
                  onClick={rejectApplication}
                  disabled={selectedApplication.status === 'approved'}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Button
                  onClick={approveApplication}
                  disabled={selectedApplication.status === 'approved'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminMentorApplications;
