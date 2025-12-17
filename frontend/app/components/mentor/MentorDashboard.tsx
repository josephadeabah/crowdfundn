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
  Loader2,
  Tag,
  Bell,
  UserCheck,
  UserX,
  Eye,
  ChevronRight,
  Menu,
  X,
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
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Assignment[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal states
  const [isMaxAssignmentsModalOpen, setIsMaxAssignmentsModalOpen] =
    useState(false);
  const [newMaxAssignments, setNewMaxAssignments] = useState('');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isViewRequestsModalOpen, setIsViewRequestsModalOpen] = useState(false);
  const [isActiveAssignmentsModalOpen, setIsActiveAssignmentsModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [isNewRequestsModalOpen, setIsNewRequestsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Assignment | null>(
    null,
  );

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
        setAllAssignments(assignmentsList);

        // Filter for pending requests
        const pending = assignmentsList.filter(
          (assignment: Assignment) => assignment.status === 'pending',
        );
        setPendingRequests(pending);

        // Filter for active assignments (approved or active)
        const active = assignmentsList.filter(
          (assignment: Assignment) =>
            assignment.status === 'active' || assignment.status === 'approved',
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

  const handleRequestAction = async (
    requestId: number,
    action: 'approve' | 'reject',
    notes?: string,
  ) => {
    if (!token) return;

    try {
      const endpoint =
        action === 'approve' ? 'approve_assignment' : 'cancel_assignment';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/${requestId}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentor_notes: notes,
          }),
        },
      );

      if (response.ok) {
        showToast(
          'Success',
          `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        );
        fetchAssignments();
        fetchDashboardData();
        setIsNewRequestsModalOpen(false);
        setSelectedRequest(null);
      } else {
        const error = await response.json();
        showToast(
          'Error',
          error.error || `Failed to ${action} request`,
          'error',
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      showToast('Error', `Failed to ${action} request`, 'error');
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
            rating: 5,
            feedback: 'Mentorship completed successfully',
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
        showToast(
          'Error',
          error.error || 'Failed to complete assignment',
          'error',
        );
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

  const getProgressPercentage = (
    current: number | undefined,
    goal: number | undefined,
  ) => {
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
          className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter a number"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsMaxAssignmentsModalOpen(false);
            setNewMaxAssignments('');
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={updateMaxAssignments}
          className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Update
        </Button>
      </div>
    </div>
  );

  // Modal content for new mentorship requests
  const NewRequestsModalContent = () => {
    if (selectedRequest) {
      const progress = getProgressPercentage(
        selectedRequest.campaign?.current_amount,
        selectedRequest.campaign?.goal_amount,
      );

      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Review Mentorship Request
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              <span className="text-sm text-gray-500">
                Requested: {formatDate(selectedRequest.created_at)}
              </span>
            </div>
          </div>

          {/* Campaign Information */}
          {selectedRequest.campaign && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-gray-800">
                  Campaign Information
                </h4>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Founder:</span>
                    </div>
                    <span className="font-medium text-sm sm:text-base truncate ml-6 sm:ml-0">
                      {selectedRequest.campaign.fundraiser_name ||
                        selectedRequest.entrepreneur?.full_name ||
                        'Unknown'}
                    </span>
                  </div>

                  {selectedRequest.campaign.category && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center text-gray-600">
                        <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Category:</span>
                      </div>
                      <Badge variant="outline" className="mt-1 sm:mt-0">
                        {selectedRequest.campaign.category}
                      </Badge>
                    </div>
                  )}

                  {selectedRequest.campaign.location && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Location:</span>
                      </div>
                      <span className="text-sm sm:text-base truncate ml-6 sm:ml-0">
                        {selectedRequest.campaign.location}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          selectedRequest.campaign.current_amount,
                        )}{' '}
                        / {formatCurrency(selectedRequest.campaign.goal_amount)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-gray-500 text-right">
                      {progress.toFixed(1)}% funded
                    </div>
                  </div>
                </div>
              </div>

              {/* Entrepreneur Notes */}
              {selectedRequest.entrepreneur_notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    Founder's Message
                  </h5>
                  <p className="text-sm text-blue-800 italic">
                    "{selectedRequest.entrepreneur_notes}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            {selectedRequest.campaign?.id && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `/campaign/${selectedRequest.campaign?.id}`,
                    '_blank',
                  )
                }
                className="w-full sm:flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Campaign
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null);
              }}
              className="w-full sm:flex-1"
            >
              Back to List
            </Button>

            <Button
              onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
              className="w-full sm:flex-1 bg-red-600 hover:bg-red-700"
            >
              <UserX className="h-4 w-4 mr-2" />
              Decline
            </Button>

            <Button
              onClick={() => handleRequestAction(selectedRequest.id, 'approve')}
              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-semibold">New Mentorship Requests</h3>
          <Badge className="bg-yellow-100 text-yellow-800 self-start sm:self-center">
            {pendingRequests.length} Pending
          </Badge>
        </div>

        {assignmentsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {pendingRequests.map((request) => (
              <Card
                key={request.id}
                className="border hover:shadow-none transition-shadow overflow-hidden"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">
                          {request.campaign?.title || 'New Mentorship Request'}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          From: {request.entrepreneur?.full_name || 'Unknown'}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 self-start sm:self-center">
                        Pending
                      </Badge>
                    </div>

                    {request.entrepreneur_notes && (
                      <div className="bg-blue-50 p-2 sm:p-3 rounded-none">
                        <p className="text-xs sm:text-sm text-blue-800 italic line-clamp-2">
                          "{request.entrepreneur_notes}"
                        </p>
                      </div>
                    )}

                    {request.campaign && (
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-none">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-gray-600">Goal:</span>
                          <span className="font-semibold">
                            {formatCurrency(request.campaign.goal_amount)}
                          </span>
                        </div>
                        <Progress
                          value={getProgressPercentage(
                            request.campaign.current_amount,
                            request.campaign.goal_amount,
                          )}
                          className="h-1.5 sm:h-2"
                        />
                      </div>
                    )}

                    <div className="flex flex-col xs:flex-row gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full xs:flex-1"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                      <div className="flex gap-2 w-full xs:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 xs:flex-none text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() =>
                            handleRequestAction(request.id, 'reject')
                          }
                        >
                          <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm">Decline</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 xs:flex-none bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            handleRequestAction(request.id, 'approve')
                          }
                        >
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm">Accept</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No New Requests</h4>
            <p className="text-gray-600 mb-4 text-sm px-4">
              You don't have any new mentorship requests at the moment.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsNewRequestsModalOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  // Modal content for active assignment details
  const ActiveAssignmentModalContent = () => {
    if (!selectedAssignment) return null;

    const progress = getProgressPercentage(
      selectedAssignment.campaign?.current_amount,
      selectedAssignment.campaign?.goal_amount,
    );

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2 truncate">
            {selectedAssignment.campaign?.title || 'Assignment Details'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-green-100 text-green-800">Active</Badge>
            <span className="text-sm text-gray-500">
              Started: {formatDate(selectedAssignment.started_at)}
            </span>
          </div>
        </div>

        {/* Campaign Information */}
        {selectedAssignment.campaign && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-gray-800">
                Campaign Information
              </h4>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Founder:</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base truncate ml-6 sm:ml-0">
                    {selectedAssignment.campaign.fundraiser_name ||
                      selectedAssignment.entrepreneur?.full_name ||
                      'Unknown'}
                  </span>
                </div>

                {selectedAssignment.campaign.category && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center text-gray-600">
                      <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Category:</span>
                    </div>
                    <Badge variant="outline" className="mt-1 sm:mt-0">
                      {selectedAssignment.campaign.category}
                    </Badge>
                  </div>
                )}

                {selectedAssignment.campaign.location && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Location:</span>
                    </div>
                    <span className="text-sm sm:text-base truncate ml-6 sm:ml-0">
                      {selectedAssignment.campaign.location}
                    </span>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        selectedAssignment.campaign.current_amount,
                      )}{' '}
                      /{' '}
                      {formatCurrency(selectedAssignment.campaign.goal_amount)}
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
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
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
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
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

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
          {selectedAssignment.campaign?.id && (
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `/campaign/${selectedAssignment.campaign?.id}`,
                  '_blank',
                )
              }
              className="w-full sm:flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Campaign
            </Button>
          )}

          {selectedAssignment.entrepreneur?.email && (
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `/messages?user=${selectedAssignment.entrepreneur?.id}`)
              }
              className="w-full sm:flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Message Founder
            </Button>
          )}

          <Button
            onClick={() => handleCompleteAssignment(selectedAssignment.id)}
            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Mentorship
          </Button>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t">
          <h5 className="font-semibold mb-3 text-gray-800">Timeline</h5>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-gray-600">Request Received:</span>
              <span>{formatDate(selectedAssignment.created_at)}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <span className="text-gray-600">Mentorship Started:</span>
              <span>{formatDate(selectedAssignment.started_at)}</span>
            </div>
            {selectedAssignment.completed_at && (
              <div className="flex flex-col sm:flex-row justify-between gap-1">
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
        <CardContent className="py-8 text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Data</h3>
          <p className="text-gray-600 mb-4">
            There was an error loading your mentor information.
          </p>
          <Button
            onClick={fetchDashboardData}
            className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700 w-full sm:w-auto"
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
        <CardContent className="py-8 text-center px-4">
          <Hourglass className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Application Pending Review
          </h3>
          <p className="text-gray-600 mb-4">
            Your mentor application has been submitted and is under review.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left mx-2">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-yellow-800">
                  Application Details
                </h4>
                {dashboardData.application && (
                  <>
                    <p className="text-sm text-yellow-700 mt-1 truncate">
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

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              onClick={() =>
                (window.location.href = '/mentor/application/status')
              }
              variant="outline"
              className="w-full sm:w-auto"
            >
              View Application Status
            </Button>
            <Button
              onClick={() => (window.location.href = '/account#Settings')}
              className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Update KYC Information
            </Button>
          </div>
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
        <CardContent className="py-8 text-center px-4">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not a Mentor Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't applied to become a mentor yet.
          </p>
          <Button
            onClick={() => (window.location.href = '/mentor/application')}
            className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700 
                     w-full sm:w-auto
                     px-4 py-2 h-auto min-h-[44px] 
                     text-sm sm:text-base 
                     whitespace-normal text-center"
          >
            Apply to Become a Mentor
          </Button>
          <p className="text-xs text-gray-500 mt-3 px-2">
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
    const pendingRequestsCount = pendingRequests.length;
    const completedAssignmentsCount = assignments.completed || 0;
    const totalAssignmentsCount =
      statistics.total_assignments || completedAssignmentsCount;

    return (
      <>
        <div className="space-y-6">
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Mentor Dashboard</h2>
              <p className="text-sm text-gray-600">
                Manage mentorship assignments
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Header - Desktop */}
          <div className="hidden sm:flex justify-between items-center">
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
                className="hidden sm:inline-flex"
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden bg-white rounded-lg shadow-none p-4 space-y-3 border">
              <div className="flex items-center justify-between">
                <Badge
                  className={`px-3 py-1 ${mentor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {mentor.status === 'approved' ? 'Available' : 'Unavailable'}
                </Badge>
                <Badge className="px-3 py-1 bg-blue-100 text-blue-800">
                  <Award className="h-4 w-4 mr-1" />
                  {parseFloat(mentor.rating as any)?.toFixed(1) || '0.0'}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditProfileModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Edit Profile
              </Button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Active
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                      {activeAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
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
                    className="h-1.5 sm:h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Pending
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                      {pendingRequestsCount}
                    </h3>
                  </div>
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs sm:text-sm"
                    onClick={() => setIsNewRequestsModalOpen(true)}
                    disabled={pendingRequestsCount === 0}
                  >
                    {pendingRequestsCount > 0 ? 'Review' : 'None'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                      {completedAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 mr-1" />
                    <span className="truncate">
                      {parseFloat(mentor.rating as any)?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Impact
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                      {totalAssignmentsCount}
                    </h3>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    Ventures mentored
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Assignments */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">
                Active Mentorships
              </CardTitle>
              <CardDescription className="text-sm">
                Ventures you're currently mentoring
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {assignmentsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : activeAssignmentsCount > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    You have {activeAssignmentsCount} active assignment(s).
                  </p>

                  <div className="space-y-3">
                    {activeAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border rounded-lg p-3 sm:p-4 hover:shadow-none transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base sm:text-lg mb-1 truncate">
                              {assignment.campaign?.title ||
                                'Untitled Campaign'}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                              Founder:{' '}
                              {assignment.campaign?.fundraiser_name ||
                                assignment.entrepreneur?.full_name ||
                                'Unknown'}
                            </p>
                            {assignment.entrepreneur_notes && (
                              <p className="text-xs sm:text-sm text-gray-700 italic mb-2 line-clamp-2">
                                "{assignment.entrepreneur_notes}"
                              </p>
                            )}
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                Started: {formatDate(assignment.started_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                            {assignment.campaign?.category && (
                              <Badge variant="outline" className="text-xs">
                                {assignment.campaign.category}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewAssignmentDetails(assignment)
                            }
                            className="flex-1 text-xs sm:text-sm"
                          >
                            Details
                          </Button>
                          {assignment.campaign?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  `/campaigns/${assignment.campaign?.id}`,
                                  '_blank',
                                )
                              }
                              className="p-2"
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
                <div className="text-center py-6 sm:py-8">
                  <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h4 className="font-semibold text-base sm:text-lg mb-2">
                    No Active Assignments
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 px-2">
                    You don't have any active mentorship assignments.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewRequestsModalOpen(true)}
                    className="w-full sm:w-auto"
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
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">
                  Recent Reviews
                </CardTitle>
                <CardDescription className="text-sm">
                  Feedback from your completed mentorships
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {reviews.slice(0, 3).map((review: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">
                            {review.campaign_title || 'Untitled Campaign'}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {review.entrepreneur_name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                star <= (review.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.feedback && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
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
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Reviews</CardTitle>
                  <CardDescription className="text-sm">
                    No reviews yet for your completed assignments
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 sm:py-8">
                  <Star className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm text-gray-600 px-2">
                    Your completed assignments don't have reviews yet.
                  </p>
                </CardContent>
              </Card>
            )
          )}

          {/* Expertise Section */}
          {expertise.length > 0 && (
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl">
                  Areas of Expertise
                </CardTitle>
                <CardDescription className="text-sm">
                  Your mentorship specialties
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {expertise.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs sm:text-sm capitalize px-2 py-1"
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
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">
                Availability Settings
              </CardTitle>
              <CardDescription className="text-sm">
                Control your mentorship capacity and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Maximum Concurrent Assignments
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Set how many ventures you can mentor at once
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base sm:text-lg font-semibold">
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
                      className="text-xs sm:text-sm"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Mentor Status
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
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
                    className="bg-emerald-700 text-white hover:bg-emerald-800 text-xs sm:text-sm w-full sm:w-auto"
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
          isOpen={isNewRequestsModalOpen}
          onClose={() => {
            setIsNewRequestsModalOpen(false);
            setSelectedRequest(null);
          }}
          size="large"
        >
          <NewRequestsModalContent />
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
      <CardContent className="py-8 text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unexpected State</h3>
        <p className="text-gray-600 mb-4">
          There was an unexpected error loading your mentor dashboard.
        </p>
        <div className="overflow-x-auto">
          <pre className="text-xs bg-gray-100 p-2 rounded text-left max-w-full overflow-auto">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorDashboard;
