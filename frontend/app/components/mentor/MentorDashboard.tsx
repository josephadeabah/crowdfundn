// app/components/mentor/MentorDashboard.tsx
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
import { Progress } from '@/app/components/ui/progress';
import {
  Users,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  TrendingUp,
  Award,
  FileText,
  Hourglass,
  AlertCircle,
  ExternalLink,
  Mail,
  Globe,
  Building,
  User,
  Target,
  DollarSign,
  Loader2,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import Modal from '@/app/components/modal/Modal';
import ToastComponent from '@/app/components/toast/Toast';
import EditMentorProfile from '@/app/components/mentor/EditMentorProfile';
import ViewAvailableRequests from './ViewAvailableRequests';

interface MentorDashboardProps {
  mentorId?: number;
}

interface MentorData {
  has_mentor_profile: boolean;
  has_mentor_application: boolean;
  mentor?: {
    id: number;
    professional_title: string;
    rating: number | string;
    current_assignments: number;
    max_assignments: number;
    status: string;
    expertise: string[];
    years_of_experience?: number;
    bio?: string;
    linkedin_profile?: string;
    hourly_rate?: number;
    reviews_count?: number;
    created_at?: string;
    updated_at?: string;
  };
  application?: {
    id: number;
    status: string;
    submitted_at: string;
    professional_title: string;
    years_of_experience: number;
  };
  assignments?: {
    current: number;
    max: number;
    completed: number;
    active: number;
  };
  reviews?: Array<{
    rating: number;
    feedback?: string;
    campaign_title?: string;
    entrepreneur_name?: string;
    completed_at?: string;
  }>;
  statistics?: {
    total_assignments: number;
  };
  expertise?: string[];
  message?: string;
}

interface Assignment {
  id: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  campaign?: {
    id: number;
    title: string;
    description: string;
    goal_amount: number;
    current_amount: number;
    category: string;
    location: string;
    created_at: string;
    fundraiser_name?: string;
    fundraiser?: {
      id: number;
      full_name: string;
      email?: string;
    };
  };
  entrepreneur?: {
    id: number;
    full_name: string;
    email?: string;
  };
  entrepreneur_notes?: string;
  mentor_notes?: string;
  started_at?: string;
  completed_at?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentorId }) => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);

  // Modal states
  const [isMaxAssignmentsModalOpen, setIsMaxAssignmentsModalOpen] =
    useState(false);
  const [newMaxAssignments, setNewMaxAssignments] = useState('');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isViewRequestsModalOpen, setIsViewRequestsModalOpen] = useState(false);
  const [isReviewRequestsModalOpen, setIsReviewRequestsModalOpen] =
    useState(false);
  const [isActiveAssignmentsModalOpen, setIsActiveAssignmentsModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

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
    type: 'success' | 'error' | 'warning' = 'success',
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

  useEffect(() => {
    fetchDashboardData();
  }, [mentorId, token]);

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/mentors/my_mentor_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        
        // If user has mentor profile, fetch assignments
        if (data.has_mentor_profile) {
          fetchAssignments();
        }
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Error', 'Failed to load mentor dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    if (!token) return;

    try {
      setAssignmentsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/my_mentor_assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const assignmentsList = data.assignments || [];
        
        // Filter for active assignments
        const active = assignmentsList.filter(
          (assignment: Assignment) => assignment.status === 'active' || assignment.status === 'approved'
        );
        setActiveAssignments(active);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const updateMaxAssignments = async () => {
    if (!token || !newMaxAssignments) return;

    const parsedMax = parseInt(newMaxAssignments);
    if (isNaN(parsedMax) || parsedMax <= 0) {
      showToast('Error', 'Please enter a valid positive number', 'error');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/mentors/update_availability`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            max_assignments: parsedMax,
          }),
        },
      );

      if (response.ok) {
        showToast('Success', 'Maximum assignments updated successfully');
        setIsMaxAssignmentsModalOpen(false);
        setNewMaxAssignments('');
        fetchDashboardData();
      } else {
        const error = await response.json();
        showToast(
          'Error',
          error.error || 'Failed to update maximum assignments',
          'error',
        );
      }
    } catch (error) {
      console.error('Error updating max assignments:', error);
      showToast('Error', 'Failed to update maximum assignments', 'error');
    }
  };

  const toggleAvailability = async () => {
    if (!token || !dashboardData?.mentor) return;

    const newStatus =
      dashboardData.mentor.status === 'approved' ? 'inactive' : 'approved';

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/mentors/update_availability`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (response.ok) {
        showToast(
          'Success',
          `Status updated to ${newStatus === 'approved' ? 'Available' : 'Unavailable'}`,
        );
        fetchDashboardData();
      } else {
        const error = await response.json();
        showToast(
          'Error',
          error.error || 'Failed to update availability',
          'error',
        );
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      showToast('Error', 'Failed to update availability', 'error');
    }
  };

  const handleViewAssignmentDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsActiveAssignmentsModalOpen(true);
  };

  const handleCompleteAssignment = async (assignmentId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/${assignmentId}/complete_assignment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: 5, // You can add a rating input in the modal
            feedback: 'Mentorship completed successfully', // You can add a feedback input
          }),
        },
      );

      if (response.ok) {
        showToast('Success', 'Assignment completed successfully');
        setIsActiveAssignmentsModalOpen(false);
        setSelectedAssignment(null);
        fetchDashboardData();
        fetchAssignments();
      } else {
        const error = await response.json();
        showToast('Error', error.error || 'Failed to complete assignment', 'error');
      }
    } catch (error) {
      console.error('Error completing assignment:', error);
      showToast('Error', 'Failed to complete assignment', 'error');
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Date error';
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  };

  const getProgressPercentage = (current: number | undefined, goal: number | undefined) => {
    const safeCurrent = current || 0;
    const safeGoal = goal || 0;
    if (safeGoal === 0) return 0;
    return Math.min((safeCurrent / safeGoal) * 100, 100);
  };

  // Modal content for editing maximum assignments
  const MaxAssignmentsModalContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Update Maximum Assignments</h3>
      <p className="text-gray-600 text-sm">
        Set how many ventures you can mentor at once
      </p>
      <div className="space-y-2">
        <label
          htmlFor="maxAssignments"
          className="block text-sm font-medium text-gray-700"
        >
          Maximum Concurrent Assignments
        </label>
        <input
          type="number"
          id="maxAssignments"
          min="1"
          value={newMaxAssignments}
          onChange={(e) => setNewMaxAssignments(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter a number"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsMaxAssignmentsModalOpen(false);
            setNewMaxAssignments('');
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={updateMaxAssignments}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Update
        </Button>
      </div>
    </div>
  );

  // Modal content for reviewing requests
  const ReviewRequestsModalContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Requests</h3>
      <p className="text-gray-600 text-sm">
        This would normally load your pending mentorship requests. For now, you
        can navigate to the full requests page.
      </p>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsReviewRequestsModalOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setIsReviewRequestsModalOpen(false);
            window.location.href = '/mentor/requests';
          }}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Review All Requests
        </Button>
      </div>
    </div>
  );

  // Modal content for active assignment details
  const ActiveAssignmentModalContent = () => {
    if (!selectedAssignment) return null;

    const progress = getProgressPercentage(
      selectedAssignment.campaign?.current_amount,
      selectedAssignment.campaign?.goal_amount
    );

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">
            {selectedAssignment.campaign?.title || 'Assignment Details'}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-800">
              Active
            </Badge>
            <span className="text-sm text-gray-500">
              Started: {formatDate(selectedAssignment.started_at)}
            </span>
          </div>
        </div>

        {/* Campaign Information */}
        {selectedAssignment.campaign && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-gray-800">Campaign Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Founder:</span>
                  </div>
                  <span className="font-medium">
                    {selectedAssignment.campaign.fundraiser_name || 
                     selectedAssignment.entrepreneur?.full_name || 
                     'Unknown'}
                  </span>
                </div>

                {selectedAssignment.campaign.category && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Tag className="h-4 w-4 mr-2" />
                      <span>Category:</span>
                    </div>
                    <Badge variant="outline">{selectedAssignment.campaign.category}</Badge>
                  </div>
                )}

                {selectedAssignment.campaign.location && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Location:</span>
                    </div>
                    <span>{selectedAssignment.campaign.location}</span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedAssignment.campaign.current_amount)} / {formatCurrency(selectedAssignment.campaign.goal_amount)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-gray-500 text-right">
                    {progress.toFixed(1)}% funded
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              {selectedAssignment.entrepreneur_notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Founder's Message
                  </h5>
                  <p className="text-sm text-blue-800 italic">
                    "{selectedAssignment.entrepreneur_notes}"
                  </p>
                </div>
              )}

              {selectedAssignment.mentor_notes && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h5 className="font-semibold text-emerald-900 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Your Notes
                  </h5>
                  <p className="text-sm text-emerald-800">
                    {selectedAssignment.mentor_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {selectedAssignment.campaign?.id && (
            <Button
              variant="outline"
              onClick={() => window.open(`/campaign/${selectedAssignment.campaign?.id}`, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Campaign
            </Button>
          )}

          {selectedAssignment.entrepreneur?.email && (
            <Button
              variant="outline"
              onClick={() => window.location.href = `/messages?user=${selectedAssignment.entrepreneur?.id}`}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Message Founder
            </Button>
          )}

          <Button
            onClick={() => handleCompleteAssignment(selectedAssignment.id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Mentorship
          </Button>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t">
          <h5 className="font-semibold mb-3 text-gray-800">Timeline</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Request Received:</span>
              <span>{formatDate(selectedAssignment.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mentorship Started:</span>
              <span>{formatDate(selectedAssignment.started_at)}</span>
            </div>
            {selectedAssignment.completed_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span>{formatDate(selectedAssignment.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  // Handle different states based on the response
  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Data</h3>
          <p className="text-gray-600 mb-4 px-4">
            There was an error loading your mentor information.
          </p>
          <Button
            onClick={fetchDashboardData}
            className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Application Pending Review State
  if (
    dashboardData.has_mentor_application &&
    !dashboardData.has_mentor_profile
  ) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Hourglass className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Application Pending Review
          </h3>
          <p className="text-gray-600 mb-4 px-4">
            Your mentor application has been submitted and is under review.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">
                  Application Details
                </h4>
                {dashboardData.application && (
                  <>
                    <p className="text-sm text-yellow-700 mt-1">
                      <strong>Professional Title:</strong>{' '}
                      {dashboardData.application.professional_title}
                    </p>
                    <p className="text-sm text-yellow-700">
                      <strong>Experience:</strong>{' '}
                      {dashboardData.application.years_of_experience} years
                    </p>
                    <p className="text-sm text-yellow-700">
                      <strong>Submitted:</strong>{' '}
                      {new Date(
                        dashboardData.application.submitted_at,
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-yellow-700">
                      <strong>Status:</strong>{' '}
                      <span className="capitalize">
                        {dashboardData.application.status}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() =>
              (window.location.href = '/mentor/application/status')
            }
            variant="outline"
            className="mr-2"
          >
            View Application Status
          </Button>
          <Button
            onClick={() => (window.location.href = '/account#Settings')}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Update KYC Information
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not a Mentor Yet State
  if (
    !dashboardData.has_mentor_application &&
    !dashboardData.has_mentor_profile
  ) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not a Mentor Yet</h3>
          <p className="text-gray-600 mb-4 px-4">
            You haven't applied to become a mentor yet.
          </p>
          <Button
            onClick={() => (window.location.href = '/mentor/application')}
            className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700 
                     px-4 py-2 h-auto min-h-[44px] 
                     text-sm sm:text-base 
                     whitespace-normal text-center 
                     mx-2 sm:mx-0"
          >
            <span className="block sm:hidden">Apply to Become a Mentor</span>
            <span className="hidden sm:block">Apply to Become a Mentor</span>
          </Button>
          <p className="text-xs text-gray-500 mt-3 px-4">
            Complete your KYC verification first, then submit a mentor
            application
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mentor Dashboard - User has a mentor profile
  if (dashboardData.has_mentor_profile && dashboardData.mentor) {
    const {
      mentor,
      assignments = { current: 0, max: 0, completed: 0, active: 0 },
      statistics = { total_assignments: 0 },
      reviews = [],
      expertise = [],
    } = dashboardData;

    const activeAssignmentsCount = activeAssignments.length;
    const pendingRequestsCount = 0;
    const completedAssignmentsCount = assignments.completed || 0;
    const totalAssignmentsCount =
      statistics.total_assignments || completedAssignmentsCount;

    return (
      <>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Mentor Dashboard</h2>
              <p className="text-gray-600">
                Manage your mentorship assignments and profile
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={`px-3 py-1 ${mentor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {mentor.status === 'approved' ? 'Available' : 'Unavailable'}
              </Badge>
              <Badge className="px-3 py-1 bg-blue-100 text-blue-800">
                <Award className="h-4 w-4 mr-1" />
                {parseFloat(mentor.rating as any)?.toFixed(1) || '0.0'} Rating
              </Badge>
              <Button
                variant="outline"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Assignments
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {activeAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Capacity</span>
                    <span>
                      {assignments.current || 0}/{assignments.max || '∞'}
                    </span>
                  </div>
                  <Progress
                    value={
                      ((assignments.current || 0) / (assignments.max || 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Requests
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {pendingRequestsCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsReviewRequestsModalOpen(true)}
                  >
                    Review Requests
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {completedAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>
                      Average Rating:{' '}
                      {parseFloat(mentor.rating as any)?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Impact
                    </p>
                    <h3 className="text-2xl font-bold mt-2">
                      {totalAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Ventures mentored</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Active Mentorships</CardTitle>
              <CardDescription>
                Ventures you're currently mentoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignmentsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : activeAssignmentsCount > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    You have {activeAssignmentsCount} active assignment(s).
                  </p>
                  
                  <div className="space-y-3">
                    {activeAssignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">
                              {assignment.campaign?.title || 'Untitled Campaign'}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Founder: {assignment.campaign?.fundraiser_name || assignment.entrepreneur?.full_name || 'Unknown'}
                            </p>
                            {assignment.entrepreneur_notes && (
                              <p className="text-sm text-gray-700 italic mb-2 line-clamp-2">
                                "{assignment.entrepreneur_notes}"
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Started: {formatDate(assignment.started_at)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                            {assignment.campaign?.category && (
                              <Badge variant="outline" className="text-xs">
                                {assignment.campaign.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-4 border-t mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAssignmentDetails(assignment)}
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          {assignment.campaign?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/campaigns/${assignment.campaign?.id}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">No Active Assignments</h4>
                  <p className="text-gray-600 mb-4">
                    You don't have any active mentorship assignments.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewRequestsModalOpen(true)}
                  >
                    View Available Requests
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          {reviews.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>
                  Feedback from your completed mentorships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {review.campaign_title || 'Untitled Campaign'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {review.entrepreneur_name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (review.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.feedback && (
                        <p className="text-gray-600 mt-2 text-sm">
                          "{review.feedback}"
                        </p>
                      )}
                      {review.completed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed on{' '}
                          {new Date(review.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            completedAssignmentsCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>
                    No reviews yet for your completed assignments
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Your completed assignments don't have reviews yet.
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Expertise Section */}
          {expertise.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
                <CardDescription>Your mentorship specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expertise.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="capitalize"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Availability Management */}
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>
                Control your mentorship capacity and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      Maximum Concurrent Assignments
                    </h4>
                    <p className="text-sm text-gray-600">
                      Set how many ventures you can mentor at once
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">
                      {mentor.max_assignments || 'Unlimited'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewMaxAssignments(
                          mentor.max_assignments?.toString() || '5',
                        );
                        setIsMaxAssignmentsModalOpen(true);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Mentor Status</h4>
                    <p className="text-sm text-gray-600">
                      {mentor.status === 'approved'
                        ? 'Available for new assignments'
                        : 'Not accepting new assignments'}
                    </p>
                  </div>
                  <Button
                    variant={
                      mentor.status === 'approved' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={toggleAvailability}
                    className="bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {mentor.status === 'approved'
                      ? 'Set as Unavailable'
                      : 'Set as Available'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isMaxAssignmentsModalOpen}
          onClose={() => {
            setIsMaxAssignmentsModalOpen(false);
            setNewMaxAssignments('');
          }}
          size="medium"
        >
          <MaxAssignmentsModalContent />
        </Modal>

        <Modal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          size="xlarge"
        >
          <EditMentorProfile
            mentor={mentor}
            expertise={expertise}
            onSuccess={() => {
              setIsEditProfileModalOpen(false);
              fetchDashboardData();
            }}
            onCancel={() => setIsEditProfileModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isViewRequestsModalOpen}
          onClose={() => setIsViewRequestsModalOpen(false)}
          size="huge"
        >
          <ViewAvailableRequests
            onSuccess={() => {
              setIsViewRequestsModalOpen(false);
              fetchDashboardData();
              fetchAssignments();
            }}
            onCancel={() => setIsViewRequestsModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isReviewRequestsModalOpen}
          onClose={() => setIsReviewRequestsModalOpen(false)}
          size="large"
        >
          <ReviewRequestsModalContent />
        </Modal>

        <Modal
          isOpen={isActiveAssignmentsModalOpen}
          onClose={() => {
            setIsActiveAssignmentsModalOpen(false);
            setSelectedAssignment(null);
          }}
          size="large"
        >
          <ActiveAssignmentModalContent />
        </Modal>

        {/* Toast Component */}
        <ToastComponent
          isOpen={toast.isOpen}
          onClose={closeToast}
          title={toast.title}
          description={toast.description}
          type={toast.type}
        />
      </>
    );
  }

  // Fallback - shouldn't reach here
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unexpected State</h3>
        <p className="text-gray-600 mb-4 px-4">
          There was an unexpected error loading your mentor dashboard.
        </p>
        <pre className="text-xs bg-gray-100 p-2 rounded text-left overflow-auto">
          {JSON.stringify(dashboardData, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default MentorDashboard;